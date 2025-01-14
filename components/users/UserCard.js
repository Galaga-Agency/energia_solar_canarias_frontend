import React from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
import { IoTrashOutline } from "react-icons/io5";

const UserCard = ({ user, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg p-4 group">
      <div className="flex items-center gap-4">
        <Image
          src={user.imagen || "/assets/default-profile.png"}
          alt={user.nombre}
          width={60}
          height={60}
          className="rounded-full border-2 border-custom-dark-blue dark:border-custom-yellow"
        />
        <div>
          <h3 className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
            {user.nombre}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {user.email}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:underline transition"
        >
          <AiOutlineEdit className="inline-block mr-2" />
          {t("edit")}
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:underline transition"
        >
          <IoTrashOutline className="inline-block mr-2" />
          {t("delete")}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
