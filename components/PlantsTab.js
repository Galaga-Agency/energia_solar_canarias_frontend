import React, { useState } from "react";
import AddPlantForm from "./AddPlantForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import PlantList from "./PlantList";
import GoogleMapsLoader from "./GoogleMapsLoader";
import { useSelector } from "react-redux";
import {
  selectPlants,
  selectLoading,
  selectError,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";

const PlantsTab = () => {
  const plants = useSelector(selectPlants);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const userId = useSelector(selectUser).id;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const currentTab = "/plants";

  const handleAddPlantClick = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openMap = () => {
    setIsMapOpen(true);
  };

  const closeMap = () => {
    setIsMapOpen(false);
  };

  return (
    <div className="p-8 md:p-10 h-full pb-24">
      <h2 className="text-4xl dark:text-custom-yellow text-custom-dark-blue">
        Plants
      </h2>
      {loading && (
        <p className="text-center text-lg text-custom-yellow">
          Loading plants...
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      <GoogleMapsLoader>
        <AddPlantForm onClose={closeForm} isOpen={isFormOpen} />
        <PlantList
          onClose={closeMap}
          isOpen={isMapOpen}
          openMap={openMap}
          userId={userId}
          tab={currentTab}
        />
      </GoogleMapsLoader>
      <button
        onClick={handleAddPlantClick}
        className="absolute bottom-20 right-4 md:right-10 w-12 h-12 bg-custom-yellow text-custom-dark-blue rounded-full flex items-center justify-center transition-colors duration-300 button-shadow"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PlantsTab;
