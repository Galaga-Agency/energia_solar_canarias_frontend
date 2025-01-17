import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaPencilAlt } from "react-icons/fa";
import { Check, Loader2, X } from "lucide-react";

const UserDetailsSection = ({
  editedUser,
  handleInputChange,
  handleSave,
  isSaving,
  t,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [localFormData, setLocalFormData] = useState(editedUser);

  const handleFormChange = (name, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocalSave = async (formData) => {
    const result = await handleSave(formData);
    if (result) {
      setLocalFormData(result);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data being sent:", localFormData);
    const result = await handleLocalSave(localFormData);
    if (result) {
      setIsFlipped(false);
    }
  };

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
    setLocalFormData(editedUser);
  }, [editedUser]);

  return (
    <div className="relative w-full perspective">
      <div
        className={`relative h-[500px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face - Display Mode */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl shadow-lg p-6 backdrop-blur-lg backdrop-filter backface-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-custom-dark-blue dark:text-custom-yellow">
              {t("administrarUsuario")}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFlipped(true)}
              className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30 transition-colors"
            >
              <FaPencilAlt className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="space-y-4">
            {formFields.map(({ key, name, label }) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-custom-dark-gray">
                  {label}:
                </span>
                <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                  {editedUser[name] || ""}
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
                  setLocalFormData(editedUser);
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
                  type="text"
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

export default UserDetailsSection;
