"use client";

import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PrimaryButton from "./PrimaryButton";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import useDeviceType from "@/hooks/useDeviceType";

const ApiKeyRequestCard = ({ onRequestApiKey }) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const { isMobile } = useDeviceType();

  const handleRequestApiKey = async () => {
    const key = await onRequestApiKey();
    setApiKey(key);
    setIsFlipped(true);
  };

  return (
    <div className="relative w-full perspective">
      <div
        className={`relative h-[270px] xl:h-[250px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-white/50 dark:bg-gray-800/60 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm backdrop-filter backface-hidden">
          <h2 className="text-xl mb-8 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
            {t("apiKeyRequest")}
          </h2>
          <p className="mb-4 text-gray-800 dark:text-gray-200">
            {t("apiKeyRequestDescription")}
          </p>
          <PrimaryButton onClick={handleRequestApiKey}>
            {t("requestApiKey")}
          </PrimaryButton>
          <div className="flex mt-6 items-center">
            <Link
              href="/api-guide"
              passHref
              className="text-custom-dark-blue dark:text-custom-light-gray underline underline-offset-2 hover:opacity-80 transition-opacity font-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("viewApiGuide")}
            </Link>
            <FaExternalLinkAlt className="inline ml-1 text-custom-dark-blue dark:text-custom-light-gray" />
          </div>
        </div>

        {/* Back Face - Display API Key */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-lg backdrop-filter backface-hidden rotate-y-180 flex flex-col items-center justify-center">
          <div className="text-center w-full">
            <AiOutlineCheckCircle className="flex mx-auto text-5xl text-green-500 mb-4" />
            <h2 className="text-xl mb-2 text-gray-800 dark:text-gray-200">
              {t("apiKeyGenerated")}
            </h2>
            <div className="flex items-center gap-4 w-full">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
              <PrimaryButton
                className="mt-0"
                onClick={() => navigator.clipboard.writeText(apiKey)}
              >
                {isMobile ? <MdOutlineContentCopy /> : t("copyApiKey")}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyRequestCard;
