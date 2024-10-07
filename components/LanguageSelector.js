"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const languages = [
  { code: "en", flagPath: "/assets/icons/en.webp", alt: "English Flag" },
  { code: "es", flagPath: "/assets/icons/es.webp", alt: "Spanish Flag" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(
    (language) => language.code === activeLanguage
  );
  const otherLanguage = languages.find(
    (language) => language.code !== activeLanguage
  );

  return (
    <div className="fixed top-[20px] right-[20px] z-50">
      {/* Current Language Flag */}
      <div
        className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center p-0 overflow-hidden shadow-white-shadow hover:shadow-hover-shadow transition-all duration-300 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLanguage && (
          <Image
            src={currentLanguage.flagPath}
            alt={currentLanguage.alt}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        )}
      </div>

      {/* Other Language Flag Sliding Down */}
      <div
        className={`absolute w-8 h-8 rounded-full cursor-pointer flex items-center justify-center overflow-hidden shadow-md bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-12 opacity-100" : "translate-y-0 opacity-0"
        }`}
        style={{
          top: "40px",
          transformOrigin: "top",
          transform: isOpen ? "scaleY(1)" : "scaleY(0)",
        }}
        onClick={() => otherLanguage && changeLanguage(otherLanguage.code)}
      >
        {otherLanguage && (
          <Image
            src={otherLanguage.flagPath}
            alt={otherLanguage.alt}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
