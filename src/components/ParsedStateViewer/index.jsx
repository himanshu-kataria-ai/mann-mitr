import React from "react";

const ParsedStateViewer = ({ stateJson }) => {
  return (
    <div className="h-full overflow-y-auto bg-white border-l border-gray-300 p-4 space-y-2 text-sm">
      <h2 className="text-lg font-bold mb-2 text-green-700">🧠 Parsed State</h2>
      <pre className="whitespace-pre-wrap break-words bg-gray-100 rounded-lg p-3 text-gray-800">
        {JSON.stringify(stateJson, null, 2)}
      </pre>
    </div>
  );
};

export default ParsedStateViewer;
