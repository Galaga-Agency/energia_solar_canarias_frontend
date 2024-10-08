"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import englishFlag from "@/public/assets/icons/en.webp";
import spanishFlag from "@/public/assets/icons/es.webp";

const languages = [
  { code: "en", name: "English", flagPath: englishFlag },
  { code: "es", name: "Español", flagPath: spanishFlag },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = async (languageCode) => {
    await i18n.changeLanguage(languageCode);
    setActiveLanguage(languageCode);
    setIsOpen(false);
  };

  const selectedLanguage = languages.find(
    (lang) => lang.code === activeLanguage
  );

  const availableLanguages = languages.filter(
    (lang) => lang.code !== activeLanguage
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("#language-selector")) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative" id="language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="inline-flex items-center justify-center w-full rounded-full shadow-white-shadow hover:shadow-hover-shadow"
        aria-expanded={isOpen}
      >
        {selectedLanguage && (
          <img
            src={selectedLanguage.flagPath.src}
            alt={`${selectedLanguage.name} Flag`}
            className="w-9 h-9 rounded-full object-cover"
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute rounded-md shadow-lg" role="menu">
          <div className="py-1" role="none">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className="flex items-center justify-start w-full py-1 text-sm"
                role="menuitem"
              >
                <img
                  src={language.flagPath.src}
                  alt={`${language.name} Flag`}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
