import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import UsersListSkeleton from "@/components/loadingSkeletons/UsersListSkeleton";
import useTouchDevice from "@/hooks/useTouchDevice";
import UserEditModal from "@/components/users/UserEditModal";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import DeleteConfirmationModal from "@/components/users/DeleteConfirmationModal";
import UserGridItem from "@/components/UserGridItem";

const UsersGridView = ({ users = [], isLoading, onUserClick, onUserSave }) => {
  const { t } = useTranslation();
  const isTouchDevice = useTouchDevice();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getLoginStatus = (lastLogin) => {
    if (!lastLogin)
      return {
        color: "gray-400",
        text: t("lastLogin") + ": -",
        description: t("noLoginRecorded"),
      };

    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now - lastLoginDate) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      if (diffInHours === 0) {
        return {
          color: "green-500",
          text: t("lastLogin") + ": " + t("justNow"),
          description: lastLoginDate.toLocaleTimeString(),
        };
      }
      return {
        color: "green-500",
        text: t("lastLogin") + ": " + diffInHours + " " + t("hoursAgo"),
        description: lastLoginDate.toLocaleTimeString(),
      };
    }

    if (diffInDays < 7) {
      return {
        color: "blue-500",
        text: t("lastLogin") + ": " + diffInDays + " " + t("daysAgo"),
        description: lastLoginDate.toLocaleDateString(),
      };
    }

    if (diffInDays < 30) {
      return {
        color: "yellow-500",
        text:
          t("lastLogin") +
          ": " +
          Math.floor(diffInDays / 7) +
          " " +
          t("weeksAgo"),
        description: lastLoginDate.toLocaleDateString(),
      };
    }

    return {
      color: "gray-400",
      text: t("lastLogin") + ": " + lastLoginDate.toLocaleDateString(),
      description: lastLoginDate.toLocaleTimeString(),
    };
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditClick = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return <UsersListSkeleton rows={10} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {users.map((user, key) => (
          <UserGridItem
            key={user.usuario_id}
            user={user}
            getLoginStatus={getLoginStatus}
            onClick={() => handleUserClick(user)}
            onEdit={(e) => handleEditClick(e, user)}
            onDelete={(e) => handleDeleteClick(e, user)}
            t={t}
          />
        ))}
      </div>

      {showDetailsModal && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
          onSave={onUserSave}
          onDelete={() => {
            setShowDetailsModal(false);
            setShowDeleteModal(true);
          }}
        />
      )}

      {showEditModal && (
        <UserEditModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          user={selectedUser}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default UsersGridView;
