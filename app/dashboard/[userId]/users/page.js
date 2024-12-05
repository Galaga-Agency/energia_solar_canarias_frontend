"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { IoArrowBackCircle, IoTrashOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";
import Pagination from "@/components/ui/Pagination";
import Texture from "@/components/Texture";
import SortUserMenu from "@/components/SortUserMenu";
import UserFilterInput from "@/components/UserFilterInput";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import UserListSkeleton from "@/components/loadingSkeletons/UserListSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import useUserFilter from "@/hooks/useUserFilter";
import useDeviceType from "@/hooks/useDeviceType";
import {
  fetchUsers,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
} from "@/store/slices/usersListSlice";
import { selectUser } from "@/store/slices/userSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import { FaUserAltSlash } from "react-icons/fa";

const UsersTab = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const currentUser = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Set a fixed number for pagination
  const { isMobile, isDesktop } = useDeviceType();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchUsers(currentUser.tokenIdentificador));
    }
  }, [dispatch, currentUser]);

  const { filteredUsers, filterUsers } = useUserFilter(users);

  const sortUsers = (criteria) => {
    let sorted = [...filteredUsers];
    switch (criteria) {
      case "alphabetical":
        sorted.sort((a, b) => a.usuario_nombre.localeCompare(b.usuario_nombre));
        break;
      case "registrationDate":
        sorted.sort(
          (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers?.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const handleUserClick = (selectedUserId) => {
    router.push(`/dashboard/${currentUser.id}/users/${selectedUserId}`);
  };

  const toPascalCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleRefresh = () => {
    setShowError(false);
    dispatch(fetchUsers(currentUser.tokenIdentificador));
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Error state handling
  const renderError = () => (
    <div className="min-h-screen p-6 w-auto">
      <div className="h-auto w-full flex flex-col justify-center items-center">
        <FaUserAltSlash className="text-9xl text-custom-dark-blue dark:text-custom-light-gray mt-24" />
        <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
          {t("noUsersFound")}
        </p>
      </div>
    </div>
  );

  // Loading state handling
  const renderLoading = () => (
    <div className="h-full w-full flex justify-center items-center">
      <UserListSkeleton theme={theme} rows={usersPerPage} />
    </div>
  );

  // Users list or no users found
  const renderUsers = () => {
    if (!paginatedUsers?.length) {
      return (
        <div className="h-full w-full flex justify-center items-center">
          <FaUserAltSlash />
          <p className="text-lg text-custom-dark-blue dark:text-custom-yellow mt-24">
            {t("noUsersFound")}
          </p>
        </div>
      );
    }

    return (
      <div className="my-12 overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800 shadow-md mb-12">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300">
              <th className="py-3 px-4 lg:pl-12 lg:pr-4 text-left text-custom-dark-blue dark:text-custom-yellow">
                {t("userName")}
              </th>
              {isDesktop && <th></th>}
              {!isMobile && (
                <th className="py-3 px-4 lg:pr-12 lg:pl-4 text-left text-custom-dark-blue dark:text-custom-yellow">
                  {t("userEmail")}
                </th>
              )}
              {isDesktop && (
                <th className="py-3 px-8 text-left text-custom-dark-blue dark:text-custom-yellow">
                  {t("lastLogin")}
                </th>
              )}
              <th className="py-3 px-6 text-right text-custom-dark-blue dark:text-custom-yellow"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((userItem) => (
              <tr
                key={userItem.usuario_id}
                className="hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 border-b border-gray-300 cursor-pointer"
                onClick={() => handleUserClick(userItem.usuario_id)}
              >
                <td className="py-3 px-4 lg:pl-12 lg:pr-2 text-lg text-custom-dark-blue dark:text-custom-yellow flex items-center gap-4 mr-4">
                  <Image
                    src={userItem.imagen || "/assets/default-profile.png"}
                    alt={`${userItem.usuario_nombre}'s profile`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {toPascalCase(userItem.usuario_nombre)}{" "}
                  {toPascalCase(userItem.apellido)}
                </td>
                {isDesktop && (
                  <td className="text-left">
                    {userItem.clase === "admin" ? (
                      <span className="bg-custom-dark-blue dark:bg-custom-yellow text-custom-light-gray dark:text-custom-dark-blue mx-6 px-2 py-1 rounded-3xl text-sm font-bold">
                        admin
                      </span>
                    ) : null}
                  </td>
                )}
                {!isMobile && (
                  <td className="py-3 px-4 text-lg text-custom-dark-blue dark:text-custom-yellow overflow-hidden whitespace-nowrap text-ellipsis">
                    {userItem.email}
                  </td>
                )}
                {isDesktop && (
                  <td className="py-3 px-8 text-lg text-custom-dark-blue dark:text-custom-yellow">
                    {isNaN(new Date(userItem.lastLogin)) ? (
                      <span className="ml-10">/</span>
                    ) : (
                      new Date(userItem.lastLogin).toLocaleDateString()
                    )}
                  </td>
                )}
                <td className="relative py-3 px-4 text-center text-2xl text-custom-dark-blue dark:text-custom-yellow flex items-center justify-center gap-4">
                  <AiOutlineEdit className=" absolute cursor-pointer hover:text-blue-500 -translate-y-[40%] right-12 lg:right-24" />
                  <IoTrashOutline className="absolute cursor-pointer hover:text-red-500 -translate-y-[40%] right-4 lg:right-12" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-4"
          />
        )}
      </div>
    );
  };

  return (
    <>
      <TransitionEffect />
      <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto p-8">
        <Texture />

        <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
          <ThemeToggle />
          <LanguageSelector />
        </div>

        <div className="flex items-center mb-10 md:mb-2 z-10">
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-12 h-12 mr-2 z-10"
          />
          <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue">
            {t("usersList")}
          </h2>
        </div>

        <UserFilterInput onFilterChange={filterUsers} />
        <SortUserMenu onSortChange={sortUsers} />

        {isLoading
          ? renderLoading()
          : showError
          ? renderError()
          : renderUsers()}
      </div>
      <BottomNavbar
        userId={currentUser && currentUser.id}
        userClass={currentUser && currentUser.clase}
      />
    </>
  );
};

export default UsersTab;
