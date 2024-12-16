import React from "react";
import PrimaryButton from "./ui/PrimaryButton";
import SecondaryButton from "./ui/SecondaryButton";

const ExportModal = ({ isOpen, onClose, onExport, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-custom-dark-blue/80 backdrop-blur-sm p-6 rounded-lg shadow-lg w-[90%] md:w-[400px]">
        <h3 className="text-lg font-semibold text-center mb-4 text-custom-dark-blue dark:text-custom-yellow">
          {t("exportAsCSV")}
        </h3>
        <div className="flex justify-center gap-4 mb-4">
          <PrimaryButton onClick={onExport}>{t("export")}</PrimaryButton>
        </div>
        <div className="flex justify-center">
          <SecondaryButton onClick={onClose}>{t("close")}</SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
