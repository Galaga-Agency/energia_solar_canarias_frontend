import React, { useState, useCallback, useEffect, useRef } from "react";
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

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userAdmin = useSelector(selectUser);
  const updatedUser = useSelector((state) =>
    state.usersList.users.find((u) => u.usuario_id === user.usuario_id)
  );

  const [editedUser, setEditedUser] = useState(() => ({ ...user }));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [plantToRemove, setPlantToRemove] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const userRef = useRef(user);

  useEffect(() => {
    if (user && user.usuario_id !== editedUser.usuario_id) {
      setEditedUser({ ...user });
      userRef.current = user;
    }
  }, [user]);

  useEffect(() => {
    if (updatedUser) {
      setEditedUser({ ...updatedUser });
      userRef.current = updatedUser;
    }
  }, [updatedUser]);

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
    setPlantToRemove(null);
    setIsConfirmModalOpen(false);
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

      await dispatch(
        fetchUsers({
          userToken: userAdmin?.tokenIdentificador,
          currentUserId: userAdmin?.id,
        })
      );

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
        onClose={onClose}
        className="p-0"
        backdropClass="backdrop-blur-sm"
      >
        <div className="relative w-full max-w-[90vw] md:max-w-4xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg p-6 rounded-xl">
          <Texture className="opacity-30" />

          <div className="relative z-10 flex flex-col h-full max-h-[75vh]">
            <UserDetailsModalHeader
              user={user}
              editedUser={editedUser}
              onClose={onClose}
              t={t}
            />

            <div className="overflow-y-auto max-h-[calc(100vh-12rem)] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side - User Details & Security */}
                <div className="space-y-6">
                  {/* User Management */}
                  <UserDetailsSection editedUser={editedUser} t={t} />

                  {/* Security */}
                  <div className="bg-white/90 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-4">
                      {t("security")}
                    </h2>
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

                {/* Right Side - Status, Plants, Danger Zone */}
                <div className="space-y-6 flex flex-col">
                  {/* Status & Last Login */}
                  <div className="bg-white/90 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm">
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
                        {editedUser?.ultimo_login &&
                        !isNaN(new Date(editedUser.ultimo_login))
                          ? new Date(
                              editedUser.ultimo_login
                            ).toLocaleDateString("es-ES")
                          : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Associated Plants */}
                  <AssociatedPlantsSection
                    onRemovePlant={handleRemovePlant}
                    onAddPlantClick={() => setIsAddModalOpen(true)}
                    t={t}
                    selectedUser={editedUser.usuario_id}
                    token={userAdmin?.tokenIdentificador}
                    userClass={editedUser.clase}
                  />

                  {/* Delete Account - Aligned at Bottom */}
                  <div className="flex-1 flex items-end">
                    <DangerZone onDelete={handleDeleteUser} t={t} />
                  </div>
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

export default React.memo(UserDetailsModal);
