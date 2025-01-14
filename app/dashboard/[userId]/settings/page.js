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
import MetricsConfigCard from "@/components/MetricsConfigCard";
import CompanyDocumentsCard from "@/components/CompanyDocumentsCard";
import NotificationsCard from "@/components/NotificationsCard";
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
  const notificationsRef = useRef(null);
  const pathname = usePathname();
  const [shouldFlashAndScroll, setShouldFlashAndScroll] = useState(false);
  const isLoading = useSelector(selectLoading);
  const [isSaving, setIsSaving] = useState(false);

  console.log("user", user);

  // Fetch fresh user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id && user?.tokenIdentificador) {
        try {
          await dispatch(
            fetchUserById({
              userId: user.id,
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
  }, [dispatch, user?.id, user?.tokenIdentificador, t]);

  // Update profile pic when user data changes
  useEffect(() => {
    if (user?.imagen) {
      setProfilePic(user.imagen);
    } else {
      setProfilePic(avatarPlaceholder);
    }
  }, [user?.imagen]);

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

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#notifications") {
      setShouldFlashAndScroll(true);
    }
  }, []);

  useEffect(() => {
    if (
      user &&
      pathname === `/dashboard/${user.usuario_id}/settings` &&
      notificationsRef.current
    ) {
      if (shouldFlashAndScroll) {
        const rect = notificationsRef.current.getBoundingClientRect();
        const offset = 80;

        window.scrollTo({
          top: rect.top + window.scrollY - offset,
          behavior: "smooth",
        });

        const flashTimer = setTimeout(() => {
          notificationsRef.current.classList.add("animate-flash");

          const removeFlashTimer = setTimeout(() => {
            notificationsRef.current.classList.remove("animate-flash");
            setShouldFlashAndScroll(false);
          }, 1500);

          return () => clearTimeout(removeFlashTimer);
        }, 1000);

        return () => clearTimeout(flashTimer);
      }
    }
  }, [user, pathname, shouldFlashAndScroll]);

  const handleLogout = () => {
    dispatch(logoutUser());
    Cookies.remove("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar">
      <TransitionEffect />
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      <Texture />
      <div className="relative h-auto z-10 p-8">
        {/* Profile Header */}
        <div className="relative z-10 flex items-center md:items-end mb-10">
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-12 h-12 mr-2 z-10 mb-1"
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
                <div className="bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue px-3 py-0.5 rounded-full text-sm flex items-center gap-1">
                  <FaUserTie className="w-3 h-3" />
                  {t("admin")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="w-full space-y-6 transition-all duration-500 grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-6">
            <ProfileOverviewCard
              user={user}
              profilePic={profilePic}
              setProfilePic={setProfilePic}
              isSaving={isSaving}
            />
            {/* <MetricsConfigCard /> */}
          </div>

          <div className="flex flex-col gap-6">
            <PasswordChangeCard />
            <ApiKeyRequestCard />
            <div ref={notificationsRef} className="rounded-lg">
              <NotificationsCard />
            </div>
            {!isTablet && <CompanyDocumentsCard />}
          </div>
        </div>
        {isTablet && <CompanyDocumentsCard />}

        {/* Logout and Delete Account Buttons */}
        <div className="pt-6 flex flex-col gap-4 justify-between mb-16">
          <button
            onClick={handleLogout}
            className="glow-on-hover text-red-500 dark:text-red-400 hover:opacity-80 transition-opacity font-secondary text-lg"
          >
            {t("logout")}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white hover:opacity-80 transition-opacity py-2 rounded text-lg font-semibold"
          >
            {t("deleteAccount")}
          </button>
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
      </div>

      <BottomNavbar userId={user?.usuario_id} userClass={user?.clase} />
    </div>
  );
};

export default SettingsTab;
