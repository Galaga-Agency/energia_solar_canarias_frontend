"use client";

import React, { useState } from "react";
import AddPlantForm from "./AddPlantForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import PlantList from "./PlantList";

const PlantsTab = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddPlantClick = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="p-8 h-full pb-24">
      <h2 className="text-4xl dark:text-custom-yellow text-custom-dark-blue">
        Plants
      </h2>

      <AddPlantForm onClose={closeForm} isOpen={isFormOpen} />
      <PlantList />
      <button
        onClick={handleAddPlantClick}
        className="absolute bottom-20 right-4 w-12 h-12 bg-custom-yellow text-custom-dark-blue rounded-full flex items-center justify-center transition-colors duration-300 button-shadow"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PlantsTab;
