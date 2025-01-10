import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { FaPlus, FaUserTie } from "react-icons/fa";
import { X, AlertTriangle, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Texture from "@/components/Texture";
import { Eye, EyeOff } from "lucide-react";
import PlantsListTableItem from "../PlantsListTableItem";
import { updateUser, sendPasswordResetEmail } from "@/store/slices/userSlice";
import PasswordInput from "../ui/PasswordInput";

const mockAssociatedPlants = [
  {
    id: 1,
    name: "Solar Farm A",
    location: "Madrid, Spain",
    organization: "SolarPower Inc",
  },
  // ... other mock plants
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Initialize editedUser when modal opens or user changes
  useEffect(() => {
    if (user) {
      setEditedUser({
        ...JSON.parse(JSON.stringify(user)), // Deep clone to avoid shared references
        newPassword: "",
        confirmPassword: "",
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
      toast.error(t("failedToUpdateUser"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setEditedUser((prev) => ({
      ...prev,
      newPassword: "",
      confirmPassword: "",
    }));
    onClose();
  };

  useEffect(() => {
    console.log("Edited User Updated:", editedUser);
  }, [editedUser]);

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

  const filteredPlants = useMemo(() => {
    return associatedPlants.filter((plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [associatedPlants, searchTerm]);

  if (!editedUser) return null;

  const FormRow = ({ label, value, onChange, type = "text" }) => (
    <div className="flex justify-between items-center group relative">
      <span className="text-gray-500 dark:text-custom-dark-gray">{label}:</span>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-[200px] py-0.5 px-2 text-right bg-transparent border-b border-gray-300 dark:border-gray-700 
                   text-custom-dark-blue dark:text-custom-yellow text-sm
                   focus:outline-none focus:border-custom-yellow"
        />
      ) : (
        <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
          {value || ""}
        </span>
      )}
    </div>
  );

  console.log("Edited User:", editedUser);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] overflow-y-auto custom-scrollbar">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Main Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-8 backdrop-blur-lg shadow-xl"
            >
              <Texture className="opacity-30" />

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
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
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue px-3 py-0.5 rounded-full text-sm flex items-center gap-1">
                          <FaUserTie className="w-3 h-3" />
                          {t("admin")}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow">
                        {editedUser.usuario_nombre} {editedUser.apellido}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 truncate max-w-md">
                        {editedUser.email}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
                  </motion.button>
                </div>

                {/* Two Column Layout */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column - User Details */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow border-b pb-2">
                        {t("userDetails")}
                      </h3>

                      <div className="space-y-3">
                        <FormRow
                          label={t("name")}
                          value={editedUser.usuario_nombre}
                          onChange={(e) =>
                            handleInputChange("usuario_nombre", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("surname")}
                          value={editedUser.apellido}
                          onChange={(e) =>
                            handleInputChange("apellido", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("email")}
                          value={editedUser.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          type="email"
                        />
                        <FormRow
                          label={t("mobile")}
                          value={editedUser.movil}
                          onChange={(e) =>
                            handleInputChange("movil", e.target.value)
                          }
                          type="tel"
                        />
                        <FormRow
                          label={t("company")}
                          value={editedUser.empresa}
                          onChange={(e) =>
                            handleInputChange("empresa", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("userAdress")}
                          value={editedUser.direccion}
                          onChange={(e) =>
                            handleInputChange("direccion", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("city")}
                          value={editedUser.ciudad}
                          onChange={(e) =>
                            handleInputChange("ciudad", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("postcode")}
                          value={editedUser.codigo_postal}
                          onChange={(e) =>
                            handleInputChange("codigo_postal", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("regionState")}
                          value={editedUser.region}
                          onChange={(e) =>
                            handleInputChange("region", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("country")}
                          value={editedUser.pais}
                          onChange={(e) =>
                            handleInputChange("pais", e.target.value)
                          }
                        />
                        <FormRow
                          label={t("cifNif")}
                          value={editedUser.cif_nif}
                          onChange={(e) =>
                            handleInputChange("cif_nif", e.target.value)
                          }
                        />
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-custom-dark-gray">
                            {t("state")}:
                          </span>
                          <span className="text-custom-dark-blue dark:text-custom-yellow">
                            {editedUser.activo ? t("active") : t("inactive")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-custom-dark-gray">
                            {t("lastLogin")}:
                          </span>
                          <span className="text-custom-dark-blue dark:text-custom-yellow">
                            {new Date(
                              editedUser.ultimo_login
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      {isEditing ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          disabled={isSaving}
                          className="w-full bg-custom-dark-blue text-white py-3 px-4 rounded-lg hover:bg-custom-dark-blue/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("saving")}
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              {t("save")}
                            </>
                          )}
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsEditing(true)}
                          className="w-full bg-custom-dark-blue text-white py-3 px-4 rounded-lg hover:bg-custom-dark-blue/90"
                        >
                          {t("editUser")}
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDelete}
                        className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600"
                      >
                        {t("deleteUser")}
                      </motion.button>
                    </div>
                  </div>

                  {/* Right Column - Controls and Associated Plants */}
                  <div className="flex-1 col-span-2 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow border-b pb-2">
                        {t("controls")}
                      </h3>

                      {/* Password Update Section */}
                      <div className="space-y-3">
                        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                          {t("updatePassword")}
                        </h4>

                        {/* New Password Input */}
                        <div className="space-y-3">
                          <PasswordInput
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            showPassword={showNewPassword}
                            onTogglePassword={() =>
                              setShowNewPassword(!showNewPassword)
                            }
                            inputRef={newPasswordRef}
                          />
                          <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            showPassword={showConfirmPassword}
                            onTogglePassword={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            inputRef={confirmPasswordRef}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePasswordReset}
                          disabled={isPasswordResetSent}
                          className="w-full bg-custom-yellow text-white py-3 px-4 rounded-lg hover:bg-custom-yellow/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isPasswordResetSent ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("sendingReset")}
                            </>
                          ) : (
                            t("resetPassword")
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Associated Plants Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow border-b pb-2">
                        {t("associatedPlants")}
                      </h3>

                      <input
                        type="text"
                        placeholder={t("filterPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
                      />

                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {filteredPlants.map((plant) => (
                          <div
                            key={plant.id}
                            className="relative flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <PlantsListTableItem plant={plant} />
                            <button
                              onClick={() => handleRemovePlant(plant)}
                              className="absolute top-1/2 right-4 transform -translate-y-1/2 px-2 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            >
                              {t("remove")}
                            </button>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-custom-dark-blue text-white py-3 px-4 rounded-lg hover:bg-custom-dark-blue/90"
                      >
                        <FaPlus className="w-4 h-4" /> {t("associatePlant")}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Add Plant Modal */}
          <AnimatePresence>
            {isAddModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
                >
                  <Texture className="opacity-30" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 text-custom-dark-blue dark:text-custom-yellow">
                      {t("addPlant")}
                    </h3>
                    <input
                      type="text"
                      placeholder={t("searchPlaceholder")}
                      className="w-full mb-4 p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow"
                    />
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {allPlants.map((plant) => (
                        <div
                          key={plant.id}
                          className="flex justify-between items-center p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <span className="text-custom-dark-blue dark:text-custom-yellow">
                            {plant.name}
                          </span>
                          <button
                            onClick={() => handleAddPlant(plant)}
                            className="text-custom-yellow hover:text-custom-yellow/80 transition-colors"
                          >
                            {t("add")}
                          </button>
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsAddModalOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm Remove Modal */}
          <AnimatePresence>
            {isConfirmModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
                >
                  <Texture className="opacity-30" />
                  <div className="relative z-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-200" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                      {t("confirmAction")}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {t("confirmRemovePlant", { name: plantToRemove?.name })}
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsConfirmModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        {t("cancel")}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={confirmRemovePlant}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        {t("confirm")}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;
