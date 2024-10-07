"use client";

import React, { useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "@/locales/en.json";
import esTranslation from "@/locales/es.json";

const TranslationProvider = ({ children }) => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: enTranslation },
          es: { translation: esTranslation },
        },
        fallbackLng: "es",
        detection: {
          order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
          caches: ["localStorage"],
        },
        react: {
          useSuspense: false,
        },
      })
      .then(() => {
        setIsI18nInitialized(true);
      });

    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isI18nInitialized) {
    return (
      <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default TranslationProvider;
