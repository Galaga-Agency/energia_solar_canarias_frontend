import React, { useState, useRef, useEffect } from "react";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslation } from "next-i18next";
import useLocalStorageState from "use-local-storage-state";
import { useDispatch } from "react-redux";
import { updateUser, fetchUserById } from "@/store/slices/userSlice";
import { motion } from "framer-motion";
import { FaPencilAlt } from "react-icons/fa";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

const ProfileOverviewCard = ({ user, profilePic, setProfilePic }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [localFormData, setLocalFormData] = useState(user);

  const formFields = [
    { key: "name", name: "nombre", label: t("name") },
    { key: "surname", name: "apellido", label: t("surname") },
    { key: "email", name: "email", label: t("email") },
    { key: "mobile", name: "movil", label: t("mobile") },
    { key: "company", name: "empresa", label: t("company") },
    { key: "address", name: "direccion", label: t("address") },
    { key: "city", name: "ciudad", label: t("city") },
    { key: "postcode", name: "codigo_postal", label: t("postcode") },
    { key: "country", name: "pais", label: t("country") },
    { key: "cifNif", name: "cif_nif", label: t("cifNif") },
  ];

  useEffect(() => {
    if (user) {
      setLocalFormData(user);
    }
  }, [user]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (name, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(
        updateUser({
          userId: user.usuario_id || user.id,
          userData: {
            ...localFormData,
            imagen: profilePic,
          },
          token: user?.tokenIdentificador,
        })
      ).unwrap();

      await dispatch(
        fetchUserById({
          token: user.tokenIdentificador,
        })
      ).unwrap();

      toast.success(t("userUpdatedSuccessfully"));
      setIsFlipped(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(t("failedToUpdateUser"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full perspective">
      <div
        className={`relative h-[650px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face - Display Mode */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl shadow-lg p-6 backdrop-blur-lg backdrop-filter backface-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {t("profileOverview")}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFlipped(true)}
              className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30 transition-colors"
            >
              <FaPencilAlt className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src={profilePic}
              alt="Profile"
              fill
              className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow shadow-dark-shadow object-cover"
            />
          </div>

          <div className="space-y-4">
            {formFields.map(({ key, name, label }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-custom-dark-gray">
                  {label}:
                </span>
                <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                  {localFormData[name] || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Face - Edit Mode */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl shadow-lg p-6 backdrop-blur-lg backdrop-filter backface-hidden rotate-y-180">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {t("editProfile")}
            </h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFlipped(false);
                  setLocalFormData(user);
                }}
                className="p-2 rounded-full bg-gray-200 text-custom-dark-blue hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSaving}
                className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src={profilePic}
              alt="Profile"
              fill
              className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow shadow-lg object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="group absolute backdrop-blur-lg backdrop-filter top-2 right-2 bg-custom-light-gray/90 dark:bg-custom-dark-blue p-2 rounded-full shadow-md border-2 border-custom-dark-blue dark:border-custom-yellow hover:bg-custom-dark-blue hover:dark:bg-custom-yellow transition-colors duration-300"
            >
              <BiPencil className="text-xl text-custom-dark-blue dark:text-custom-yellow group-hover:text-custom-light-gray group-hover:dark:text-custom-dark-blue transition-colors duration-300" />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>

          <div className="space-y-3">
            {formFields.map(({ key, name, label }) => (
              <div
                key={key}
                className="flex justify-between items-center group relative"
              >
                <span className="text-gray-500 dark:text-custom-dark-gray">
                  {label}:
                </span>
                <input
                  type={name === "email" ? "email" : "text"}
                  value={localFormData[name] || ""}
                  onChange={(e) => handleFormChange(name, e.target.value)}
                  className="w-48 py-1 px-2 text-right bg-transparent border-b border-gray-300 dark:border-gray-700 
                    text-custom-dark-blue dark:text-custom-yellow text-sm
                    focus:outline-none focus:border-custom-yellow focus:ring-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewCard;
