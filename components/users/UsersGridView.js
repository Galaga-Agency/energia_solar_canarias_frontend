import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { IoTrashOutline } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import UsersListSkeleton from "@/components/loadingSkeletons/UsersListSkeleton";
import useTouchDevice from "@/hooks/useTouchDevice";
import UserEditModal from "@/components/users/UserEditModal";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import DeleteConfirmationModal from "@/components/users/DeleteConfirmationModal";

const UsersGridView = ({ users, isLoading, onUserClick, onUserSave }) => {
  const { t } = useTranslation();
  const isTouchDevice = useTouchDevice();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return <UsersListSkeleton rows={10} />;
  }

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {users.map((user) => (
          <div
            key={user.usuario_id}
            onClick={() => handleUserClick(user)}
            className="relative bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg shadow-lg p-6 hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 cursor-pointer group"
          >
            {/* User Profile Section */}
            <div className="relative mb-4">
              <Image
                src={user.imagen || "/assets/default-profile.png"}
                alt={user.usuario_nombre}
                width={80}
                height={80}
                className="rounded-full border-4 border-white dark:border-gray-800 mx-auto"
              />
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                  user.activo === 1 ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {user.clase === "admin" && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue px-3 py-0.5 rounded-full text-sm flex items-center gap-1">
                  <FaUserTie className="w-3 h-3" />
                  {t("admin")}
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {user.usuario_nombre} {user.apellido}
              </h3>
              <p className="text-sm text-custom-dark-blue/70 dark:text-custom-light-gray/70">
                {user.email}
              </p>
            </div>

            {/* Last Login Section */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <BsClockHistory
                className={`w-3.5 h-3.5 text-${
                  getLoginStatus(user.ultimo_login).color
                }`}
              />
              <span
                className={`text-sm text-${
                  getLoginStatus(user.ultimo_login).color
                }`}
              >
                {getLoginStatus(user.ultimo_login).text}
              </span>
            </div>

            {/* Action Buttons */}
            {/* <div
              className={`absolute top-4 left-4 flex justify-center gap-3 ${
                isTouchDevice
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              } transition-opacity`}
            >
              <button
                onClick={(e) => handleEditClick(e, user)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                title={t("edit")}
              >
                <AiOutlineEdit className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, user)}
                className="p-2 bg-red-100 dark:bg-red-900 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition"
                title={t("delete")}
              >
                <IoTrashOutline className="w-5 h-5 text-red-500 dark:text-red-400" />
              </button>
            </div> */}
          </div>
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
