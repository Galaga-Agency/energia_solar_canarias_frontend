import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import SelectAddressOnMap from "@/components/SelectAddressOnMap";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { useTranslation } from "next-i18next";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Texture from "@/components/Texture";

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
        <div className="fixed inset-0 z-[999]">
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4 pb-20 md:pb-24">
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.1,
                }}
                className="relative w-full max-w-[90vw] md:max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 md:p-6 backdrop-blur-lg shadow-xl overflow-hidden"
              >
                <Texture className="opacity-30" />

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue mb-6"
                >
                  <FiPlus className="text-2xl" />
                  <h2 className="text-xl md:text-2xl font-bold">
                    {t("addPlant")}
                  </h2>
                </motion.div>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="p-6 space-y-6 max-h-[60vh] md:max-h-[65vh] overflow-y-auto custom-scrollbar"
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("email")}*
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: t("emailRequired") })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.email
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      />
                      {errors.email && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.email.message}
                        </p>
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
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.plantName
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      />
                      {errors.plantName && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.plantName.message}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                      {t("installerCode")}
                    </label>
                    <input
                      type="text"
                      {...register("installerCode")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                      {t("address")}*
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        {...register("address", {
                          required: t("addressRequired"),
                        })}
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          errors.address
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-custom-dark-blue dark:text-custom-yellow hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        <IoLocationSharp className="text-2xl" />
                      </motion.button>
                    </div>
                    {errors.address && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.address.message}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("classification")}*
                      </label>
                      <select
                        {...register("classification", {
                          required: t("classificationRequired"),
                        })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.classification
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      >
                        <option value="">{t("selectClassification")}</option>
                        <option value="residential">{t("residential")}</option>
                        <option value="ground-mounted">
                          {t("groundMounted")}
                        </option>
                        <option value="commercial-rooftop">
                          {t("commercialRooftop")}
                        </option>
                        <option value="battery-storage">
                          {t("batteryStorage")}
                        </option>
                      </select>
                      {errors.classification && (
                        <p className="text-red-500 mt-1 text-sm">
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
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.capacity
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      />
                      {errors.capacity && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.capacity.message}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("module")}*
                      </label>
                      <input
                        type="number"
                        {...register("module", {
                          required: t("moduleRequired"),
                        })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.module
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      />
                      {errors.module && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.module.message}
                        </p>
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
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.profitRatio
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      />
                      {errors.profitRatio && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.profitRatio.message}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                      {t("uploadPhotos")}
                    </label>
                    <input
                      type="file"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {imagePreviews.map((img, index) => (
                          <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-2"
                          >
                            <Image
                              src={img.url}
                              alt={img.name}
                              width={100}
                              height={100}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <p className="mt-2 text-xs text-center text-gray-600 dark:text-gray-300 truncate">
                              {truncateName(img.name)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex justify-end items-center gap-4 pt-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SecondaryButton type="button" onClick={onClose}>
                        {t("cancel")}
                      </SecondaryButton>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <PrimaryButton type="submit">{t("submit")}</PrimaryButton>
                    </motion.div>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>

          <SelectAddressOnMap
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            onLocationSelect={onMapLocationSelect}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPlantForm;
