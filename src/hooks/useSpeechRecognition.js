import { useEffect, useState } from "react";

export default function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const recognition =
    typeof window !== "undefined" &&
    window.SpeechRecognition
      ? new window.SpeechRecognition()
      : window.webkitSpeechRecognition
      ? new window.webkitSpeechRecognition()
      : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript("");
      setListening(true);
      recognition.start();
    }
  };

  return { transcript, listening, startListening };
}
