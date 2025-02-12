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

  // Filter users based on the search term
  const filteredUsers = users?.filter((user) =>
    (user.nombre || user.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAddNewUser = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsUserListModalOpen(true);
    }, 500);
  };

  const handleAddUserFromList = (selectedUser) => {
    if (!selectedUser?.id && !selectedUser?.usuario_id) {
      console.error("Missing user ID for association.");
      return;
    }
    onAddUser(selectedUser);
    setIsUserListModalOpen(false);
  };

  const handleRemoveUser = (userId) => {
    if (!userId) {
      console.error("Missing user ID for dissociation.");
      return;
    }
    onRemoveUser(userId);
  };

  useEffect(() => {
    const loadingDelay = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingDelay);
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="relative w-auto min-w-[80vw] md:min-w-[70vw] lg:min-w-[40vw] h-[80vh] max-w-[90vw] md:max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg shadow-xl"
      >
        <Texture className="opacity-30" />

        {/* Main content container with padding and flex layout */}
        <div className="relative z-10 flex flex-col h-full p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
              {t("manageUsers")}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
            </motion.button>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder={t("searchUsers")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow"
            />
          </div>

          {/* User List Section - Flex-grow to take remaining space */}
          <div className="flex-grow overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            ) : (
              <div className="h-full overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserListItem
                      key={user.id || user.usuario_id}
                      user={user}
                      showLoginStatus={false}
                      isAssociatedUser={true}
                      onRemove={() =>
                        handleRemoveUser(user.id || user.usuario_id)
                      }
                      t={t}
                      buttonType="remove"
                      disableClick={true}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-secondary text-gray-500 dark:text-gray-400">
                      {t("noUsersFound")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Section - Fixed at bottom */}
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddNewUser}
              disabled={isAdding}
              className="font-secondary w-full bg-custom-yellow text-custom-dark-blue py-2 px-4 rounded-lg font-medium hover:bg-custom-yellow/80 transition-colors flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <p className="font-secondary font-semibold">{t("addUser")}</p>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
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
