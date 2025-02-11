"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { IoFilter, IoPersonAddOutline } from "react-icons/io5";
import { HiUserAdd, HiViewGrid, HiViewList } from "react-icons/hi";
import { FaUserAltSlash, FaUserPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import Pagination from "@/components/ui/Pagination";
import Texture from "@/components/Texture";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import UsersSidebar from "@/components/users/UsersSidebar";
import UsersListView from "@/components/users/UsersListView";
import UsersGridView from "@/components/users/UsersGridView";
import UserSortMenu from "@/components/users/UserSortMenu";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import useDeviceType from "@/hooks/useDeviceType";
import {
  fetchUsers,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  updateUserInList,
} from "@/store/slices/usersListSlice";
import { addUser, selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import AddUserForm from "@/components/AddUserForm";
import { MdPersonAdd } from "react-icons/md";
import { RiUserAddLine } from "react-icons/ri";
import withAdminGuard from "@/components/AdminGuard";

const INITIAL_FILTERS = {
  role: ["all"],
  activeStatus: ["all"],
  search: "",
};

const UsersTab = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const currentUser = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sortPath, setSortPath] = useState("nombre");
  const [sortOrder, setSortOrder] = useState("asc");
  const isAdmin = useSelector(selectIsAdmin);

  const usersPerPage = useMemo(() => {
    if (isMobile) return 6;
    if (isTablet && viewMode === "list") return 7;
    if (isTablet && viewMode === "grid") return 6;
    return 6;
  }, [isMobile, isTablet, viewMode]);

  const filteredUsers = useMemo(() => {
    // Initial filtering
    let processedUsers =
      users?.filter((user) => {
        // Search filter
        if (
          filters.search &&
          !user.nombre.toLowerCase().includes(filters.search.toLowerCase()) &&
          !user.apellido.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }

        // Role filter
        if (
          !filters.role.includes("all") &&
          !filters.role.includes(user.clase)
        ) {
          return false;
        }

        // Active status filter
        if (!filters.activeStatus.includes("all")) {
          const isActive = user.activo === 1;
          if (filters.activeStatus.includes("active") && !isActive)
            return false;
          if (filters.activeStatus.includes("inactive") && isActive)
            return false;
        }

        return true;
      }) || [];

    // Sorting logic
    return processedUsers.sort((a, b) => {
      let valueA, valueB;
      switch (sortPath) {
        case "nombre":
          // Sort by full name (first name + last name)
          valueA = `${a.nombre} ${a.apellido}`.toLowerCase();
          valueB = `${b.nombre} ${b.apellido}`.toLowerCase();
          break;
        case "ultimo_login":
          // Sort by last login date
          valueA = a.ultimo_login || "";
          valueB = b.ultimo_login || "";
          break;
        default:
          valueA = `${a.nombre} ${a.apellido}`.toLowerCase();
          valueB = `${b.nombre} ${b.apellido}`.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, filters, sortPath, sortOrder]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
  }, [filteredUsers, currentPage, usersPerPage]);

  useEffect(() => {
    if (currentUser && !isUpdating) {
      setIsUpdating(true);
      dispatch(
        fetchUsers({
          userToken: currentUser?.tokenIdentificador,
          currentUserId: currentUser?.id,
        })
      ).finally(() => setIsUpdating(false));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, filteredUsers.length]);

  const handleUserSave = (updatedUser) => {
    dispatch(updateUserInList(updatedUser));
    dispatch(fetchUsers(currentUser.tokenIdentificador));
  };

  const handleUserClick = (userId) => {
    router.push(`/dashboard/${currentUser.id}/users/${userId}`);
  };

  const handleSortChange = (path, order) => {
    setSortPath(path);
    setSortOrder(order);
  };

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar mb-12">
      <TransitionEffect />
      {/* Theme and Language Controls */}
      <motion.div
        className="fixed top-4 right-4 flex items-center gap-2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <ThemeToggle />
        <LanguageSelector />
      </motion.div>
      <Texture />
      <motion.div
        className="p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Title Section */}
        <motion.div
          className="flex items-center my-6 xl:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-12 h-12 mr-2 z-10"
          />
          <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue max-w-[60vw]">
            {t("usersList")}
          </h2>
        </motion.div>

        {/* Filter Button - Mobile/Tablet Only */}
        <motion.button
          className="xl:hidden fixed bottom-20 left-5 z-40 bg-custom-yellow w-12 h-12 flex rounded-full justify-center items-center button-shadow"
          onClick={() => setIsSidebarOpen(true)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoFilter className="text-2xl text-custom-dark-blue" />
        </motion.button>

        <motion.div
          className="flex mt-8 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {/* Desktop Sidebar */}
          {!isMobile && !isTablet && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <UsersSidebar
                filters={filters}
                onFilterChange={setFilters}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </motion.div>
          )}

          {/* Mobile Sidebar */}
          {(isMobile || isTablet) && (
            <UsersSidebar
              filters={filters}
              onFilterChange={setFilters}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          )}

          {/* Main Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {/* View Controls */}
            <motion.div
              className="flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
              >
                <span className="text-custom-dark-blue dark:text-custom-yellow mb-6">
                  {t("usersFound")}: {filteredUsers.length}
                </span>
              </motion.div>
              <motion.div
                className="flex items-center justify-between mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <UserSortMenu onSortChange={handleSortChange} />
                </motion.div>
                <motion.div
                  className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-1 flex"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                        : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiViewList className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                        : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiViewGrid className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
            {/* Users Content */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {viewMode === "list" ? (
                    <UsersListView isLoading={true} users={[]} />
                  ) : (
                    <UsersGridView isLoading={true} users={[]} />
                  )}
                </motion.div>
              ) : !users || filteredUsers.length === 0 ? (
                <motion.div
                  className="h-auto w-full flex flex-col justify-center items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <FaUserAltSlash className="text-9xl text-custom-dark-blue dark:text-custom-light-gray mt-24" />
                  <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
                    {t("noUsersFound")}
                  </p>
                </motion.div>
              ) : viewMode === "list" ? (
                <UsersListView
                  users={paginatedUsers}
                  onUserClick={handleUserClick}
                  onUserSave={handleUserSave}
                />
              ) : (
                <UsersGridView
                  users={paginatedUsers}
                  onUserClick={handleUserClick}
                  onUserSave={handleUserSave}
                />
              )}
            </AnimatePresence>

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
              <motion.div
                className="mt-6 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {(isMobile || isTablet) && isSidebarOpen && (
          <UsersSidebar
            filters={filters}
            onFilterChange={setFilters}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      <AddUserForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      {/* Action Buttons */}
      <motion.button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-20 right-4 xl:right-10 w-12 h-12 lg:w-14 lg:h-14 flex rounded-full justify-center items-center button-shadow bg-custom-yellow text-custom-dark-blue  transition-all duration-300 button-shadow z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          whileHover={{ rotateY: 360, scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        >
          <RiUserAddLine className="text-2xl lg:text-3xl text-custom-dark-blue " />
        </motion.div>
      </motion.button>
      <BottomNavbar userId={currentUser?.id} userClass={currentUser?.clase} />
    </div>
  );
};

export default withAdminGuard(UsersTab);
