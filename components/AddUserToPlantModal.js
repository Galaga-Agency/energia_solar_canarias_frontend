import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@/components/ui/Modal";
import Texture from "@/components/Texture";
import UserListItem from "@/components/UserListItem";
import { selectUsers, fetchUsers } from "@/store/slices/usersListSlice";
import { selectUser } from "@/store/slices/userSlice";
import { motion } from "framer-motion";

const AddUserToPlantModal = ({
  isOpen,
  onClose,
  users,
  onAddUser,
  t,
  isAddingUser,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const allUsers = useSelector(selectUsers);
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    if (currentUser?.tokenIdentificador) {
      dispatch(
        fetchUsers({
          userToken: currentUser.tokenIdentificador,
          currentUserId: currentUser.usuario_id,
        })
      );
    }
  }, [dispatch, currentUser]);

  // Filter out existing users and admins
  const availableUsers = allUsers.filter(
    (user) =>
      !users.some(
        (existingUser) => existingUser.usuario_id === user.usuario_id
      ) && user.clase !== "admin"
  );

  // Filter users based on search term
  const filteredUsers = availableUsers.filter(
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
      className="relative w-auto min-w-[80vw] md:min-w-[70vw] lg:min-w-[40vw] h-[70vh] max-w-[90vw] md:max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg shadow-xl"
    >
      <Texture className="opacity-30" />

      {/* Main content container with flex layout */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
            {t("selectUser")}
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

        {/* Search Input Section */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={t("searchUsersByNameOrEmail")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow"
          />
        </div>

        {/* User List Section - Flex-grow to take remaining space */}
        <div className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <UserListItem
                  key={user.id || index}
                  user={user}
                  showLoginStatus={false}
                  isAssociatedUser={false}
                  onAdd={() => onAddUser(user)}
                  t={t}
                  buttonType="add"
                  disableClick={true}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 italic">
                  {t("noUsersFound")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserToPlantModal;
