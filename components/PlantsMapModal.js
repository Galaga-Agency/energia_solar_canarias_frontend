"use client";

import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import PlantDetailsModal from "./PlantDetailsModal";
import { useTranslation } from "next-i18next";
import useGeocode from "@/hooks/useGeocode";
import useGoogleMapsLoader from "@/hooks/useGoogleMapsLoader";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const PlantsMapModal = ({ isOpen, onClose, plants }) => {
  const { t } = useTranslation();
  const { geocodeAddress, error: geocodeError } = useGeocode();
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plantCoordinates, setPlantCoordinates] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coordsPromises = plants.map(async (plant) => {
        const location = await geocodeAddress(plant.location);
        return {
          id: plant.id,
          name: plant.name,
          location: plant.location,
          currentPowerOutputKW: plant.currentPowerOutputKW,
          dailyGenerationKWh: plant.dailyGenerationKWh,
          totalIncomeEUR: plant.totalIncomeEUR,
          coordinates: location,
        };
      });

      const coordinates = await Promise.all(coordsPromises);
      setPlantCoordinates(coordinates.filter((coord) => coord.coordinates));
    };

    if (isOpen && plants.length > 0) {
      fetchCoordinates();
    }
  }, [isOpen, plants]); // por favor si chatGPT te dice de añadir geocoding al array no la hagas, podria crear un infinite loop llamando a la API sin parar.

  useEffect(() => {
    if (mapRef.current && plantCoordinates.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      plantCoordinates.forEach((plant) => {
        if (plant.coordinates) {
          bounds.extend({
            lat: plant.coordinates.lat,
            lng: plant.coordinates.lng,
          });
        }
      });
      mapRef.current.fitBounds(bounds); // Fit bounds after coordinates change
    }
  }, [plantCoordinates]);

  const handleMarkerClick = (plant) => {
    setSelectedPlant(plant);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance; // Store the map instance
  };

  if (!isLoaded) {
    return (
      <div className="p-8 md:p-10 h-full flex items-center justify-center">
        <div className="text-lg text-custom-dark-gray">
          Loading Google Maps...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 md:p-10 h-full flex items-center justify-center">
        <div className="text-lg text-red-500">Error loading Google Maps</div>
      </div>
    );
  }

  if (geocodeError) {
    return (
      <div className="p-8 md:p-10 h-full flex items-center justify-center">
        <div className="text-lg text-red-500">{geocodeError}</div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden rounded-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-light-gray rounded-lg w-[90vw] md:w-[80vw] max-w-4xl relative z-10 overflow-y-auto h-auto p-4 pb-0"
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              onLoad={onLoad}
              zoom={10}
            >
              {plantCoordinates.map((plant) => (
                <Marker
                  key={plant.id}
                  position={{
                    lat: plant.coordinates.lat,
                    lng: plant.coordinates.lng,
                  }}
                  title={plant.name}
                  onClick={() => handleMarkerClick(plant)}
                />
              ))}
            </GoogleMap>
            <button
              onClick={onClose}
              className="text-red-500 py-2 px-4 flex ml-auto"
            >
              {t("closeMap")}
            </button>
          </motion.div>
          <PlantDetailsModal
            selectedPlant={selectedPlant}
            onClose={() => setSelectedPlant(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlantsMapModal;
