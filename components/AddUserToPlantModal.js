import React, { useState } from "react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Texture from "@/components/Texture";
import UserListItem from "@/components/UserListItem";

const AddUserToPlantModal = ({ isOpen, onClose, users, onAddUser, t }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      (user.nombre || user.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
    >
      <Texture className="opacity-30" />

      <div className="relative z-10">
        <button
          onClick={onClose}
          className="absolute top-0 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
        </button>

        <h3 className="text-xl font-bold mb-4 text-custom-dark-blue dark:text-custom-yellow">
          {t("selectUser")}
        </h3>

        <input
          type="text"
          placeholder={t("searchUsersByNameOrEmail")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow"
        />

        <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                showLoginStatus={false}
                isAssociatedUser={false}
                onAdd={() => onAddUser(user)}
                t={t}
              />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              {t("noUsersFound")}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddUserToPlantModal;
