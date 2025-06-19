import React, { useState, useEffect, useRef } from "react";
const breathingPatterns = {
  "Box Breathing": [
    { label: "Inhale", duration: 4, color: "bg-blue-300" },
    { label: "Hold", duration: 4, color: "bg-green-300" },
    { label: "Exhale", duration: 4, color: "bg-red-300" },
    { label: "Hold", duration: 4, color: "bg-yellow-300" },
  ],
  "Physiological Sigh": [
    { label: "Inhale", duration: 2, color: "bg-blue-300" },
    { label: "Quick Inhale", duration: 1, color: "bg-blue-200" },
    { label: "Exhale", duration: 6, color: "bg-red-300" },
  ],
  "Pranayama (4-7-8)": [
    { label: "Inhale", duration: 4, color: "bg-blue-300" },
    { label: "Hold", duration: 7, color: "bg-green-300" },
    { label: "Exhale", duration: 8, color: "bg-red-300" },
  ],
  "Coherent Breathing": [
    { label: "Inhale", duration: 5, color: "bg-blue-300" },
    { label: "Exhale", duration: 5, color: "bg-red-300" },
  ],
};
function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}
export default function Breathing() {
  const [selectedPattern, setSelectedPattern] = useState("Box Breathing");
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    breathingPatterns[selectedPattern][0].duration
  );
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const elapsedRef = useRef(null);
  const pattern = breathingPatterns[selectedPattern];
  const currentStep = pattern[stepIndex];
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            const nextStep = (stepIndex + 1) % pattern.length;
            setStepIndex(nextStep);
            return pattern[nextStep].duration;
          }
          return prev - 1;
        });
      }, 1000);
      elapsedRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      clearInterval(elapsedRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(elapsedRef.current);
    };
  }, [isRunning, stepIndex, pattern]);
  useEffect(() => {
    setStepIndex(0);
    setSecondsLeft(pattern[0].duration);
    setElapsedTime(0);
    setIsRunning(false);
  }, [selectedPattern]);
  return (
    <div className={`transition-colors duration-500 ${currentStep.color} min-h-screen`}>
      <div className="p-6 flex flex-col md:flex-row items-center gap-4">
        <div>
          <label className="text-lg font-semibold text-gray-700 mr-2">
            Select Breathing Pattern:
          </label>
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="p-2 rounded border shadow"
          >
            {Object.keys(breathingPatterns).map((patternName) => (
              <option key={patternName} value={patternName}>
                {patternName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className={`px-4 py-2 font-semibold rounded shadow ${
              isRunning ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button
            onClick={() => {
              setIsRunning(false);
              setStepIndex(0);
              setSecondsLeft(pattern[0].duration);
              setElapsedTime(0);
            }}
            className="px-4 py-2 font-semibold bg-gray-300 rounded shadow"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">{currentStep.label}</h1>
        <p className="text-6xl font-mono text-gray-900">{secondsLeft}</p>
        <p className="mt-4 text-lg text-gray-700">
          Total Time: <span className="font-mono">{formatTime(elapsedTime)}</span>
        </p>
      </div>
    </div>
  );
}

