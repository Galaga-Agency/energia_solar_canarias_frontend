import React, { useState, useRef, useEffect } from "react";
import { BiPencil } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadProfilePicture,
  updateUser,
  fetchUserById,
  selectUser,
  deleteProfilePicture,
} from "@/store/slices/userSlice";
import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { FaPencilAlt } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import DeleteProfilePictureConfirmModal from "./DeleteProfilePictureConfirmModal";
import useDeviceType from "@/hooks/useDeviceType";

const ProfileOverviewCard = ({ profilePic, setProfilePic }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localProfilePic, setLocalProfilePic] = useState(profilePic);
  const fileInputRef = useRef(null);
  const defaultAvatar = "/assets/img/avatar.webp";
  const user = useSelector(selectUser);
  const [localFormData, setLocalFormData] = useState(user);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isMobile } = useDeviceType();

  const formFields = [
    { key: "name", name: "nombre", label: t("profile_name") },
    { key: "surname", name: "apellido", label: t("profile_surname") },
    { key: "email", name: "email", label: t("profile_email") },
    { key: "mobile", name: "movil", label: t("profile_mobile") },
    { key: "company", name: "empresa", label: t("profile_company") },
    { key: "address", name: "direccion", label: t("profile_address") },
    { key: "city", name: "ciudad", label: t("profile_city") },
    { key: "postcode", name: "codigo_postal", label: t("profile_postcode") },
    { key: "country", name: "pais", label: t("profile_country") },
    { key: "cifNif", name: "cif_nif", label: t("profile_cifnif") },
  ];

  useEffect(() => {
    setLocalFormData(user);
  }, [user]);

  useEffect(() => {
    setLocalProfilePic(profilePic);
  }, [profilePic]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("profile_invalid_image"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profile_file_size_error"));
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const uploadResponse = await dispatch(
        uploadProfilePicture({ formData, token: user.tokenIdentificador })
      ).unwrap();

      if (uploadResponse?.data?.path) {
        setLocalProfilePic(uploadResponse?.data?.path);
        setProfilePic(uploadResponse?.data?.path);
      }

      toast.success(t("profile_picture_update_success"));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(t("profile_picture_update_error"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormChange = (name, value) => {
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(
        updateUser({
          userId: user.usuario_id,
          userData: localFormData,
          token: user.tokenIdentificador,
        })
      ).unwrap();

      const updatedUser = await dispatch(
        fetchUserById({ token: user.tokenIdentificador })
      ).unwrap();

      if (updatedUser?.imagen) {
        setProfilePic(updatedUser.imagen);
      }

      toast.success(t("profile_update_success"));
      setIsFlipped(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t("profile_update_error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfilePic = async () => {
    if (!user.imagen) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteProfilePicture()).unwrap();
      setLocalProfilePic(defaultAvatar);
      setProfilePic(defaultAvatar);
      toast.success(t("profile_delete_picture_success"));
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      toast.error(t("profile_delete_picture_error"));
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="relative w-full perspective">
        <div
          className={`relative h-[690px] md:h-[650px] transition-transform duration-700 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front Face */}
          <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl shadow-lg p-6 backdrop-blur-lg backdrop-filter backface-hidden">
            <div className="relative flex items-center justify-between mb-4">
              <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
                {t("profile_overview")}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFlipped(true)}
                className="absolute -top-1 -right-1 p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30 transition-colors"
                aria-label={t("profile_edit")}
              >
                <FaPencilAlt className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <img
                src={localProfilePic || defaultAvatar}
                alt={t("profile_picture")}
                className="w-full h-full rounded-full object-cover border-4 border-custom-dark-blue dark:border-custom-yellow"
                onError={(e) => (e.target.src = defaultAvatar)}
              />
            </div>

            <div className="space-y-4">
              {formFields.map(({ key, name, label }) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-custom-dark-gray">
                    {label}:
                  </span>
                  <span
                    className={`text-custom-dark-blue dark:text-custom-yellow 
                    text-right ${
                      isMobile &&
                      "truncate max-w-[200px] whitespace-nowrap text-ellipsis"
                    } overflow-hidden`}
                  >
                    {localFormData[name] || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/50 rounded-xl shadow-lg p-6 backdrop-blur-lg backdrop-filter backface-hidden rotate-y-180">
            <div className="relative flex items-center justify-between mb-4">
              <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
                {t("profile_edit")}
              </h2>
              <div className="absolute -top-1 -right-1 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFlipped(false)}
                  className="p-2 rounded-full bg-gray-200 text-custom-dark-blue hover:bg-gray-300 transition-colors"
                  aria-label={t("profile_cancel")}
                >
                  <X className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30 transition-colors disabled:opacity-50"
                  aria-label={t("profile_save")}
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
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-custom-dark-blue dark:border-custom-yellow">
                <Image
                  src={localProfilePic || defaultAvatar}
                  alt={t("profile_picture")}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = defaultAvatar)}
                />

                {(isUploading || isDeleting) && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="group absolute backdrop-blur-lg backdrop-filter bottom-[45px] -right-6 bg-custom-light-gray/90 dark:bg-custom-dark-blue p-2 rounded-full shadow-md border-4 border-custom-dark-blue dark:border-custom-yellow hover:bg-custom-dark-blue hover:dark:bg-custom-yellow transition-colors duration-300"
                aria-label={t("profile_change_picture")}
              >
                <BiPencil className="text-2xl text-custom-dark-blue dark:text-custom-yellow group-hover:text-custom-light-gray group-hover:dark:text-custom-dark-blue transition-colors duration-300" />
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isUploading || isDeleting || !user.imagen}
                className="group absolute backdrop-blur-lg backdrop-filter bottom-0 -right-4 text-red-500 bg-custom-light-gray/90 dark:bg-custom-dark-blue p-2 rounded-full shadow-md border-4 border-custom-dark-blue dark:border-custom-yellow hover:bg-red-500 hover:dark:bg-red-500 transition-colors duration-300"
                aria-label={t("profile_delete_picture")}
              >
                <Trash2 className="text-2xl group-hover:text-custom-light-gray group-hover:dark:text-custom-dark-blue transition-colors duration-300 text-red-500" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
                aria-label={t("profile_upload_picture")}
              />
            </div>

            <div className="space-y-3">
              {formFields.map(({ key, name, label }) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-custom-dark-gray">
                    {label}:
                  </span>
                  <input
                    type={name === "email" ? "email" : "text"}
                    value={localFormData[name] || ""}
                    onChange={(e) => handleFormChange(name, e.target.value)}
                    className="w-48 py-1 px-2 text-right bg-transparent border-b border-gray-300 dark:border-gray-700 text-custom-dark-blue dark:text-custom-yellow text-sm focus:outline-none focus:border-custom-yellow focus:ring-0"
                    aria-label={label}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DeleteProfilePictureConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProfilePic}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ProfileOverviewCard;
