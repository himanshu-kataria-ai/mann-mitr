import React, { useState } from "react";
import { i18 } from "../../i18n";
import People from "../../assets/images/People.png";
import WAILOGO from "../../assets/images/WAI-High.png";
import ConsentModal from "../../components/ConsentModal";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    setShowModal(false);
    navigate("/user-details");
  };

  const {
    HOME: {
      DISCLAIMER_TEXT,
      SUB_HEADING,
      BUTTON_TEXT_RECORD,
    },
  } = i18;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Layout>
        <ConsentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isChecked={consentChecked}
          onConfirm={handleContinue}
          setIsChecked={setConsentChecked}
        />

        <div className="flex flex-col items-center space-y-6 p-6">
          <img
            src={WAILOGO}
            className="w-[40%] md:w-[16%] mt-4"
            alt="WAI Logo"
          />
          <img
            className="w-[80%] md:w-[30%] mt-4"
            src={People}
            alt="People"
          />

          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mt-4">
            Mann Mitr
          </h2>

          <p className="text-xl md:text-2xl text-center text-gray-700 mb-2">
            {SUB_HEADING}
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-3xl shadow-md text-lg md:text-2xl transition"
          >
            {BUTTON_TEXT_RECORD} &rarr;
          </button>

          <p className="text-center text-sm md:text-lg text-gray-500 mt-6 px-4 md:px-12">
            {DISCLAIMER_TEXT}
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
