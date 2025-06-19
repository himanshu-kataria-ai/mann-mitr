import React from "react";

const ConsentModal = ({
  isOpen,
  onClose,
  onConfirm,
  isChecked,
  setIsChecked,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl sm:text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center">
          Consent
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-sm sm:text-base mb-4 text-center sm:text-left">
        We securely store your conversation content along with the type of input used, solely to improve our services. This data is never linked to your identity and will only be accessed for service enhancement. Your privacy is extremely important to us, and we are committed to protecting it at every step.
        </p>

        {/* Checkbox */}
        <label className="flex items-center space-x-3 mb-6 text-sm sm:text-base">
          <input
            type="checkbox"
            className="form-checkbox accent-blue-600 w-5 h-5"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span>By checking this box, I confirm that I have read and understood the information provided, and I voluntarily give my consent.</span>
        </label>

        {/* Confirm Button */}
        <button
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition text-sm sm:text-base ${
            isChecked
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isChecked}
          onClick={onConfirm}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ConsentModal;
