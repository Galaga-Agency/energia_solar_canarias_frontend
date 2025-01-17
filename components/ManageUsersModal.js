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

  // Open Add User modal
  const handleAddNewUser = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setIsUserListModalOpen(true);
    }, 500);
  };

  // Add a user from the list
  const handleAddUserFromList = (selectedUser) => {
    if (!selectedUser?.id && !selectedUser?.usuario_id) {
      console.error("Missing user ID for association.");
      return;
    }
    onAddUser(selectedUser);
    setIsUserListModalOpen(false);
  };

  // Remove a user
  const handleRemoveUser = (userId) => {
    if (!userId) {
      console.error("Missing user ID for dissociation.");
      return;
    }
    onRemoveUser(userId);
  };

  // Simulate initial loading state
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
        className="relative w-auto min-w-[80vw] md:min-w-[70vw] lg:min-w-[40vw] min-h-[50vh] rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
      >
        <Texture className="opacity-30" />

        <div className="relative z-10">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5 text-custom-dark-blue dark:text-custom-yellow" />
            </motion.button>

            <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mt-2">
              {t("manageUsers")}
            </h2>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder={t("searchUsers")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow"
          />

          {/* User List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          ) : filteredUsers?.length > 0 ? (
            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
              {filteredUsers.map((user) => (
                <UserListItem
                  key={user.id || user.usuario_id}
                  user={user}
                  showLoginStatus={false}
                  isAssociatedUser={true}
                  onRemove={() => handleRemoveUser(user.id || user.usuario_id)}
                  t={t}
                  buttonType="remove"
                />
              ))}
            </div>
          ) : (
            <div className="font-secondary flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              {t("noUsersFound")}
            </div>
          )}
        </div>

        {/* Add User Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNewUser}
          disabled={isAdding}
          className="absolute bottom-6 left-6 right-6 bg-custom-yellow text-custom-dark-blue py-2 px-4 rounded-lg font-medium hover:bg-custom-yellow/80 transition-colors flex items-center justify-center gap-2"
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
