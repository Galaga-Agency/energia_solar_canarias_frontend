import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import UsersListSkeleton from "@/components/loadingSkeletons/UsersListSkeleton";
import useTouchDevice from "@/hooks/useTouchDevice";
import useFormattedDate from "@/hooks/useFormattedDate";
import UserDetailsModal from "@/components/users/UserDetailsModal";
import DeleteConfirmationModal from "@/components/users/DeleteConfirmationModal";
import useDeviceType from "@/hooks/useDeviceType";
import UserListItem from "@/components/UserListItem";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import { motion, AnimatePresence } from "framer-motion";

const UsersListView = ({ users, isLoading, onUserClick, onUserSave }) => {
  const { t } = useTranslation();
  const isTouchDevice = useTouchDevice();
  const getLoginStatus = useFormattedDate();
  const { isMobile } = useDeviceType();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const theme = useSelector(selectTheme);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditClick = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return <UsersListSkeleton rows={5} theme={theme} />;
  }

  return (
    <div className="mb-8">
      <div className="space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <UserListItem
              user={user}
              loginStatus={getLoginStatus(user.ultimo_login)}
              isMobile={isMobile}
              isTouchDevice={isTouchDevice}
              onUserClick={handleUserClick}
              onDelete={(e) => handleDeleteClick(e, user)}
              t={t}
            />
          </motion.div>
        ))}
      </div>

      {showDetailsModal && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onDelete={() => {
            setShowDetailsModal(false);
            setShowDeleteModal(true);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          user={selectedUser}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default UsersListView;
