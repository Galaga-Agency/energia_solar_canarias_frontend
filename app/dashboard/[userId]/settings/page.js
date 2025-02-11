"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  logoutUser,
  selectLoading,
  fetchUserById,
  logoutUserThunk,
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
import DeleteUserModal from "@/components/DeleteUserModal";
import { deleteUser } from "@/store/slices/usersListSlice";
import Loading from "@/components/ui/Loading";
import { persistor } from "@/store/store";
import { clearPlants } from "@/store/slices/plantsSlice";
import { clearNotifications } from "@/store/slices/notificationsSlice";

const SettingsTab = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const avatarPlaceholder = "/assets/img/avatar.webp";
  const { t } = useTranslation();
  const [profilePic, setProfilePic] = useState(avatarPlaceholder);
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTablet, isMobile } = useDeviceType();
  const pathname = usePathname();
  const isLoading = useSelector(selectLoading);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoginOut, setIsLoginOut] = useState(false);

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
      await dispatch(
        deleteUser({
          userId: user.usuario_id,
          token: user.tokenIdentificador,
        })
      ).unwrap();

      // After successful deletion
      dispatch(logoutUser());
      Cookies.remove("user");
      router.push("/");
      toast.success(t("accountDeletedSuccessfully"));
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(t("failedToDeleteAccount"));
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoginOut(true);

      // Execute logout thunk and get result
      const logoutResult = await dispatch(logoutUserThunk()).unwrap();

      // Handle persistence
      persistor.pause();
      await persistor.flush();
      await persistor.purge();

      // Clear cookies with proper options
      const cookieOptions = {
        path: "/",
        domain: window.location.hostname,
        secure: true,
        sameSite: "strict",
      };

      // Remove all auth-related cookies
      Cookies.remove("user", cookieOptions);
      Cookies.remove("authToken", cookieOptions);

      // Force clear localStorage
      localStorage.clear();

      // Ensure we redirect to login page and prevent back navigation
      router.push("/");
      router.refresh(); // Force refresh to clear any cached states
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t("logoutFailed"));
    } finally {
      setIsLoginOut(false);
    }
  };

  isLoginOut && <Loading theme={theme} />;

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
        <div className="w-full space-y-6 flex flex-col max-w-full lg:max-w-[70vw] 2xl:max-w-[60vw] mx-auto mb-16">
          {/* Two-Column Layout with Full Height */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left Column (Profile & Company Docs) */}
            <div className="flex flex-col gap-6 h-full flex-grow">
              <ProfileOverviewCard
                user={user}
                profilePic={profilePic}
                setProfilePic={setProfilePic}
              />

              {/* Company Documents - Fills Remaining Space */}
              <div className="bg-white/30 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm backdrop-blur-sm backdrop-filter  flex-grow">
                <h2 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-4">
                  {t("companyDocuments")}
                </h2>
                <CompanyDocumentsCard />
              </div>
            </div>

            {/* Right Column (API Key, Security, and Actions) */}
            <div className="flex flex-col gap-6 h-full flex-grow">
              <ApiKeyRequestCard />

              {/* Security Section  */}
              <div className="bg-white/30 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm backdrop-blur-sm backdrop-filter flex-grow">
                <PasswordChangeCard />
              </div>

              {/* Full-Width Logout & Danger Zone */}
              <div className="flex flex-col gap-6 justify-between mt-auto">
                <motion.button
                  onClick={handleLogout}
                  className="w-full md:w-auto bg-gray-800 text-white hover:bg-gray-900 py-2.5 px-4 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("logout")}
                </motion.button>
                <div className="w-full md:w-auto">
                  <DangerZone onDelete={() => setIsModalOpen(true)} t={t} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <DeleteUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleDeleteAccount();
            setIsModalOpen(false);
          }}
          t={t}
        />
      </motion.div>

      <BottomNavbar userId={user?.usuario_id} userClass={user?.clase} />
    </div>
  );
};

export default SettingsTab;
