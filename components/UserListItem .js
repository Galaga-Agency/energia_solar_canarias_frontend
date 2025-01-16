import React from "react";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import defaultAvatar from "@/public/assets/img/avatar.webp";

const UserListItem = ({ user, loginStatus, isMobile, onClick, t }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 cursor-pointer group max-w-[85vw] md:max-w-[92vw] mx-auto"
    >
      <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_250px_auto] items-center gap-4 p-4">
        {/* Avatar */}
        <div
          className="relative flex-shrink-0 w-[48px] h-[48px] md:w-[64px] md:h-[64px]"
          style={{ minWidth: "48px" }}
        >
          <Image
            src={user.imagen !== null ? user.imagen : defaultAvatar.src}
            alt={user?.nombre || "User"}
            layout="fill"
            objectFit="cover"
            className="rounded-full border-2 border-white dark:border-gray-800"
            loading="eager"
            priority={true}
            unoptimized={true}
            onError={(e) => {
              e.currentTarget.src = defaultAvatar.src;
            }}
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
              {user.nombre} {user.apellido}
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
            <BsClockHistory className={`w-4 h-4 text-${loginStatus.color}`} />
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
      </div>
    </div>
  );
};

export default UserListItem;
