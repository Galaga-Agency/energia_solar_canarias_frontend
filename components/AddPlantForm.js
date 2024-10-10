import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import MapModal from "./MapModal";

const AddPlantForm = ({ onClose, isOpen }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [images, setImages] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const onMapLocationSelect = (location, address) => {
    setValue("address", address); // Set the selected address in the form
    setIsMapOpen(false);
  };

  const handleFormSubmit = (data) => {
    console.log("Form Data:", data);
    // Handle form submission logic here
    onClose();
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
            className="bg-white rounded-lg shadow-xl w-[90vw] md:w-[80vw] max-w-4xl relative z-10 overflow-y-auto h-[90vh] md:h-auto"
          >
            <div className="bg-gradient-to-br from-custom-yellow to-custom-dark-blue text-white p-4 flex items-center">
              <FiPlus className="text-2xl mr-2" />
              <h2 className="text-lg font-bold">Add a New Plant</h2>
            </div>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Email*</label>
                  <input
                    type="email"
                    required
                    {...register("email", { required: "Email is required" })}
                    className={`w-full border rounded p-2 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">Plant Name*</label>
                  <input
                    type="text"
                    required
                    {...register("plantName", {
                      required: "Plant name is required",
                    })}
                    className={`w-full border rounded p-2 ${
                      errors.plantName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.plantName && (
                    <p className="text-red-500">{errors.plantName.message}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">
                  Installer's Organization Code (optional)
                </label>
                <input
                  type="text"
                  {...register("installerCode")}
                  className="w-full border rounded p-2"
                />
                <p className="text-gray-500 text-sm">
                  If you don&apos;t know the code, you can leave this field
                  empty.
                </p>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Address of the Plant*</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className={`flex-grow border rounded p-2 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="ml-2 p-2 bg-gray-200 rounded"
                    onClick={() => setIsMapOpen(true)}
                  >
                    📍
                  </button>
                </div>
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Classification*</label>
                  <select
                    required
                    {...register("classification", {
                      required: "Classification is required",
                    })}
                    className={`w-full border rounded p-2 ${
                      errors.classification ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select classification</option>
                    <option value="residential">Residential</option>
                    <option value="ground-mounted">Ground-mounted</option>
                    <option value="commercial-rooftop">
                      Commercial Rooftop
                    </option>
                    <option value="battery-storage">Battery Storage</option>
                  </select>
                  {errors.classification && (
                    <p className="text-red-500">
                      {errors.classification.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">Capacity* (in kW)</label>
                  <input
                    type="number"
                    required
                    {...register("capacity", {
                      required: "Capacity is required",
                    })}
                    className={`w-full border rounded p-2 ${
                      errors.capacity ? "border-red-500" : ""
                    }`}
                  />
                  {errors.capacity && (
                    <p className="text-red-500">{errors.capacity.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">
                    Module* (amount of solar panels)
                  </label>
                  <input
                    type="number"
                    required
                    {...register("module", {
                      required: "Module amount is required",
                    })}
                    className={`w-full border rounded p-2 ${
                      errors.module ? "border-red-500" : ""
                    }`}
                  />
                  {errors.module && (
                    <p className="text-red-500">{errors.module.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">
                    Profit Ratio* (in USD/kW)
                  </label>
                  <input
                    type="number"
                    required
                    {...register("profitRatio", {
                      required: "Profit ratio is required",
                    })}
                    className={`w-full border rounded p-2 ${
                      errors.profitRatio ? "border-red-500" : ""
                    }`}
                  />
                  {errors.profitRatio && (
                    <p className="text-red-500">{errors.profitRatio.message}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Upload Photos</label>
                <input
                  type="file"
                  className="w-full border rounded p-2"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {images.length > 0 && (
                  <div className="mt-2">
                    <p>Selected Images:</p>
                    <ul>
                      {images.map((img, index) => (
                        <li key={index}>{img.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <p className="text-gray-500">
                  Tips: After adding meter, battery, generator, please restart
                  the inverter to refresh plant view.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded"
                >
                  Add Plant
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 text-red-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            onLocationSelect={onMapLocationSelect}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPlantForm;
