import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { FaQuestionCircle } from "react-icons/fa";
import StatusModal from "@/components/StatusModal";

const statusColors = {
  working: "bg-green-500",
  error: "bg-red-500",
  waiting: "bg-yellow-500",
  disconnected: "bg-gray-500",
};

const PlantStatuses = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });

  const handleModalOpen = (event) => {
    setIsModalOpen(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setIconPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleMouseLeave = () => {
    handleModalClose();
  };

  return (
    <div className="flex items-center relative">
      <div className="grid grid-cols-2 -mb-6">
        {Object.keys(statusColors).map((status) => (
          <div key={status} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
            <span className="ml-2 text-lg text-custom-dark-blue dark:text-custom-light-gray">
              {t(`status.${status}`)}
            </span>
          </div>
        ))}
      </div>
      <FaQuestionCircle
        onMouseEnter={handleModalOpen}
        onMouseLeave={handleMouseLeave}
        className="ml-4 cursor-pointer text-xl text-gray-500 hover:text-gray-700 self-center mt-6"
      />
      {isModalOpen && (
        <StatusModal
          onClose={handleModalClose}
          iconPosition={`absolute left-${iconPosition.x}px -top-20 md:-top-12`}
          onMouseEnter={handleModalOpen}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  );
};

export default PlantStatuses;
