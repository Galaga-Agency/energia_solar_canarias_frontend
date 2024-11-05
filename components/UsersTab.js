"use client";

import React, { useEffect, useState } from "react";
import { fetchUsersAPI } from "@/services/api";
import Loading from "@/components/Loading";
import { useTranslation } from "next-i18next";
import Pagination from "@/components/Pagination";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import Texture from "./Texture";
import SortUserMenu from "@/components/SortUserMenu";
import UserFilterInput from "@/components/UserFilterInput";
import useUserFilter from "@/hooks/useUserFilter";
import useDeviceType from "@/hooks/useDeviceType";

const UsersTab = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const { isMobile } = useDeviceType();

  useEffect(() => {
    const fetchUsers = async () => {
      const userToken = user.tokenIdentificador;
      try {
        const usersData = await fetchUsersAPI(userToken);
        setUsers(usersData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const { filteredUsers, filterUsers } = useUserFilter(users);

  const sortUsers = (criteria) => {
    let sorted = [...filteredUsers];
    switch (criteria) {
      case "alphabetical":
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Error fetching users: {error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  return (
    <>
      <Texture />
      <div className="relative h-auto p-8">
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

        {paginatedUsers.length > 0 ? (
          <div className="my-12 overflow-hidden">
            <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800 shadow-md mb-12">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300">
                  <th className="py-3 px-4 text-left text-custom-dark-blue dark:text-custom-yellow">
                    {t("userName")}
                  </th>
                  <th className="py-3 px-4 text-left text-custom-dark-blue dark:text-custom-yellow">
                    {t("userEmail")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200 border-b border-gray-300"
                  >
                    <td className="py-3 px-4 text-lg text-custom-dark-blue dark:text-custom-yellow border-b border-gray-300">
                      {user.nombre}
                    </td>
                    <td className="py-3 px-4 text-lg text-custom-dark-blue dark:text-custom-yellow border-b border-gray-300 overflow-hidden whitespace-nowrap text-ellipsis">
                      {isMobile && user.email.length > 15
                        ? `${user.email.substring(0, 15)}...`
                        : user.email}
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
        ) : (
          <p className="text-lg">{t("noUsersFound")}</p>
        )}
      </div>
    </>
  );
};

export default UsersTab;
