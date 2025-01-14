"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { IoFilter } from "react-icons/io5";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import { FaUserAltSlash } from "react-icons/fa";
import Pagination from "@/components/ui/Pagination";
import Texture from "@/components/Texture";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import UsersSidebar from "@/components/users/UsersSidebar";
import UsersListSkeleton from "@/components/loadingSkeletons/UsersListSkeleton";
import UsersGridSkeleton from "@/components/loadingSkeletons/UsersGridSkeleton";
import UsersListView from "@/components/users/UsersListView";
import UsersGridView from "@/components/users/UsersGridView";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import useDeviceType from "@/hooks/useDeviceType";

import {
  fetchUsers,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  updateUserInList,
} from "@/store/slices/usersListSlice";
import { selectUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import AddUserForm from "@/components/AddUserForm";
import { PlusIcon } from "@heroicons/react/24/outline";

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
  const { isMobile, isTablet } = useDeviceType();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const usersPerPage = isMobile
    ? 6
    : isTablet
    ? 7
    : viewMode === "grid"
    ? 6 // Show 6 items in grid view on desktop
    : 5; // Keep 5 items in list view on desktop

  useEffect(() => {
    if (currentUser) {
      // console.log("currentUser ------->", currentUser);
      dispatch(
        fetchUsers({
          userToken: currentUser.tokenIdentificador,
          currentUserId: currentUser.id,
        })
      );
    }
  }, [dispatch, currentUser]);

  const handleUserSave = (updatedUser) => {
    // Update the user in Redux store
    dispatch(updateUserInList(updatedUser));
    // Optionally refresh the list
    dispatch(fetchUsers(currentUser.tokenIdentificador));
  };

  const filteredUsers =
    users?.filter((user) => {
      const currentFilters = filters || INITIAL_FILTERS;

      // Search filter
      if (
        currentFilters.search &&
        !user.nombre.toLowerCase().includes(currentFilters.search.toLowerCase())
      ) {
        return false;
      }

      // Role filter
      const userRoles = currentFilters.role || ["all"];
      if (!userRoles.includes("all") && !userRoles.includes(user.clase)) {
        return false;
      }

      // Active status filter
      const activeStatus = currentFilters.activeStatus || ["all"];
      if (!activeStatus.includes("all")) {
        const isActive = user.activo === 1;
        if (activeStatus.includes("active") && !isActive) return false;
        if (activeStatus.includes("inactive") && isActive) return false;
      }

      return true;
    }) || [];

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, filteredUsers.length]);

  const handleUserClick = (userId) => {
    router.push(`/dashboard/${currentUser.id}/users/${userId}`);
  };

  // console.log("users", users);

  return (
    <>
      <TransitionEffect />
      <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar">
        <Texture />

        <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
          <ThemeToggle />
          <LanguageSelector />
        </div>

        <div className="p-8">
          {/* Title Section */}
          <div className="flex items-center">
            <Image
              src={companyIcon}
              alt="Company Icon"
              className="w-12 h-12 mr-2 z-10"
              priority
            />
            <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue">
              {t("usersList")}
            </h2>
          </div>

          {/* Filter Button - Mobile/Tablet Only */}
          <button
            className="xl:hidden fixed bottom-20 left-5 z-40 bg-custom-yellow p-3 rounded-full justify-center transition-colors duration-300 button-shadow flex items-center"
            onClick={() => setIsSidebarOpen(true)}
          >
            <IoFilter className="text-xl text-custom-dark-blue" />
          </button>

          <div className="flex mt-8 gap-6">
            {/* Sidebar - Desktop */}
            {!isMobile && !isTablet && (
              <UsersSidebar
                filters={filters}
                onFilterChange={setFilters}
                isOpen={isSidebarOpen}
              />
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* View Controls */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-custom-dark-blue dark:text-custom-yellow">
                  {t("usersFound")}: {filteredUsers.length}
                </span>

                <div className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                        : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <HiViewList className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
                        : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <HiViewGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Users List/Grid */}
              {isLoading ? (
                viewMode === "list" ? (
                  <UsersListSkeleton theme={theme} rows={usersPerPage} />
                ) : (
                  <UsersGridSkeleton theme={theme} rows={usersPerPage} />
                )
              ) : !users ? (
                <div className="h-auto w-full flex flex-col justify-center items-center">
                  <FaUserAltSlash className="text-9xl text-custom-dark-blue dark:text-custom-light-gray mt-24" />
                  <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
                    {t("noUsersFound")}
                  </p>
                </div>
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

              {/* Pagination */}
              {filteredUsers.length > usersPerPage && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {(isMobile || isTablet) && isSidebarOpen && (
          <UsersSidebar
            filters={filters}
            onFilterChange={setFilters}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <AddUserForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-20 right-4 md:right-10 px-4 py-3 bg-custom-yellow text-custom-dark-blue rounded-full justify-center transition-colors duration-300 button-shadow flex items-center z-40"
        >
          {!isMobile ? (
            <>
              <PlusIcon className="w-5 h-5 mt-1 mr-2" />
              <span className="font-semibold">{t("addUser")}</span>
            </>
          ) : (
            <PlusIcon className="w-4 h-6" />
          )}
        </button>

        <BottomNavbar userId={currentUser?.id} userClass={currentUser?.clase} />
      </div>
    </>
  );
};

export default UsersTab;
