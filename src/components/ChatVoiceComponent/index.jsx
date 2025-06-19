import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Volume2, Brain, Square } from "lucide-react";
import { API_KEY, API_URL, OUTPUT_FORMAT } from "../../constants";
import ParsedStateViewer from "../ParsedStateViewer";
import BreathingOverlay from "../BreathingOverlay";
const ChatVoiceComponent = ({ formData }) => {
  const [showBreathing, setShowBreathing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("hi-IN");
  const [speechError, setSpeechError] = useState("");
  const [showBreathingButton, setShowBreathingButton] = useState(false);
  const recognitionRef = useRef(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [groundingTechnique, setGroundingTechnique] = useState("");

  const [stateJson, setStateJson] = useState({
    conversation_history: [],
    stage: "",
    gender: formData?.gender || "",
    mood:
      `${formData?.feeling}/5. 0 is SAD, 5 is happy.` ||
      "3/5. 0 is SAD, 5 is happy.",
    intro_message: "",
    dominant_experience: "",
    possible_classification: "",
    message_to_show_the_user: "",
    question_to_ask_the_user: "",
    value_choice_for_the_question: [],
    suggested_strategies: [],
    grounding_techniques: {
      technique: "",
      steps: [],
      state: false,
    },
    red_flag_check: {
      hopelessness: false,
      worthlessness: false,
      suicidal_thoughts: false,
    },
    active_action: "",
  });

  useEffect(() => {
    if (formData?.name && !hasGreeted) {
      const greeting =
        selectedLanguage === "hi-IN"
          ? `नमस्ते ${formData.name}, मैं आपके लिए यहाँ हूँ। आप आज कैसा महसूस कर रहे हैं?`
          : `Hi ${formData.name}, I'm here to support you. How are you feeling today?`;

      setMessages([{ text: greeting, sender: "bot" }]);

      setStateJson((prev) => ({
        ...prev,
        conversation_history: [
          ...prev.conversation_history,
          { role: "assistant", content: greeting },
        ],
      }));

      const utter = new SpeechSynthesisUtterance(greeting);
      utter.lang = selectedLanguage;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);

      setHasGreeted(true);
    }
  }, [formData?.name, hasGreeted, selectedLanguage]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSend(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setSpeechError("Sorry, I couldn't hear you. Please try again.");
        setIsRecording(false);
      };
    }
  }, []);

  useEffect(() => {
    if (speechError) {
      const timer = setTimeout(() => setSpeechError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [speechError]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const newUserMessage = { text, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    const updatedHistory = [
      ...stateJson.conversation_history,
      { role: "user", content: text },
    ];

    const gptMessages = [
      { role: "system", content: OUTPUT_FORMAT },
      ...updatedHistory,
    ];

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0,
          messages: gptMessages,
        }),
      });

      const result = await response.json();
      const parsed = JSON.parse(result.choices[0].message.content);
      const newState = parsed.state_json;

      const messageToShow = newState.message_to_show_the_user || "";
      const questionToAsk = newState.question_to_ask_the_user || "";

      const newMessages = [];
      if (messageToShow)
        newMessages.push({ text: messageToShow, sender: "bot" });
      if (questionToAsk)
        newMessages.push({ text: questionToAsk, sender: "bot" });

      setMessages((prev) => [...prev, ...newMessages]);
      setIsLoading(false);

      const updatedConversationHistory = [
        ...updatedHistory,
        ...(messageToShow
          ? [{ role: "assistant", content: messageToShow }]
          : []),
        ...(questionToAsk
          ? [{ role: "assistant", content: questionToAsk }]
          : []),
      ];

      setStateJson({
        ...newState,
        conversation_history: updatedConversationHistory,
      });

      // Show breathing button if state is true and hasn't been shown yet
      setShowBreathingButton(Boolean(newState.grounding_techniques?.state));
      setGroundingTechnique(newState.grounding_techniques.technique);

      const speakMessages = async () => {
        if (messageToShow) {
          await new Promise((resolve) => {
            const utterMessage = new SpeechSynthesisUtterance(messageToShow);
            utterMessage.lang = selectedLanguage;
            utterMessage.onstart = () => setIsSpeaking(true);
            utterMessage.onend = () => resolve();
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterMessage);
          });
        }

        if (questionToAsk) {
          await new Promise((resolve) => {
            const utterQuestion = new SpeechSynthesisUtterance(questionToAsk);
            utterQuestion.lang = selectedLanguage;
            utterQuestion.onstart = () => setIsSpeaking(true);
            utterQuestion.onend = () => {
              setIsSpeaking(false);
              resolve();
            };
            window.speechSynthesis.speak(utterQuestion);
          });
        } else {
          setIsSpeaking(false);
        }
      };

      await speakMessages();
    } catch (error) {
      console.error("Error during GPT call:", error);
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  const handleMicClick = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const SpeechErrorPopup = () => (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-xl shadow-md">
      {speechError}
    </div>
  );

  const RecordingPopup = () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl flex flex-col items-center space-y-4 shadow-lg">
        <div className="animate-pulse w-16 h-16 bg-red-500 rounded-full" />
        <p className="text-lg font-semibold">Listening...</p>
        <button
          onClick={handleMicClick}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
        >
          Stop Recording
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-1/2 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 text-black">
        {isRecording && <RecordingPopup />}
        {speechError && <SpeechErrorPopup />}

        <div className="p-4 flex justify-between items-center bg-white shadow-md rounded-b-2xl">
          <div className="flex items-center gap-2 text-green-600 font-semibold text-xl">
            <Brain size={28} />
            <span>Mann Mitr</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="hi-IN">Hindi</option>
            <option value="en-US">English</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl max-w-xs flex items-start gap-2 text-sm shadow-md ${
                msg.sender === "user"
                  ? "ml-auto bg-gradient-to-r from-blue-500 to-green-400 text-white"
                  : "mr-auto bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <span className="flex-1">{msg.text}</span>
              {msg.sender === "bot" && (
                <button
                  onClick={() => {
                    const utter = new SpeechSynthesisUtterance(msg.text);
                    utter.lang = selectedLanguage;
                    utter.onstart = () => setIsSpeaking(true);
                    utter.onend = () => setIsSpeaking(false);
                    speechSynthesis.cancel();
                    speechSynthesis.speak(utter);
                  }}
                  className="text-gray-400 hover:text-blue-600"
                >
                  <Volume2 size={20} />
                </button>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="p-4 rounded-2xl max-w-xs mr-auto bg-white text-gray-800 border border-gray-200 shadow-md flex items-center gap-2">
              <Brain size={20} className="animate-pulse text-green-600" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}

          {/* {showBreathingButton && (
            <div className="flex justify-center mt-4">
              <a
                href="/breathing"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition"
              >
                Try {groundingTechnique}
              </a>
            </div>
          )} */}
           {showBreathing && (
        <BreathingOverlay onClose={() => setShowBreathing(false)} />
      )}

          {showBreathingButton ?  <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowBreathing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition"
            >
              Try {groundingTechnique}
            </button>
          </div> : null }
         
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center gap-2 bg-white shadow-inner">
          <input
            type="text"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-300"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !isSpeaking &&
              !isLoading &&
              handleSend(input)
            }
            disabled={isSpeaking || isRecording || isLoading}
          />
          <button
            onClick={isSpeaking ? handleStopSpeaking : handleMicClick}
            className={`p-3 rounded-full transition shadow-md ${
              isSpeaking
                ? "bg-red-500 text-white hover:bg-red-600"
                : isRecording
                ? "bg-red-500 text-white"
                : "bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 text-blue-700"
            }`}
            disabled={
              (isSpeaking && !window.speechSynthesis.speaking) || isLoading
            }
          >
            {isSpeaking ? <Square size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={isSpeaking ? handleStopSpeaking : () => handleSend(input)}
            className={`p-3 rounded-full transition shadow-md ${
              isSpeaking
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
            }`}
            disabled={
              (isSpeaking && !window.speechSynthesis.speaking) || isLoading
            }
          >
            {isSpeaking ? <Square size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>

      <div className="w-1/2 border-l border-gray-300 bg-gray-50">
        <ParsedStateViewer stateJson={stateJson} />
      </div>
    </div>
  );
};

export default ChatVoiceComponent;
