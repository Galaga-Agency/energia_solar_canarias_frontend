import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import { IoMdClose } from "react-icons/io";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

// Default center to Telde, Spain
const defaultCenter = {
  lat: 27.9945,
  lng: -15.4162,
};

const SelectAddressOnMap = ({ isOpen, onClose, onLocationSelect }) => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(location);
      setAddress(place.formatted_address);
      onLocationSelect(location, place.formatted_address);
    }
  };

  const handleMapClick = async (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(location);
    const fetchedAddress = await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      )
      .then((response) =>
        response.data.results.length > 0
          ? response.data.results[0].formatted_address
          : t("addressNotFound")
      );
    setAddress(fetchedAddress);
    onLocationSelect(location, fetchedAddress);
  };

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setSelectedLocation(location);
          },
          () => {
            // User denied permission, set to default center (Telde)
            setSelectedLocation(defaultCenter);
          }
        );
      } else {
        // Geolocation is not supported, set to default center (Telde)
        setSelectedLocation(defaultCenter);
      }
    };

    getUserLocation();

    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-light-gray rounded-lg w-[90vw] md:w-[80vw] max-w-4xl relative z-10 overflow-y-auto h-auto"
          >
            <div className="bg-custom-dark-blue dark:bg-custom-yellow text-custom-yellow dark:text-custom-dark-blue p-4 flex items-center">
              <h2 className="text-lg">{t("selectLocation")}</h2>
            </div>
            <div className="p-4">
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  placeholder={t("searchLocationPlaceholder")}
                  className="border rounded p-2 mb-2 w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedLocation}
                zoom={10}
                onClick={handleMapClick}
              >
                <Marker position={selectedLocation} />
              </GoogleMap>
            </div>
            <div className="p-4 flex justify-end">
              <button
                onClick={() => {
                  onLocationSelect(selectedLocation, address);
                  onClose();
                }}
                className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded"
              >
                {t("submit")}
              </button>
              <button onClick={onClose} className="ml-4 text-red-500">
                {t("cancel")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectAddressOnMap;
