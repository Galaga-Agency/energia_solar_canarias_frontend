"use client";

import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import FilterInput from "@/components/FilterPlantsInput";
import { AnimatePresence, motion } from "framer-motion";
import Texture from "./Texture";
import { FiPlus } from "react-icons/fi";

const AssignPlantUser = ({ isOpen, onClose, userId, plants }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlants, setFilteredPlants] = useState(plants.plants);
  const [selectedPlants, setSelectedPlants] = useState({});

  const handleFilterChange = (term) => {
    setSearchTerm(term);
    setFilteredPlants(
      plants.plants.filter((plant) =>
        plant.name.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleCheckboxChange = (plantId) => {
    setSelectedPlants((prevSelected) => ({
      ...prevSelected,
      [plantId]: !prevSelected[plantId],
    }));
  };

  const handleSubmit = async () => {
    const assignedPlantIds = Object.keys(selectedPlants).filter(
      (id) => selectedPlants[id]
    );

    try {
      // Send selected plants to the API
      await fetch("/api/assign-plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, plantIds: assignedPlantIds }),
      });
      console.log(`Assigned plants ${assignedPlantIds} to user ${userId}`);
      onClose();
    } catch (error) {
      console.error("Error assigning plants:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden rounded-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-custom-light-gray dark:bg-custom-dark-blue  text-custom-dark-blue dark:text-custom-light-gray rounded-lg shadow-dark-shadow w-[90vw] md:w-[80vw] max-w-4xl relative z-10 overflow-y-auto h-auto"
          >
            <Texture />
            <div className="bg-custom-yellow dark:bg-custom-yellow text-custom-dark-blue dark:text-custom-dark-blue p-4 flex items-center shadow-dark-shadow">
              <FiPlus className="text-2xl mr-2" />
              <h2 className="text-2xl font-semibold mt-1">
                {t("assignPlant")}
              </h2>
            </div>
            <div className="p-8 pt-0 lg:pt-8">
              <FilterInput onFilterChange={handleFilterChange} />
              <div className="max-h-96 overflow-y-auto">
                {filteredPlants.map((plant) => (
                  <div
                    key={plant.id}
                    className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    <label className="flex items-center space-x-4 text-gray-800 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={!!selectedPlants[plant.id]}
                        onChange={() => handleCheckboxChange(plant.id)}
                        className="form-checkbox h-5 w-5 text-custom-dark-blue dark:text-custom-yellow"
                      />
                      <span>{plant.name}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <SecondaryButton onClick={onClose}>
                  {t("close")}
                </SecondaryButton>
                <PrimaryButton onClick={handleSubmit}>
                  {t("save")}
                </PrimaryButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignPlantUser;
