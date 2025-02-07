import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Texture from "@/components/Texture";
import PlantsListTableItem from "../PlantsListTableItem";
import EmptyState from "../EmptyState";

const InstallationTypesModal = ({
  isOpen,
  onClose,
  title,
  plants,
  installations,
  t,
}) => {
  // Set default tab to 'solar' if it exists in installations, otherwise use first available type
  const [activeTab, setActiveTab] = useState("solar");

  // Update activeTab when installations prop changes
  useEffect(() => {
    if (installations && Object.keys(installations).length > 0) {
      if (installations.hasOwnProperty("solar")) {
        setActiveTab("solar");
      } else {
        setActiveTab(Object.keys(installations)[0]);
      }
    }
  }, [installations]);

  const getFilteredPlantsByType = (type) => {
    return plants?.filter((plant) => plant.type === type) || [];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[90vw] md:max-w-4xl p-4 rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg"
    >
      <Texture className="opacity-30" />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue mb-6"
      >
        <div className="flex items-center gap-2">
          <Zap className="text-2xl" />
          <h2 className="text-xl md:text-2xl mt-2">{title}</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="flex-shrink-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="h-6 w-6 text-custom-dark-blue" />
        </motion.button>
      </motion.div>

      {Object.keys(installations).length === 0 ? (
        <EmptyState
          icon={Zap}
          title={t("no_installations")}
          description={t("no_installations_description")}
        />
      ) : (
        <>
          <div className="flex space-x-2 mb-4 px-2 overflow-x-auto custom-scrollbar">
            {Object.entries(installations).map(([type, count]) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                  activeTab === type
                    ? "bg-custom-yellow text-custom-dark-blue"
                    : "bg-white/30 dark:bg-custom-dark-blue/30 hover:bg-white/50 dark:hover:bg-custom-dark-blue/50"
                }`}
              >
                <span className="font-medium">{t(type)}</span>
                <span className="ml-2 font-bold">{count}</span>
              </button>
            ))}
          </div>

          <div className="max-h-[70vh] overflow-y-auto custom-scrollbar md:p-2">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/30 dark:bg-custom-dark-blue/30 rounded-xl overflow-hidden p-4"
            >
              {getFilteredPlantsByType(activeTab).map((plant) => (
                <PlantsListTableItem key={plant.id} plant={plant} />
              ))}
            </motion.div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default InstallationTypesModal;
