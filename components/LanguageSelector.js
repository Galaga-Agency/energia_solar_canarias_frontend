"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const languages = [
  { code: "en", name: "English", countryCode: "gb" },
  { code: "es", name: "Español", countryCode: "es" },
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
          <span
            className={`fi fis fi-${selectedLanguage.countryCode} rounded-full text-4xl`}
          />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute rounded-md shadow-lg ring-1 ring-black ring-opacity-5 mt-2"
          role="menu"
        >
          <div className="py-1" role="none">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className="inline-flex items-center justify-center w-full rounded-full shadow-white-shadow hover:shadow-hover-shadow"
                role="menuitem"
              >
                <span
                  className={`fi fis fi-${language.countryCode} text-4xl rounded-full`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
