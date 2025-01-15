import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import useDeviceType from "@/hooks/useDeviceType";
import { generateApiKey } from "@/store/slices/userSlice";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import useTouchDevice from "@/hooks/useTouchDevice";

const ApiKeyRequestCard = ({ onClose = () => {} }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);

  const { isMobile } = useDeviceType();
  const isTouchDevice = useTouchDevice();
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const apiKeyData = useSelector((state) => state.user.user?.apiKey);

  const actualApiKey = apiKeyData?.api_key || "";

  const handleRequestApiKey = async () => {
    try {
      await dispatch(generateApiKey()).unwrap();
      setIsFlipped(true);
    } catch (err) {
      console.error("Failed to generate API key:", err);
      toast.error(t("failedToGenerateApiKey"));
    }
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(actualApiKey);
      setCopySuccess(true);
      toast.success(t("apiKeyCopied"));
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy API key:", err);
      toast.error(t("failedToCopyApiKey"));
    }
  };

  const handleReset = () => {
    setIsFlipped(false);
    setCopySuccess(false);
  };

  return (
    <div className="relative w-full h-[270px]  perspective">
      <div
        className={`absolute w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm backdrop-blur-sm backdrop-filter backface-hidden">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("apiKeyRequest")}
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            {t("apiKeyRequestDescription")}
          </p>
          <button
            onClick={handleRequestApiKey}
            disabled={loading}
            className="w-full bg-custom-yellow text-custom-dark-blue py-2.5 px-4 rounded-lg hover:bg-custom-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
          >
            {loading ? (
              <>
                <span className="animate-spin">⋅</span>
                {t("generating")}
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {t("requestApiKey")}
              </>
            )}
          </button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <div className="flex mt-6 items-center">
            <Link
              href="/api-guide"
              passHref
              className="text-custom-dark-blue dark:text-custom-yellow underline underline-offset-2 hover:opacity-80 transition-opacity text-sm font-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("viewApiGuide")}
            </Link>
            <FaExternalLinkAlt className="inline ml-1 text-custom-dark-blue dark:text-custom-yellow w-3 h-3" />
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm backdrop-blur-sm backdrop-filter backface-hidden rotate-y-180">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
          </motion.button>

          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
            {t("apiKeyRequest")}
          </h2>
          <div className="text-center">
            <AiOutlineCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
            <h2 className="text-lg mb-4 text-gray-800 dark:text-gray-200">
              {t("apiKeyGenerated")}
            </h2>
            <div className="relative">
              <input
                type="text"
                value={actualApiKey}
                readOnly
                onMouseEnter={() => setIsInputHovered(true)}
                onMouseLeave={() => setIsInputHovered(false)}
                className="w-full p-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-custom-yellow focus:border-transparent outline-none"
              />
              <button
                onClick={handleCopyApiKey}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-custom-dark-blue dark:hover:text-custom-yellow transition-all duration-200 ${
                  isTouchDevice || isInputHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <MdOutlineContentCopy
                  className={`w-5 h-5 ${copySuccess ? "text-green-500" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyRequestCard;
