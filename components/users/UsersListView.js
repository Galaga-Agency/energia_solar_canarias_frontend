import React from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { IoTrashOutline } from "react-icons/io5";
import { BsClockHistory } from "react-icons/bs";
import useDeviceType from "@/hooks/useDeviceType";
import UsersListSkeleton from "@/components/loadingSkeletons/UsersListSkeleton";

const UsersListView = ({ users, isLoading, onUserClick }) => {
  const { t } = useTranslation();
  const { isMobile } = useDeviceType();

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
    const diffInDays = Math.floor(
      (now - lastLoginDate) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays < 1)
      return {
        color: "green-500",
        text: t("lastLogin") + ": " + t("today"),
        description: lastLoginDate.toLocaleTimeString(),
      };

    if (diffInDays < 7)
      return {
        color: "blue-500",
        text: t("lastLogin") + ": " + diffInDays + " " + t("daysAgo"),
        description: lastLoginDate.toLocaleDateString(),
      };

    if (diffInDays < 30)
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

    return {
      color: "gray-400",
      text: t("lastLogin") + ": " + lastLoginDate.toLocaleDateString(),
      description: t("inactive"),
    };
  };

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const loginStatus = getLoginStatus(user.lastLogin);

        return (
          <div
            key={user.usuario_id}
            onClick={() => onUserClick(user.usuario_id)}
            className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between p-4">
              {/* User Information Section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={user.imagen || "/assets/default-profile.png"}
                    alt={user.usuario_nombre}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-white dark:border-gray-800 object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-${loginStatus.color} border-2 border-white dark:border-gray-800`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Status and Actions Section */}
              <div className="flex items-center gap-6">
                {!isMobile && (
                  <div className="flex items-center gap-2 text-right">
                    <BsClockHistory
                      className={`w-4 h-4 text-${loginStatus.color}`}
                    />
                    <div>
                      <div
                        className={`text-sm text-${loginStatus.color} font-medium`}
                      >
                        {loginStatus.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {loginStatus.description}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle edit
                    }}
                    className="p-2 hover:bg-white/80 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={t("editUser")}
                  >
                    <AiOutlineEdit className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title={t("deleteUser")}
                  >
                    <IoTrashOutline className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Status Bar */}
            {isMobile && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <BsClockHistory
                  className={`w-4 h-4 text-${loginStatus.color}`}
                />
                <div className="flex-1 flex justify-between items-center">
                  <span
                    className={`text-sm text-${loginStatus.color} font-medium`}
                  >
                    {loginStatus.text}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {loginStatus.description}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UsersListView;
