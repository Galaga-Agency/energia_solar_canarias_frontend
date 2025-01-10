import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPencilAlt } from "react-icons/fa";
import { Check, Loader2 } from "lucide-react";

const UserDetailsSection = ({
  editedUser,
  handleInputChange,
  handleSave,
  isSaving,
  t,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const FormRow = ({ label, value, onChange, type = "text" }) => (
    <div className="flex justify-between items-center group relative">
      <span className="text-gray-500 dark:text-custom-dark-gray">{label}:</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-[200px] py-0.5 px-2 text-right bg-transparent border-b border-gray-300 dark:border-gray-700 
                 text-custom-dark-blue dark:text-custom-yellow text-sm
                 focus:outline-none focus:border-custom-yellow"
      />
    </div>
  );

  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="relative w-full perspective pt-2">
      <div
        className={`relative h-[530px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face: User Details */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl shadow-lg p-6 backdrop-blur-lg backdrop-filter backface-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {t("administrarUsuario")}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFlip}
              className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30 transition-colors"
            >
              <FaPencilAlt className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="space-y-4">
            {Object.entries({
              name: editedUser.usuario_nombre,
              surname: editedUser.apellido,
              email: editedUser.email,
              mobile: editedUser.movil,
              company: editedUser.empresa,
              address: editedUser.direccion,
              city: editedUser.ciudad,
              postcode: editedUser.codigo_postal,
              region: editedUser.region,
              country: editedUser.pais,
              cifNif: editedUser.cif_nif,
            }).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center group relative"
              >
                <span className="text-gray-500 dark:text-custom-dark-gray">
                  {t(key)}:
                </span>
                <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                  {value || ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Face: Edit Form */}
        <div className="absolute w-full h-full bg-transparent dark:bg-gray-800/30 rounded-xl shadow-lg p-6 backdrop-blur-lg backdrop-filter backface-hidden rotate-y-180">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
              {t("editProfile")}
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                handleSave();
                toggleFlip();
              }}
              className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </motion.button>
          </div>
          <form className="space-y-4">
            {Object.entries({
              name: editedUser.usuario_nombre,
              surname: editedUser.apellido,
              email: editedUser.email,
              mobile: editedUser.movil,
              company: editedUser.empresa,
              address: editedUser.direccion,
              city: editedUser.ciudad,
              postcode: editedUser.codigo_postal,
              region: editedUser.region,
              country: editedUser.pais,
              cifNif: editedUser.cif_nif,
            }).map(([key, value]) => (
              <FormRow
                key={key}
                label={t(key)}
                value={value}
                onChange={(e) =>
                  handleInputChange(
                    key === "name"
                      ? "usuario_nombre"
                      : key === "surname"
                      ? "apellido"
                      : key,
                    e.target.value
                  )
                }
              />
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSection;
