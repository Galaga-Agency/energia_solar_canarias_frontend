import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import SilenceAlertModal from "./SilenceAlertModal";
import UnsilenceAlertModal from "./UnsilenceAlertModal";
import EditSilencedAlertModal from "./EditSilencedAlertModal";
import CloseAlertModal from "./CloseAlertModal";

const ActionDropdown = ({ selectedCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const { t } = useTranslation();
  const dropdownRef = useRef();
  const modalRef = useRef();

  const actions = [
    { label: t("silenceAlerts"), icon: "🔕", modalType: "silence" },
    { label: t("unsilenceAlerts"), icon: "🔊", modalType: "unsilence" },
    { label: t("editSilencedAlerts"), icon: "✏️", modalType: "editSilenced" },
    { label: t("closeAlerts"), icon: "✅", modalType: "close" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event) {
        event.stopPropagation();
      } else if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setModalType(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleActionClick = (action) => {
    setModalType(action.modalType);
    setIsOpen(true);
  };

  const handleSave = (e) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
    // console.log("saved");
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
    setModalType(null);
  };

  return (
    <div className="relative inline-block text-left z-50 " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-full dark:border dark:border-gray-200/50 w-max font-secondary text-md flex items-center text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 hover:bg-custom-light-gray dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow"
      >
        <span className="mr-2 font-secondary text-md">
          {t("actions")} ({selectedCount})
        </span>
        <FiChevronDown />
      </button>

      {isOpen && (
        <div className="absolute w-max bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg z-10 mt-2">
          <div className="py-1">
            {actions.map((action, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => handleActionClick(action)} // Ensure the event is passed here
                className="font-secondary text-md block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {modalType && (
        <div className="fixed inset-0 z-[9999] grid place-items-center p-4 bg-gray-900/50 rounded-lg">
          <div ref={modalRef}>
            {modalType === "silence" && (
              <SilenceAlertModal
                onClose={handleCloseModal}
                onSave={handleSave}
              />
            )}
            {modalType === "unsilence" && (
              <UnsilenceAlertModal
                onClose={handleCloseModal}
                onSave={handleSave}
              />
            )}
            {modalType === "editSilenced" && (
              <EditSilencedAlertModal
                onClose={handleCloseModal}
                onSave={handleSave}
              />
            )}
            {modalType === "close" && (
              <CloseAlertModal onClose={handleCloseModal} onSave={handleSave} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
