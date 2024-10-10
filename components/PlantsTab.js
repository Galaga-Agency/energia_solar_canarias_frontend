"use client";

import React, { useState } from "react";
import AddPlantForm from "./AddPlantForm";

const PlantsTab = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddPlantClick = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-4xl text-custom-yellow">Plants Overview</h2>
      <p className="text-custom-light-gray mt-4">
        Here you can manage your plants and view detailed information about each
        one.
      </p>
      <button
        onClick={handleAddPlantClick}
        className="mt-4 bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded"
      >
        Add Plant
      </button>

      <AddPlantForm onClose={closeForm} isOpen={isFormOpen} />
    </div>
  );
};

export default PlantsTab;
