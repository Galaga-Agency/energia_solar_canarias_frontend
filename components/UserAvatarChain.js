import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import defaultAvatar from "@/public/assets/img/avatar.webp";
import useDeviceType from "@/hooks/useDeviceType";

const UserAvatarChain = ({ users = [], maxDisplayProp = 15 }) => {
  const { isMobile, isTablet } = useDeviceType();

  // Adjust maxDisplay based on screen size
  const maxDisplay = isMobile ? 4 : isTablet ? 12 : maxDisplayProp;

  const displayedUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex -space-x-3 overflow-hidden">
        {displayedUsers.map((user, index) => (
          <motion.div
            key={user.usuario_id}
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 
            dark:border-custom-light-gray border-gray-800 bg-white dark:bg-gray-800 
            flex-shrink-0"
          >
            {user.imagen ? (
              <Image
                src={user.imagen}
                alt={user.nombre}
                fill
                sizes="(max-width: 640px) 32px, 40px"
                className="rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar.src;
                }}
              />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400 dark:text-gray-600" />
            )}
          </motion.div>
        ))}
        {remainingCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 
            dark:bg-gray-700 flex items-center justify-center text-xs sm:text-sm 
            font-medium text-gray-600 dark:text-gray-400 border-2 border-white 
            dark:border-gray-800 flex-shrink-0"
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserAvatarChain;
