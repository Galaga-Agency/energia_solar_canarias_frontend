import React from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { IoTrashOutline } from "react-icons/io5";
import UsersListSkeleton from "@/components/loadingSkeletons/UsersListSkeleton";

const UsersGridView = ({ users, isLoading, onUserClick }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <UsersListSkeleton rows={10} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <div
          key={user.usuario_id}
          onClick={() => onUserClick(user.usuario_id)}
          className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
        >
          {/* User Info */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src={user.imagen || "/assets/default-profile.png"}
                alt={user.usuario_nombre}
                width={80}
                height={80}
                className="rounded-full border-4 border-white dark:border-gray-800"
              />
              {user.clase === "admin" && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <FaUserTie />
                  {t("admin")}
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {user.usuario_nombre} {user.apellido}
              </h3>
              <p className="text-sm text-custom-dark-blue/70 dark:text-custom-light-gray/70">
                {user.email}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle edit
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <AiOutlineEdit className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete
              }}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
            >
              <IoTrashOutline className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersGridView;
