import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { X } from "lucide-react";
import usePlantFilter from "@/hooks/usePlantFilter";
import Carousel from "@/components/ui/Carousel";
import Texture from "@/components/Texture";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { PiSolarPanelFill } from "react-icons/pi";

const mockAssociatedPlants = [
  {
    id: 1,
    name: "Solar Farm A",
    location: "Madrid, Spain",
    organization: "SolarPower Inc",
  },
  {
    id: 2,
    name: "Solar Roof B",
    location: "Barcelona, Spain",
    organization: "Sunshine Ltd",
  },
  {
    id: 3,
    name: "Solar Park C",
    location: "Valencia, Spain",
    organization: "SolarGreen",
  },
];

const UserDetailsModal = ({ user, isOpen, onClose, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [associatedPlants] = useState(mockAssociatedPlants);
  const [searchTerm, setSearchTerm] = useState("");
  const { filteredPlants, filterItems } = usePlantFilter(associatedPlants);

  useEffect(() => {
    filterItems(searchTerm, null);
  }, [searchTerm, filterItems]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const validImageSrc = user.imagen?.startsWith("http")
    ? user.imagen
    : "/assets/default-profile.png";

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
                className="relative w-full max-w-4xl rounded-2xl perspective"
              >
                <div className={`relative h-[600px]`}>
                  {/* Front Side - User Details */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 rounded-2xl p-6 backdrop-blur-lg shadow-xl backface-hidden">
                    <Texture className="opacity-30" />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                          <Image
                            src={user.imagen || "/assets/default-profile.png"}
                            alt={user.usuario_nombre}
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-white dark:border-gray-800"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow">
                                {user.usuario_nombre} {user.apellido}
                              </h2>
                              {user.clase === "admin" && (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-custom-yellow/20 text-custom-dark-blue dark:text-custom-yellow">
                                  <FaUserTie className="w-4 h-4" />
                                  {t("admin")}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Close Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={onClose}
                          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
                        </motion.button>
                      </div>

                      <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                            <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                              {t("userDetails")}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={onEdit}
                                className="p-2 hover:bg-white/80 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <FiEdit2 className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
                              </button>
                              <button
                                onClick={onDelete}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              >
                                <FiTrash2 className="w-5 h-5 text-red-500" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {[
                              { label: t("mobile"), value: user.movil },
                              { label: t("role"), value: user.clase },
                              {
                                label: t("state"),
                                value: user.activo
                                  ? t("active")
                                  : t("inactive"),
                              },
                              {
                                label: t("lastLogin"),
                                value: user.ultimo_login,
                              },
                            ].map((field, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                  {field.label}:
                                </span>
                                <span className="text-custom-dark-blue dark:text-custom-yellow">
                                  {field.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Associated Plants */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow border-b border-gray-200 dark:border-gray-700 pb-2">
                            {t("associatedPlants")}
                          </h3>
                          {associatedPlants.length > 0 ? (
                            <>
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search plants..."
                                className="w-full mb-4 p-2 border rounded-lg"
                              />
                              <Carousel
                                items={filteredPlants}
                                renderItem={(plant) => (
                                  <div className="p-4 border rounded-lg shadow-md">
                                    <h4 className="text-lg font-semibold">
                                      {plant.name}
                                    </h4>
                                    <p>{plant.location}</p>
                                    <p>{plant.organization}</p>
                                  </div>
                                )}
                              />
                            </>
                          ) : (
                            <div className="h-auto w-full flex flex-col justify-center items-center">
                              <PiSolarPanelFill className="mt-5 text-center text-4xl text-custom-dark-blue dark:text-custom-light-gray" />
                              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                {t("noAssociatedPlants")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;
