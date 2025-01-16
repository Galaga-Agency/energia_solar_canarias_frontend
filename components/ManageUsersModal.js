import React, { useEffect, useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import Texture from "@/components/Texture";
import UserListItem from "@/components/UserListItem";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import Loading from "./ui/Loading";
import AddUserToPlantModal from "./AddUserToPlantModal";

const ManageUsersModal = ({
  isOpen,
  onClose,
  users,
  onAddUser,
  onRemoveUser,
  t,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserListModalOpen, setIsUserListModalOpen] = useState(false);

  const filteredUsers = users.filter((user) =>
    (user.nombre || user.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewUser = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsUserListModalOpen(true);
    }, 500);
  };

  useEffect(() => {
    const loadingDelay = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingDelay);
  }, []);

  const handleAddUserFromList = (selectedUser) => {
    onAddUser(selectedUser);
    setIsUserListModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
      >
        <Texture className="opacity-30" />

        <div className="relative z-10">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-0 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
          </motion.button>

          <h3 className="text-xl font-bold mb-4 text-custom-dark-blue dark:text-custom-yellow">
            {t("manageUsers")}
          </h3>

          <input
            type="text"
            placeholder={t("searchUsers")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow"
          />
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
              {filteredUsers.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  showLoginStatus={false}
                  isAssociatedUser={true}
                  onRemove={() => onRemoveUser(user.id)}
                  t={t}
                />
              ))}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddNewUser}
            disabled={isAdding}
            className="mt-4 w-full bg-custom-yellow text-custom-dark-blue py-2 px-4 rounded-lg font-medium hover:bg-custom-yellow/80 transition-colors flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {t("addUser")}
              </>
            )}
          </motion.button>
        </div>
      </Modal>

      <AddUserToPlantModal
        isOpen={isUserListModalOpen}
        onClose={() => setIsUserListModalOpen(false)}
        users={users}
        onAddUser={handleAddUserFromList}
        t={t}
      />
    </>
  );
};

export default ManageUsersModal;
