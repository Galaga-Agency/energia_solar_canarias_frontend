"use client";

import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PrimaryButton from "./PrimaryButton";
import { AiOutlineCheckCircle } from "react-icons/ai";

const ApiKeyRequestCard = ({ onRequestApiKey }) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleRequestApiKey = async () => {
    const key = await onRequestApiKey();
    setApiKey(key);
    setIsFlipped(true);
  };

  return (
    <div className="relative w-full perspective">
      <div
        className={`relative h-[200px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-white/50 dark:bg-gray-800/60 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm backdrop-filter backface-hidden">
          <h2 className="text-xl mb-8 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
            {t("apiKeyRequest")}
          </h2>
          <PrimaryButton onClick={handleRequestApiKey}>
            {t("requestApiKey")}
          </PrimaryButton>
        </div>

        {/* Back Face - Display API Key */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-lg backdrop-filter backface-hidden rotate-y-180 flex flex-col items-center justify-center">
          <div className="text-center">
            <AiOutlineCheckCircle className="flex mx-auto text-5xl text-green-500 mb-4" />
            <h2 className="text-xl mb-2 text-gray-800 dark:text-gray-200">
              {t("apiKeyGenerated")}
            </h2>
            <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
              {apiKey}
            </p>
            <PrimaryButton
              onClick={() => navigator.clipboard.writeText(apiKey)}
            >
              {t("copyApiKey")}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyRequestCard;
