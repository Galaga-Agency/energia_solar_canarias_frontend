import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { IoTrashOutline } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import UsersListSkeleton from "@/components/loadingSkeletons/UsersListSkeleton";
import useTouchDevice from "@/hooks/useTouchDevice";
import useFormattedDate from "@/hooks/useFormattedDate";
import UserEditModal from "@/components/users/UserEditModal";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import DeleteConfirmationModal from "@/components/users/DeleteConfirmationModal";
import useDeviceType from "@/hooks/useDeviceType";

const UsersListView = ({ users, isLoading, onUserClick, onUserSave }) => {
  const { t } = useTranslation();
  const isTouchDevice = useTouchDevice();
  const getLoginStatus = useFormattedDate();
  const { isMobile } = useDeviceType();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (isLoading) {
    return <UsersListSkeleton rows={10} />;
  }

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
    <div className="mb-8">
      <div className="space-y-4">
        {users.map((user) => {
          const loginStatus = getLoginStatus(user.ultimo_login);

          return (
            <div
              key={user.usuario_id}
              onClick={() => handleUserClick(user)}
              className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 cursor-pointer group max-w-[85vw] md:max-w-[92vw] mx-auto"
            >
              <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_250px_auto] items-center gap-4 p-4">
                {/* Avatar */}
                <div
                  className="relative flex-shrink-0 w-[48px] h-[48px] md:w-[64px] md:h-[64px]"
                  style={{ minWidth: "48px" }} // Prevents shrinking
                >
                  <Image
                    src={user.imagen || "/assets/default-profile.png"}
                    alt={user.usuario_nombre}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full border-2 border-white dark:border-gray-800"
                    loading="eager"
                  />
                  <div
                    className={`absolute -bottom-0 -right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                      user.activo === 1 ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                {/* User Info */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-custom-dark-blue dark:text-custom-yellow">
                      {user.usuario_nombre} {user.apellido}
                    </h3>
                    {user.clase === "admin" && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-custom-yellow/20 text-custom-dark-blue dark:text-custom-yellow">
                        <FaUserTie className="w-3 h-3" />
                        {t("admin")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.email}
                  </p>
                </div>

                {/* Last Login Block */}
                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <BsClockHistory
                      className={`w-4 h-4 text-${loginStatus.color}`}
                    />
                    <div>
                      <div className={`text-sm text-${loginStatus.color}`}>
                        {loginStatus.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {loginStatus.description}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {/* {!isMobile && (
                  <div
                    className={`flex items-center gap-2 ${
                      isTouchDevice
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  >
                    <button
                      onClick={(e) => handleEditClick(e, user)}
                      className="p-2 hover:bg-white/80 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title={t("editUser")}
                    >
                      <AiOutlineEdit className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, user)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title={t("deleteUser")}
                    >
                      <IoTrashOutline className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          );
        })}
      </div>

      {showDetailsModal && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onSave={onUserSave}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowEditModal(true);
          }}
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
    </div>
  );
};

export default UsersListView;
