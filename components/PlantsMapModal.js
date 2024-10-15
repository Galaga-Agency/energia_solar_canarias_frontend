import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import PlantDetailsModal from "./PlantDetailsModal";
import { useTranslation } from "next-i18next";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const PlantsMapModal = ({ isOpen, onClose, plants }) => {
  const { t } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [map, setMap] = useState(null);

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
    setMap(mapInstance);
    const bounds = new window.google.maps.LatLngBounds();

    plants.forEach((plant) => {
      if (plant.coordinates) {
        bounds.extend({
          lat: plant.coordinates.lat,
          lng: plant.coordinates.lng,
        });
      }
    });

    mapInstance.fitBounds(bounds);
  };

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
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-custom-light-gray dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-light-gray rounded-lg w-[90vw] md:w-[80vw] max-w-4xl relative z-10 overflow-y-auto h-auto p-4 pb-0"
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              onLoad={onLoad}
              zoom={10}
            >
              {plants.map((plant) => (
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
