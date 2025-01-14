import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slices/usersListSlice";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Texture from "@/components/Texture";
import PasswordRequirements from "./PasswordRequirements";
import { X } from "lucide-react";
import { toast } from "sonner";

const AddUserForm = ({ onClose, isOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleFormSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data;

      const result = await dispatch(addUser(userData)).unwrap();
      toast.success(t("userAddedSuccessfully"));
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error(error.message || t("failedToAddUser"));
    }
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
                className="relative w-full max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 md:p-6 backdrop-blur-lg shadow-xl overflow-hidden"
              >
                <Texture className="opacity-30" />

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue mb-6"
                >
                  <div className="flex items-center gap-2">
                    <FiPlus className="text-2xl" />
                    <h2 className="text-xl md:text-2xl">{t("addUser")}</h2>
                  </div>

                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      reset();
                      onClose();
                    }}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="h-6 w-6 text-custom-dark-blue" />
                  </motion.button>
                </motion.div>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="p-6 space-y-6 max-h-[60vh] md:max-h-[65vh] overflow-y-auto custom-scrollbar"
                >
                  {/* Email Field - Full Width */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full"
                  >
                    <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                      {t("email")}*
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: t("emailRequired"),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t("invalidEmail"),
                        },
                      })}
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
                  </motion.div>

                  {/* Password Section */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {/* Password */}
                    <div className="relative">
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("password")}*
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...register("password", {
                            required: t("passwordRequired"),
                            minLength: {
                              value: 8,
                              message: t("passwordMinLength"),
                            },
                          })}
                          className={`w-full px-4 py-2 pr-10 rounded-lg border ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-200 dark:border-gray-700"
                          } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showPassword ? (
                            <FiEyeOff className="text-xl" />
                          ) : (
                            <FiEye className="text-xl" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("confirmPassword")}*
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword", {
                            required: t("confirmPasswordRequired"),
                            validate: (value) =>
                              value === password || t("passwordsDoNotMatch"),
                          })}
                          className={`w-full px-4 py-2 pr-10 rounded-lg border ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-200 dark:border-gray-700"
                          } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="text-xl" />
                          ) : (
                            <FiEye className="text-xl" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-gray-600 dark:text-gray-400 mt-4"
                  >
                    <PasswordRequirements password={password} t={t} />
                  </motion.div>

                  {/* Name Fields */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("name")}*
                      </label>
                      <input
                        type="text"
                        {...register("nombre", { required: t("nameRequired") })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.nombre
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                      />
                      {errors.nombre && (
                        <p className="text-red-500 mt-1 text-sm">
                          {errors.nombre.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("lastName")}
                      </label>
                      <input
                        type="text"
                        {...register("apellido")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Role Selection - Full Width */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                      {t("role")}*
                    </label>
                    <select
                      {...register("clase", { required: t("roleRequired") })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.clase
                          ? "border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      } bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all`}
                    >
                      <option value="">{t("selectRole")}</option>
                      <option value="admin">{t("admin")}</option>
                      <option value="usuario">{t("cliente")}</option>
                    </select>
                    {errors.clase && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.clase.message}
                      </p>
                    )}
                  </motion.div>

                  {/* Contact Information */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("mobile")}
                      </label>
                      <input
                        type="tel"
                        {...register("movil")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("company")}
                      </label>
                      <input
                        type="text"
                        {...register("empresa")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                      {t("address")}
                    </label>
                    <input
                      type="text"
                      {...register("direccion")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                    />
                  </motion.div>

                  {/* City and Postal Code */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("city")}
                      </label>
                      <input
                        type="text"
                        {...register("ciudad")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("postalCode")}
                      </label>
                      <input
                        type="text"
                        {...register("codigo_postal")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* State/Region and Country */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("state")}
                      </label>
                      <input
                        type="text"
                        {...register("region_estado")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                        {t("country")}
                      </label>
                      <input
                        type="text"
                        {...register("pais")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* CIF/NIF */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <label className="block mb-1 text-gray-700 dark:text-custom-light-gray">
                      {t("cifNif")}
                    </label>
                    <input
                      type="text"
                      {...register("cif_nif")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                    />
                  </motion.div>

                  {/* Required fields note */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="text-sm text-gray-600 dark:text-gray-400 mt-4"
                  >
                    * {t("requiredFields")}
                  </motion.div>

                  {/* Form buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4 }}
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
                      <PrimaryButton type="submit">
                        {t("addUser")}
                      </PrimaryButton>
                    </motion.div>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddUserForm;
