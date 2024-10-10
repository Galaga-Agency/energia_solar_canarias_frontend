import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import { AnimatePresence, motion } from "framer-motion";

const MapModal = ({ isOpen, onClose, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handlePlaceSelected = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address); // Store the selected address
  };

  const handleSubmit = () => {
    if (selectedLocation && selectedAddress) {
      onLocationSelect(selectedLocation, selectedAddress); // Pass selected location and address to parent
      onClose(); // Close the modal after selection
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
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-lg shadow-xl w-[90vw] md:w-[80vw] max-w-4xl md:max-w-5xl relative z-10 overflow-y-auto h-[90vh] md:h-auto"
          >
            <div className="bg-gradient-to-br from-custom-yellow to-custom-dark-blue text-white p-4 flex items-center">
              <h2 className="text-lg font-bold">Select a Location</h2>
            </div>
            <MapComponent onPlaceSelected={handlePlaceSelected} />
            <div className="p-4 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded"
              >
                Submit
              </button>
              <button onClick={onClose} className="ml-4 text-red-500">
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapModal;
