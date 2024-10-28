"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logoutUser } from "@/store/slices/userSlice";
import { useTranslation } from "next-i18next";
import ProfileOverviewCard from "./ProfileOverviewCard";
import PasswordChangeCard from "./PasswordChangeCard";
import ApiKeyRequestCard from "./ApiKeyRequestCard";
import MetricsConfigCard from "./MetricsConfigCard";
import CompanyDocumentsCard from "./CompanyDocumentsCard";
import NotificationsCard from "./NotificationsCard";
import axios from "axios";
import Cookies from "js-cookie";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter, usePathname } from "next/navigation";
import Texture from "./Texture";
import ConfirmationModal from "./ConfirmationModal";
import useDeviceType from "@/hooks/useDeviceType";

const SettingsTab = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const avatarPlaceholder = "/assets/img/avatar.webp";
  const { t } = useTranslation();
  const [profilePic, setProfilePic] = useState(
    user?.imagen || avatarPlaceholder
  );
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTablet } = useDeviceType();
  const notificationsRef = useRef(null);
  const pathname = usePathname();
  const [shouldFlashAndScroll, setShouldFlashAndScroll] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/delete-account/${user?.id}`);
      dispatch(logoutUser());
      Cookies.remove("user");
      router.push("/");
      alert(t("accountDeleted"));
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(t("errorDeletingAccount"));
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
      pathname === `/dashboard/${user.id}/settings` &&
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

  return (
    <>
      <Texture />
      <div className={`relative h-auto `}>
        {/* Profile Header */}
        <div className="relative z-10 flex items-start md:items-end mb-10">
          <Image
            src={companyIcon}
            alt="Company Icon"
            className="w-16 h-16 drop-shadow-md"
          />
          <div className="flex flex-wrap">
            <h2 className="text-5xl font-extrabold text-custom-dark-blue dark:text-custom-yellow ml-4 leading-tight">
              {`${t("welcome")},`}
            </h2>
            <span className="font-secondary ml-4 md:ml-2 -mt-[2px] text-5xl font-thin text-custom-dark-blue dark:text-custom-yellow">
              {user?.nombre || t("profile")}
            </span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="w-full space-y-6 transition-all duration-500 grid grid-cols-1 md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-6">
            <ProfileOverviewCard
              user={user}
              profilePic={profilePic}
              setProfilePic={setProfilePic}
              onUpdateProfile={(data) =>
                console.log("Profile updated with data:", data)
              }
            />
            <MetricsConfigCard />
          </div>

          <div className="flex flex-col gap-6">
            <PasswordChangeCard
              onChangePassword={(password) =>
                console.log("Password changed:", password)
              }
            />
            <ApiKeyRequestCard
              onRequestApiKey={() => console.log("API key requested")}
            />
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
    </>
  );
};

export default SettingsTab;
