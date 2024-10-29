import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import SelectAddressOnMap from "./SelectAddressOnMap";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";

import { useTranslation } from "next-i18next";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import Texture from "./Texture";

const AddPlantForm = ({ onClose, isOpen }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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

    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const truncateName = (name) => {
    return name.length > 10 ? `${name.substring(0, 10)}...` : name;
  };

  const onMapLocationSelect = (location, address) => {
    setValue("address", address);
    setIsMapOpen(false);
  };

  const handleFormSubmit = (data) => {
    reset();
    setImages([]);
    setImagePreviews([]);
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
          className="fixed inset-0 -mt-12 z-50 grid place-items-center overflow-hidden rounded-lg"
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
            className="bg-custom-light-gray dark:bg-custom-dark-blue  text-custom-dark-blue dark:text-custom-light-gray rounded-lg shadow-dark-shadow w-[90vw] md:w-[80vw] max-w-4xl relative z-10 overflow-y-auto h-[90vh] md:h-auto"
          >
            <Texture />
            <div className="bg-custom-yellow dark:bg-custom-yellow text-custom-dark-blue dark:text-custom-dark-blue p-4 flex items-center shadow-dark-shadow">
              <FiPlus className="text-2xl mr-2" />
              <h2 className="text-lg font-bold">{t("addPlant")}</h2>
            </div>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                    {t("email")}*
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: t("emailRequired") })}
                    className={`w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                    {t("plantName")}*
                  </label>
                  <input
                    type="text"
                    {...register("plantName", {
                      required: t("plantNameRequired"),
                    })}
                    className={`w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray ${
                      errors.plantName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.plantName && (
                    <p className="text-red-500">{errors.plantName.message}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                  {t("installerCode")}
                </label>
                <input
                  type="text"
                  {...register("installerCode")}
                  className="w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                  {t("address")}*
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    {...register("address", {
                      required: t("addressRequired"),
                    })}
                    className={`flex-grow border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="ml-2 p-2 bg-gray-200 dark:bg-custom-dark-gray rounded text-gray-700 dark:text-custom-light-gray button-shadow"
                    onClick={() => setIsMapOpen(true)}
                  >
                    <IoLocationSharp className="text-2xl text-custom-dark-blue" />
                  </button>
                </div>
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                    {t("classification")}*
                  </label>
                  <select
                    {...register("classification", {
                      required: t("classificationRequired"),
                    })}
                    className={`w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray ${
                      errors.classification
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">{t("selectClassification")}</option>
                    <option value="residential">{t("residential")}</option>
                    <option value="ground-mounted">{t("groundMounted")}</option>
                    <option value="commercial-rooftop">
                      {t("commercialRooftop")}
                    </option>
                    <option value="battery-storage">
                      {t("batteryStorage")}
                    </option>
                  </select>
                  {errors.classification && (
                    <p className="text-red-500">
                      {errors.classification.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                    {t("capacity")}*
                  </label>
                  <input
                    type="number"
                    {...register("capacity", {
                      required: t("capacityRequired"),
                    })}
                    className={`w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray ${
                      errors.capacity ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.capacity && (
                    <p className="text-red-500">{errors.capacity.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                    {t("module")}*
                  </label>
                  <input
                    type="number"
                    {...register("module", {
                      required: t("moduleRequired"),
                    })}
                    className={`w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray ${
                      errors.module ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.module && (
                    <p className="text-red-500">{errors.module.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                    {t("profitRatio")}*
                  </label>
                  <input
                    type="number"
                    {...register("profitRatio", {
                      required: t("profitRatioRequired"),
                    })}
                    className={`w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray ${
                      errors.profitRatio ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.profitRatio && (
                    <p className="text-red-500">{errors.profitRatio.message}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                  {t("uploadPhotos")}
                </label>
                <input
                  type="file"
                  className="w-full border rounded p-2 bg-white dark:bg-custom-dark-gray dark:text-custom-light-gray"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {imagePreviews.map((img, index) => (
                      <div
                        key={index}
                        className="relative flex flex-col justify-between items-center p-1"
                      >
                        <Image
                          src={img.url}
                          alt={img.name}
                          width={70}
                          height={70}
                          className="object-cover rounded"
                        />
                        <p className="text-xs text-center mt-1">
                          {truncateName(img.name)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <PrimaryButton type="submit">{t("submit")}</PrimaryButton>
                <SecondaryButton type="button" onClick={onClose}>
                  {t("cancel")}
                </SecondaryButton>
              </div>
            </form>
          </motion.div>
          <SelectAddressOnMap
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
