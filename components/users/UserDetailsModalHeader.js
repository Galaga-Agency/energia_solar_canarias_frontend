import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaUserTie } from "react-icons/fa";
import { X } from "lucide-react";
import avatar from "@/public/assets/img/avatar.webp";

const UserDetailsModalHeader = React.memo(
  ({ user, editedUser, onClose, t }) => {
    const [imageSrc, setImageSrc] = useState(user?.imagen || avatar.src);

    const handleImageError = useCallback(() => {
      setImageSrc(avatar.src);
    }, []);

    // Safely access user data with fallbacks
    const userName = `${editedUser?.nombre || ""} ${
      editedUser?.apellido || ""
    }`.trim();
    const userEmail = editedUser?.email || "";
    const isAdmin = user?.clase === "admin";

    return (
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 min-w-0">
          {/* Profile Image & Badge */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-full">
            <Image
              src={imageSrc}
              alt={userName || "Default avatar"}
              fill
              className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow object-cover"
              onError={handleImageError}
              sizes="80px"
              priority
            />
            {isAdmin && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-custom-yellow text-custom-dark-blue px-3 py-0.5 rounded-full text-sm flex items-center gap-1 shadow-lg whitespace-nowrap">
                <FaUserTie className="w-3 h-3" />
                {t("admin")}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl text-custom-dark-blue dark:text-custom-yellow truncate w-full">
                {userName || t("unnamed")}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-1 truncate w-full">
              {userEmail || t("noEmail")}
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
  }
);

UserDetailsModalHeader.displayName = "UserDetailsModalHeader";

export default UserDetailsModalHeader;
