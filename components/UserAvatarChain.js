import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import defaultAvatar from "@/public/assets/img/avatar.webp";

const UserAvatarChain = ({ users, maxDisplay = 5 }) => {
  return (
    <div className="flex -space-x-3">
      {users.slice(0, maxDisplay).map((user, index, key) => (
        <motion.div
          key={user.id}
          initial={{ scale: 0, x: -20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative w-10 h-10 rounded-full border-2 dark:border-custom-light-gray border-gray-800 bg-white dark:bg-gray-800"
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              layout="fill"
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
      {users.length > maxDisplay && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800"
        >
          +{users.length - maxDisplay}
        </motion.div>
      )}
    </div>
  );
};

export default UserAvatarChain;
