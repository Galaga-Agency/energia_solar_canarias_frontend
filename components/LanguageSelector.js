import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import enFlag from "@/public/assets/icons/en.webp";
import esFlag from "@/public/assets/icons/es.webp";

const languages = [
  {
    code: "en",
    flagPath: enFlag,
    alt: "English Flag",
  },
  {
    code: "es",
    flagPath: esFlag,
    alt: "Spanish Flag",
  },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      await i18n.initPromise;
      setIsI18nReady(true);
      setActiveLanguage(i18n.language || "es");
    };

    initializeI18n();
  }, [i18n]);

  useEffect(() => {
    if (isI18nReady) {
      setActiveLanguage(i18n.language || "es");
    }
  }, [i18n.language, isI18nReady]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    setImageLoaded(false);
  };

  const currentLanguage =
    languages.find((language) => language.code === activeLanguage) ||
    languages[0];
  const otherLanguage = languages.find(
    (language) => language.code !== activeLanguage
  );

  if (!isI18nReady) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className="relative w-8 h-8 rounded-full cursor-pointer flex items-center justify-center p-0 overflow-hidden button-shadow transition-all duration-300 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!imageLoaded && (
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
        )}
        <Image
          src={currentLanguage.flagPath}
          alt={currentLanguage.alt}
          fill
          className={`rounded-full object-cover ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => console.error("Failed to load image")}
          priority
          sizes="(max-width: 768px) 32px, (max-width: 1024px) 40px, 48px"
        />
      </div>
      {/* Sliding Flag */}
      {isOpen && otherLanguage && (
        <div
          className="absolute w-8 h-8 rounded-full cursor-pointer flex items-center justify-center overflow-hidden shadow-md bg-white transition-transform duration-300 ease-in-out top-[40px]"
          onClick={() => changeLanguage(otherLanguage.code)}
        >
          <Image
            src={otherLanguage.flagPath}
            alt={otherLanguage.alt}
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 768px) 32px, (max-width: 1024px) 40px, 48px"
          />
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
