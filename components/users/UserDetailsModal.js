import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { FaUserTie } from "react-icons/fa";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Texture from "@/components/Texture";
import {
  updateUser,
  sendPasswordResetEmail,
  selectUser,
} from "@/store/slices/userSlice";
import PasswordForm from "./PasswordForm";
import UserDetailsSection from "./UserDetailsSection";
import AssociatedPlantsSection from "./AssociatedPlantsSection";
import AssociatePlantModal from "./AssociatePlantModal";
import DangerZone from "./DangerZone";
import ConfirmRemoveModal from "./ConfirmRemoveModal";
import ConfirmDeleteUserModal from "./ConfirmDeleteUserModal";

const mockAssociatedPlants = [
  {
    id: 1,
    name: "Solar Farm A",
    location: "Madrid, Spain",
    organization: "SolarPower Inc",
  },
  {
    id: 2,
    name: "Solar Farm A",
    location: "Madrid, Spain",
    organization: "SolarPower Inc",
  },
  {
    id: 3,
    name: "Solar Farm A",
    location: "Madrid, Spain",
    organization: "SolarPower Inc",
  },
  {
    id: 4,
    name: "Solar Farm A",
    location: "Madrid, Spain",
    organization: "SolarPower Inc",
  },
  {
    id: 5,
    name: "Solar Farm A",
    location: "Madrid, Spain",
    organization: "SolarPower Inc",
  },
];

const mockAllPlants = [
  ...mockAssociatedPlants,
  {
    id: 11,
    name: "Solar City K",
    location: "Seville, Spain",
    organization: "SunTech",
  },
  {
    id: 12,
    name: "Solar Farm L",
    location: "Madrid, Spain",
    organization: "EnergyMax",
  },
  {
    id: 13,
    name: "Solar Park M",
    location: "Barcelona, Spain",
    organization: "PowerSun",
  },
];

const UserDetailsModal = ({ user, isOpen, onClose, onDelete, onSave }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(() => ({
    usuario_id: user.usuario_id,
    usuario_nombre: user.usuario_nombre,
    apellido: user.apellido,
    email: user.email,
    movil: user.movil,
    empresa: user.empresa || "",
    direccion: user.direccion || "",
    ciudad: user.ciudad || "",
    codigo_postal: user.codigo_postal || "",
    region: user.region || "",
    pais: user.pais || "",
    cif_nif: user.cif_nif || "",
    clase: user.clase,
    activo: user.activo,
    ultimo_login: user.ultimo_login,
  }));

  const [associatedPlants, setAssociatedPlants] =
    useState(mockAssociatedPlants);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [plantToRemove, setPlantToRemove] = useState(null);
  const [allPlants] = useState(mockAllPlants);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const userAdmin = useSelector(selectUser);

  // Initialize editedUser when modal opens or user changes
  useEffect(() => {
    if (user) {
      setEditedUser({
        ...JSON.parse(JSON.stringify(user)),
      });
    }
  }, [user]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (!editedUser?.usuario_id) {
      toast.error(t("invalidUserData"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      return;
    }

    setIsSaving(true);

    try {
      const result = await dispatch(
        updateUser({
          userId: editedUser.usuario_id,
          ...editedUser,
          password: newPassword || undefined,
        })
      ).unwrap();

      // Clear passwords after saving
      setNewPassword("");
      setConfirmPassword("");

      setIsEditing(false);
      toast.success(t("userUpdatedSuccessfully"));

      if (typeof onSave === "function") {
        onSave(result);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      setIsEditing(false);
      toast.error(t("failedToUpdateUser"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handlePasswordReset = async () => {
    if (!editedUser?.email) return;

    setIsPasswordResetSent(true);
    try {
      await dispatch(sendPasswordResetEmail(editedUser.email)).unwrap();
      toast.success(t("passwordResetEmailSent"));
    } catch (error) {
      console.error("Failed to send password reset:", error);
      toast.error(t("failedToSendPasswordReset"));
    } finally {
      setIsPasswordResetSent(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemovePlant = (plant) => {
    setPlantToRemove(plant);
    setIsConfirmModalOpen(true);
  };

  const confirmRemovePlant = () => {
    setAssociatedPlants((prev) =>
      prev.filter((p) => p.id !== plantToRemove.id)
    );
    setPlantToRemove(null);
    setIsConfirmModalOpen(false);
  };

  const handleAddPlant = (plant) => {
    setAssociatedPlants((prev) => [...prev, plant]);
    setIsAddModalOpen(false);
  };

  const handleDeleteUser = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await dispatch(updateUser({ ...editedUser, eliminado: 1 })).unwrap();
      toast.success(t("userDeletedSuccessfully"));
      setIsDeleteModalOpen(false);
      onClose(); // Close the modal after deletion
    } catch (error) {
      toast.error(t("failedToDeleteUser"));
    }
  };

  if (!editedUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
            >
              <Texture className="opacity-30" />

              <div className="relative z-10 flex flex-col h-full max-h-[75vh]">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={user.imagen || "/assets/default-profile.png"}
                        alt={user.usuario_nombre}
                        width={80}
                        height={80}
                        className="rounded-full border-4 border-white dark:border-gray-800"
                      />
                      {user.clase === "admin" && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-custom-yellow text-custom-dark-blue px-3 py-0.5 rounded-full text-sm flex items-center gap-1 shadow-lg">
                          <FaUserTie className="w-3 h-3" />
                          {t("admin")}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow">
                          {`${editedUser.usuario_nombre} ${editedUser.apellido}`}
                        </h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {editedUser.email}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
                  </motion.button>
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-12rem)] custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <UserDetailsSection
                        editedUser={editedUser}
                        isEditing={isEditing}
                        handleInputChange={handleInputChange}
                        handleSave={handleSave}
                        setIsEditing={setIsEditing}
                        isSaving={isSaving}
                        t={t}
                      />

                      {/* Security Section */}
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
                          {t("security")}
                        </h3>
                        <div className="space-y-6">
                          <PasswordForm handleSave={handleSave} t={t} />

                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                              {t("resetPasswordEmail")}
                            </h4>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handlePasswordReset}
                              disabled={isPasswordResetSent}
                              className="w-full bg-custom-yellow text-custom-dark-blue  py-2.5 px-4 rounded-lg hover:bg-custom-yellow/50 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isPasswordResetSent ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  {t("sendingReset")}
                                </>
                              ) : (
                                t("sendResetLink")
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600 dark:text-gray-300">
                            {t("state")}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              editedUser.activo
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                            }`}
                          >
                            {editedUser.activo ? t("active") : t("inactive")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">
                            {t("lastLogin")}
                          </span>
                          <span className="text-custom-dark-blue dark:text-custom-yellow">
                            {new Date(
                              editedUser.ultimo_login
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <AssociatedPlantsSection
                        onRemovePlant={handleRemovePlant}
                        onAddPlantClick={() => setIsAddModalOpen(true)}
                        t={t}
                        selectedUser={editedUser.usuario_id}
                        token={userAdmin?.tokenIdentificador}
                      />

                      <DangerZone onDelete={handleDeleteUser} t={t} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {isAddModalOpen && (
            <AssociatePlantModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              selectedUser={editedUser.usuario_id}
              token={userAdmin?.tokenIdentificador}
              t={t}
            />
          )}

          {isConfirmModalOpen && (
            <ConfirmRemoveModal
              isOpen={isConfirmModalOpen}
              plant={plantToRemove}
              onClose={() => setIsConfirmModalOpen(false)}
              onConfirm={confirmRemovePlant}
              t={t}
            />
          )}

          {isDeleteModalOpen && (
            <ConfirmDeleteUserModal
              isOpen={isDeleteModalOpen}
              user={editedUser}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={confirmDeleteUser}
              t={t}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;
