import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import defaultAvatar from "@/public/assets/img/avatar.webp";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import ConfirmRemoveUserModal from "@/components/ConfirmRemoveUserModal";

const UserListItem = ({
  user,
  loginStatus,
  onUserClick,
  onAdd,
  onRemove,
  t,
  showLoginStatus = true,
  isAssociatedUser = false,
  buttonType = "remove", // Default to "remove"
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClick = () => {
    if (onUserClick) {
      onUserClick(user);
    } else {
      setShowDetailsModal(true);
    }
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = () => {
    onRemove?.(user);
    setShowConfirmModal(false);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAdd?.(user);
  };

  const modals = (
    <>
      {showDetailsModal && (
        <UserDetailsModal
          user={user}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      {showConfirmModal && (
        <ConfirmRemoveUserModal
          user={user}
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmRemove}
          t={t}
        />
      )}
    </>
  );

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-white dark:bg-custom-dark-blue backdrop-blur-sm rounded-lg hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 cursor-pointer group px-4 py-2 mx-auto max-w-full"
      >
        <div className="flex items-center gap-4 w-auto">
          {/* Avatar */}
          <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20">
            <Image
              src={user.imagen || defaultAvatar.src}
              alt={user?.nombre || user?.name || "User"}
              layout="fill"
              objectFit="cover"
              className="rounded-full border-2 border-white dark:border-gray-800"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar.src;
              }}
            />
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                user.activo === 1 ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          {/* User Info */}
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-custom-dark-blue dark:text-custom-yellow truncate">
              {user?.nombre || ""} {user?.apellido || ""}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          {/* Last Login Block */}
          {showLoginStatus && loginStatus && (
            <div className="hidden md:flex items-center gap-2">
              <BsClockHistory className={`w-5 h-5 text-${loginStatus.color}`} />
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

          {/* Action Button */}
          <div className="flex justify-end w-auto">
            {buttonType === "remove" && isAssociatedUser && (
              <button
                onClick={handleRemoveClick}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors md:w-auto"
              >
                {t("remove")}
              </button>
            )}
            {buttonType === "add" && (
              <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors md:w-auto"
              >
                {t("add")}
              </button>
            )}
          </div>
        </div>
      </div>
      {typeof window !== "undefined" && createPortal(modals, document.body)}
    </>
  );
};

export default UserListItem;
