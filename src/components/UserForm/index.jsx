import React, { useState } from "react";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    feeling: 3, // default midpoint
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSliderChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      feeling: parseInt(e.target.value, 10),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/chat", { state: formData });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-green-100 p-3 rounded-full shadow-inner">
            <Brain size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Mann Mitr</h2>
          <p className="text-sm text-gray-500 text-center">
            Feel free to share only what you're comfortable with.
          </p>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Your Name (Optional)"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="number"
          name="age"
          placeholder="Your Age (Optional)"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Select Gender (Optional)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            How are you feeling today? ({formData.feeling}/5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={formData.feeling}
            onChange={handleSliderChange}
            className="w-full accent-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default UserForm;
