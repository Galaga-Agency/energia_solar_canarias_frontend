import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaUserTie } from "react-icons/fa";
import { X } from "lucide-react";
import avatar from "@/public/assets/img/avatar.webp";

const UserDetailsModalHeader = ({ user, editedUser, onClose, t }) => {
  const [imageSrc, setImageSrc] = useState(user.imagen || avatar.src); // Use .src for imported image

  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4 min-w-0">
        {/* Profile Image & Badge */}
        <div className="flex-shrink-0 relative w-20 h-20">
          <Image
            src={imageSrc}
            alt={user.nombre || "Default avatar"}
            width={80}
            height={80}
            className="rounded-full border-4 border-white dark:border-gray-800 object-cover"
            onError={() => setImageSrc(avatar.src)}
            sizes="80px"
            priority
          />
          {user.clase === "admin" && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-custom-yellow text-custom-dark-blue px-3 py-0.5 rounded-full text-sm flex items-center gap-1 shadow-lg whitespace-nowrap">
              <FaUserTie className="w-3 h-3" />
              {t("admin")}
            </div>
          )}
        </div>
        {/* User Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-custom-dark-blue dark:text-custom-yellow truncate">
              {`${editedUser.nombre} ${editedUser.apellido}`}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1 truncate">
            {editedUser.email}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="flex-shrink-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
      >
        <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
      </motion.button>
    </div>
  );
};

export default UserDetailsModalHeader;
