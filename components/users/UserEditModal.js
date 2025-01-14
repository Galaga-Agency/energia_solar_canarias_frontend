import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import Texture from "@/components/Texture";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { updateUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";

const UserEditModal = ({ user, isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      email: user?.email || "",
      movil: user?.movil || "",
      clase: user?.clase || "user",
    },
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUser({ userId: user.usuario_id, ...data })).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
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
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 backdrop-blur-lg shadow-xl overflow-hidden"
              >
                <Texture className="opacity-30" />

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue mb-6"
                >
                  <FiPlus className="text-2xl" />
                  <h2 className="text-xl font-bold">{t("editUser")}</h2>
                </motion.div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 p-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-gray-300">
                        {t("name")}*
                      </label>
                      <input
                        {...register("nombre", {
                          required: t("nameRequired"),
                        })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-yellow focus:ring-2 focus:ring-custom-yellow/20 outline-none"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-gray-300">
                        {t("mobile")}
                      </label>
                      <PhoneInput
                        country="es"
                        value={user?.movil}
                        onChange={(phone) => register("movil").onChange(phone)}
                        inputStyle={{
                          width: "100%",
                          background:
                            theme === "dark" ? "rgb(31 41 55)" : "white",
                          color: theme === "dark" ? "#FFD57A" : "#002C3F",
                          border: "1px solid",
                          borderColor:
                            theme === "dark"
                              ? "rgb(75 85 99)"
                              : "rgb(229 231 235)",
                          borderRadius: "0.5rem",
                          height: "2.5rem",
                        }}
                        containerStyle={{
                          width: "100%",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-gray-700 dark:text-gray-300">
                        {t("role")}*
                      </label>
                      <select
                        {...register("clase", { required: t("roleRequired") })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-yellow focus:ring-2 focus:ring-custom-yellow/20 outline-none"
                      >
                        <option value="user">{t("user")}</option>
                        <option value="admin">{t("admin")}</option>
                      </select>
                      {errors.clase && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.clase.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <SecondaryButton type="button" onClick={onClose}>
                      {t("cancel")}
                    </SecondaryButton>
                    <PrimaryButton type="submit">{t("save")}</PrimaryButton>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserEditModal;
