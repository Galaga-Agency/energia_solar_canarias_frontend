import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import Texture from "@/components/Texture";
import {
  updateUser,
  sendPasswordResetEmail,
  selectUser,
  deleteUser,
} from "@/store/slices/userSlice";
import PasswordForm from "./PasswordForm";
import UserDetailsSection from "./UserDetailsSection";
import AssociatedPlantsSection from "./AssociatedPlantsSection";
import AssociatePlantModal from "./AssociatePlantModal";
import DangerZone from "@/components/DangerZone";
import ConfirmRemoveModal from "./ConfirmRemoveModal";
import ConfirmDeleteUserModal from "./ConfirmDeleteUserModal";
import { fetchUsers, updateUserInList } from "@/store/slices/usersListSlice";
import UserDetailsModalHeader from "./UserDetailsModalHeader";

const UserDetailsModal = ({ user, isOpen, onClose, onDelete, onSave }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [plantToRemove, setPlantToRemove] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const userAdmin = useSelector(selectUser);
  const updatedUser = useSelector((state) =>
    state.usersList.users.find((u) => u.usuario_id === user.usuario_id)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(() => ({ ...user }));

  useEffect(() => {
    if (user) {
      setEditedUser({
        ...JSON.parse(JSON.stringify(user)),
      });
    }
  }, [user]);

  useEffect(() => {
    if (updatedUser) {
      setEditedUser({ ...updatedUser });
    }
  }, [updatedUser]);

  const handleSave = async (formData) => {
    if (!formData?.usuario_id) {
      toast.error(t("invalidUserData"));
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await dispatch(
        updateUser({
          userId: formData.usuario_id,
          userData: {
            ...formData,
            activo: formData.activo || editedUser.activo,
            clase: formData.clase || editedUser.clase,
          },
          token: userAdmin?.tokenIdentificador,
        })
      ).unwrap();

      dispatch(updateUserInList(updatedUser));

      const currentUserToken = userAdmin?.tokenIdentificador;
      if (!currentUserToken) {
        throw new Error("User token is missing");
      }
      await dispatch(
        fetchUsers({
          userToken: currentUserToken,
          currentUserId: userAdmin?.id,
        })
      );

      toast.success(t("userUpdatedSuccessfully"));
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(t("failedToUpdateUser"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      await dispatch(
        sendPasswordResetEmail({ email: editedUser.email })
      ).unwrap();
      toast.success(t("passwordResetEmailSent"));
    } catch (error) {
      console.error("Failed to send password reset:", error);
      toast.error(t("failedToSendPasswordReset"));
    } finally {
      setIsPasswordResetSent(false);
    }
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
      await dispatch(
        deleteUser({
          userId: editedUser.usuario_id,
          token: userAdmin?.tokenIdentificador,
        })
      ).unwrap();

      await dispatch(fetchUsers(userAdmin?.tokenIdentificador));

      toast.success(t("userDeletedSuccessfully"));
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(t("failedToDeleteUser"));
    }
  };

  if (!editedUser) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="p-0"
        backdropClass="backdrop-blur-sm"
      >
        <div className="relative w-full max-w-6xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg p-6 rounded-xl">
          <Texture className="opacity-30" />

          <div className="relative z-10 flex flex-col h-full max-h-[75vh]">
            <UserDetailsModalHeader
              user={user}
              editedUser={editedUser}
              onClose={handleClose}
              t={t}
            />

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
                  <div className="bg-white/90 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
                      {t("security")}
                    </h3>
                    <div className="space-y-6">
                      <PasswordForm userId={editedUser.usuario_id} t={t} />

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                          {t("resetPasswordEmail")}
                        </h4>
                        <button
                          onClick={handlePasswordReset}
                          disabled={isPasswordResetSent}
                          className="w-full bg-custom-yellow text-custom-dark-blue py-2.5 px-4 rounded-lg hover:bg-custom-yellow/50 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isPasswordResetSent ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("sendingReset")}
                            </>
                          ) : (
                            t("sendResetLink")
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-white/90 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm mt-2">
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
                        {new Date(editedUser.ultimo_login).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <AssociatedPlantsSection
                    onRemovePlant={handleRemovePlant}
                    onAddPlantClick={() => setIsAddModalOpen(true)}
                    t={t}
                    selectedUser={editedUser.usuario_id}
                    token={userAdmin?.tokenIdentificador}
                    userClass={editedUser.clase}
                  />

                  <DangerZone onDelete={handleDeleteUser} t={t} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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
  );
};

export default UserDetailsModal;
