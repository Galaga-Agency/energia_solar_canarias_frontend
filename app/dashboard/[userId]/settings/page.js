"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  logoutUser,
  selectLoading,
  fetchUserById,
} from "@/store/slices/userSlice";
import { useTranslation } from "next-i18next";
import ProfileOverviewCard from "@/components/ProfileOverviewCard";
import PasswordChangeCard from "@/components/PasswordChangeCard";
import ApiKeyRequestCard from "@/components/ApiKeyRequestCard";
import CompanyDocumentsCard from "@/components/CompanyDocumentsCard";
import axios from "axios";
import Cookies from "js-cookie";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter, usePathname } from "next/navigation";
import Texture from "@/components/Texture";
import ConfirmationModal from "@/components/ConfirmationModal";
import useDeviceType from "@/hooks/useDeviceType";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { toast } from "sonner";
import { FaUserTie } from "react-icons/fa";
import DangerZone from "@/components/DangerZone";
import { motion } from "framer-motion";

const SettingsTab = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const avatarPlaceholder = "/assets/img/avatar.webp";
  const { t } = useTranslation();
  const [profilePic, setProfilePic] = useState(avatarPlaceholder);
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTablet } = useDeviceType();
  const pathname = usePathname();
  const isLoading = useSelector(selectLoading);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch fresh user data when component mounts or token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.tokenIdentificador) {
        try {
          await dispatch(
            fetchUserById({
              token: user.tokenIdentificador,
            })
          ).unwrap();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast.error(t("failedToFetchUserData"));
        }
      }
    };

    fetchUserData();
  }, [dispatch, user?.tokenIdentificador, t]);

  // Update profile pic when user data changes
  useEffect(() => {
    setProfilePic(user?.imagen);
  }, [user?.imagen]);

  // Handle user profile updates
  const handleUserUpdate = async () => {
    try {
      await dispatch(
        fetchUserById({
          token: user.tokenIdentificador,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to fetch updated user data:", error);
      toast.error(t("failedToFetchUserData"));
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/delete-account/${user?.id}`);
      dispatch(logoutUser());
      Cookies.remove("user");
      router.push("/");
      toast.success(t("accountDeletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(t("failedToDeleteAccount"));
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    Cookies.remove("user");
    router.push("/");
  };

  // Profile picture update handler
  const handleProfilePicUpdate = (newImageUrl) => {
    setProfilePic(newImageUrl);
    handleUserUpdate();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar">
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
        className="relative h-auto z-10 p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {/* Profile Header */}
        <motion.div
          className="relative z-10 flex items-center md:items-end mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-12 h-12 mr-2 z-10 mb-1 transition-transform duration-300 hover:scale-110"
          />
          <div className="flex flex-wrap items-center">
            <h2 className="text-4xl font-extrabold text-custom-dark-blue dark:text-custom-yellow leading-tight">
              {`${t("welcome")},`}
            </h2>
            <div className="flex items-center gap-4">
              <span className="font-secondary md:ml-2 mb-3 text-4xl font-thin text-custom-dark-blue dark:text-custom-yellow">
                {user?.nombre}
              </span>
              {user?.clase === "admin" && (
                <div className="bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue px-3 py-0.5 rounded-full text-sm flex items-center gap-1 hover:scale-105 transition-transform duration-200">
                  <FaUserTie className="w-3 h-3" />
                  {t("admin")}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Settings Content */}
        <div className="w-full space-y-6 transition-all duration-500 flex flex-col max-w-full lg:max-w-[70vw] 2xl:max-w-[60vw] mx-auto mb-16">
          {/* Profile Section */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <ProfileOverviewCard
              user={user}
              profilePic={profilePic}
              setProfilePic={handleProfilePicUpdate}
              isSaving={isSaving}
              onProfileUpdate={handleUserUpdate}
            />
            <PasswordChangeCard />
          </motion.div>

          {/* API Key Section */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            <ApiKeyRequestCard />
          </motion.div>

          {/* Company Documents Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            <CompanyDocumentsCard />
          </motion.div>

          {/* Account Actions Section */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
                {t("accountActions")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t("logoutDescription")}
              </p>
              <motion.button
                onClick={handleLogout}
                className="w-full bg-gray-800 text-white hover:bg-gray-900 py-2.5 px-4 rounded-lg transition-all duration-200 mb-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("logout")}
              </motion.button>

              <DangerZone onDelete={() => setIsModalOpen(true)} t={t} />
            </div>
          </motion.div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleDeleteAccount();
            setIsModalOpen(false);
          }}
          title={t("confirmDeletion")}
          message={t("areYouSureDeleteAccount")}
        />
      </motion.div>

      <BottomNavbar userId={user?.usuario_id} userClass={user?.clase} />
    </div>
  );
};

export default SettingsTab;
