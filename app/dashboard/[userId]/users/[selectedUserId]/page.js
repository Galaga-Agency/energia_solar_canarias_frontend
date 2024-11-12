"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  fetchUserById,
  updateUserClase,
  deactivateUser,
  deleteUser,
  selectUserById,
  selectUsersLoading,
  selectUsersError,
} from "@/store/slices/usersListSlice";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import ConfirmationModal from "@/components/ConfirmationModal";
import AssignPlantUser from "@/components/AssignPlantUser";
import Image from "next/image";
import { useParams } from "next/navigation";
import { selectPlants } from "@/store/slices/plantsSlice";
import TransitionEffect from "@/components/TransitionEffect";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import Texture from "@/components/Texture";
import { selectTheme } from "@/store/slices/themeSlice";
import PageTransition from "@/components/PageTransition";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaUserSlash } from "react-icons/fa";
import { selectUser } from "@/store/slices/userSlice";

const SelectedUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedUserId } = useParams();
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignPlantModalOpen, setIsAssignPlantModalOpen] = useState(false);
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);
  const [selectedClase, setSelectedClase] = useState("");
  const [pendingClase, setPendingClase] = useState("");
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const user = useSelector((state) => selectUserById(state, selectedUserId));
  const loggedinUser = useSelector(selectUser);

  useEffect(() => {
    if (!user) {
      dispatch(
        fetchUserById({
          userId: selectedUserId,
          token: loggedinUser?.tokenIdentificador,
        })
      );
    }
  }, [dispatch, selectedUserId, user]);

  useEffect(() => {
    if (user) {
      setSelectedClase(user.clase || "");
    }
  }, [user]);

  const handleClaseChange = (e) => {
    const newClase = e.target.value;
    setPendingClase(newClase);
    setIsRoleChangeModalOpen(true); // Show confirmation modal
  };

  const confirmRoleChange = () => {
    setSelectedClase(pendingClase);
    dispatch(updateUserClase({ userId: selectedUserId, clase: pendingClase }));
    setIsRoleChangeModalOpen(false);
  };

  const handleDeactivateUser = () => dispatch(deactivateUser(selectedUserId));

  const handleDeleteUser = () => {
    dispatch(deleteUser(selectedUserId));
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <PageTransition>
        <div
          className={`min-h-screen h-auto flex flex-col p-6 ${
            theme === "dark"
              ? "dark:bg-gray-900"
              : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
          }`}
        >
          <Texture />
          <div className="flex justify-between items-center mb-6 gap-6">
            <button onClick={() => window.history.back()}>
              <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
            </button>
            <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-24 gap-6 text-center">
            <FaUserSlash className="text-6xl text-custom-dark-blue dark:text-custom-yellow" />
            <h2 className="text-4xl text-custom-dark-blue dark:text-custom-yellow">
              {t("noUserData")}
            </h2>
            <p className="text-xl text-custom-dark-blue dark:text-custom-yellow">
              {t("reloadPageMessage")}
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div
        className={`min-h-screen h-auto flex flex-col p-8 ${
          theme === "dark"
            ? "dark:bg-gray-900"
            : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
        }`}
      >
        <Texture />
        <div className="space-y-6">
          <div className="flex items-start">
            <button onClick={() => window.history.back()}>
              <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow" />
            </button>
            <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-200 text-right ml-auto">
              {t("userDetails")}
            </h2>
          </div>
          <div className="space-y-4">
            <Image
              src={user?.imagen || "/assets/img/avatar.webp"}
              alt="User Profile"
              width={150}
              height={150}
              className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow shadow-lg"
            />
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              {[
                { label: t("name"), value: user?.nombre },
                { label: t("surname"), value: user?.apellido },
                { label: t("email"), value: user?.email },
                { label: t("mobile"), value: user?.movil },
                { label: t("company"), value: user?.company },
                { label: t("address"), value: user?.address },
                { label: t("city"), value: user?.city },
                { label: t("postcode"), value: user?.postcode },
                { label: t("regionState"), value: user?.region },
                { label: t("country"), value: user?.country },
                { label: t("cifNif"), value: user?.cifNif },
              ].map(({ label, value }, index) => (
                <p key={index} className="flex justify-between">
                  <span>{label}:</span>
                  <span className="text-custom-dark-blue dark:text-custom-yellow">
                    {value}
                  </span>
                </p>
              ))}
              <div className="flex items-center justify-between">
                <span>{t("userStatus")}:</span>
                <select
                  value={selectedClase}
                  onChange={handleClaseChange}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
                >
                  <option value="admin">{t("admin")}</option>
                  <option value="cliente">{t("cliente")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-4">
            <PrimaryButton onClick={() => setIsAssignPlantModalOpen(true)}>
              {t("assignPlant")}
            </PrimaryButton>
            <button
              className="glow-on-hover text-red-500 dark:text-red-400 hover:opacity-80 transition-opacity font-secondary text-lg"
              onClick={handleDeactivateUser}
            >
              {t("deactivateUser")}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white hover:opacity-80 transition-opacity py-2 rounded text-lg font-semibold"
            >
              {t("deleteUser")}
            </button>
          </div>

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDeleteUser}
            title={t("confirmDeletion")}
            message={t("areYouSureDeleteUser")}
          />

          <ConfirmationModal
            isOpen={isRoleChangeModalOpen}
            onClose={() => setIsRoleChangeModalOpen(false)}
            onConfirm={confirmRoleChange}
            title={t("confirmRoleChange")}
            message={`${t("areYouSureChangeRole")} ${
              pendingClase === "admin" ? t("admin") : t("client")
            }?`}
          />

          <AssignPlantUser
            isOpen={isAssignPlantModalOpen}
            onClose={() => setIsAssignPlantModalOpen(false)}
            userId={selectedUserId}
            plants={plants}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default SelectedUser;
