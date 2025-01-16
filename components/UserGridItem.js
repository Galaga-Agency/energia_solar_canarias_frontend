import React from "react";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import defaultAvatar from "@/public/assets/img/avatar.webp";

const UserGridItem = ({ user, getLoginStatus, onClick, t }) => {
  const loginStatus = getLoginStatus(user.ultimo_login);

  return (
    <div
      onClick={onClick}
      className="relative bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg shadow-lg p-6 hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 cursor-pointer group"
    >
      {/* User Profile Section */}
      <div className="relative mb-4">
        <Image
          src={user.imagen !== null ? user.imagen : defaultAvatar.src}
          alt={user?.nombre || "User"}
          loading="eager"
          width={80}
          height={80}
          priority={true}
          unoptimized={true}
          onError={(e) => {
            e.currentTarget.src = defaultAvatar.src;
          }}
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
          {user.nombre} {user.apellido}
        </h3>
        <p className="text-sm text-custom-dark-blue/70 dark:text-custom-light-gray/70">
          {user.email}
        </p>
      </div>

      {/* Last Login Section */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <BsClockHistory className={`w-3.5 h-3.5 text-${loginStatus.color}`} />
        <span className={`text-sm text-${loginStatus.color}`}>
          {loginStatus.text}
        </span>
      </div>
    </div>
  );
};

export default UserGridItem;
