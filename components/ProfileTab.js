"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logoutUser } from "@/store/slices/userSlice";
import { useTranslation } from "next-i18next";
import ProfileOverviewCard from "./ProfileOverviewCard";
import PasswordChangeCard from "./PasswordChangeCard";
import ApiKeyRequestCard from "./ApiKeyRequestCard";
import UsageStatsCard from "./UsageStatsCard";
import CompanyDocumentsCard from "./CompanyDocumentsCard";
import NotificationsCard from "./NotificationsCard";
import axios from "axios";
import Cookies from "js-cookie";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/navigation";
import Texture from "./Texture";
import ConfirmationModal from "./ConfirmationModal";

const ProfileTab = () => {
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

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/delete-account/${user.id}`);
      dispatch(logoutUser());
      Cookies.remove("user");
      router.push("/");
      alert(t("accountDeleted"));
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(t("errorDeletingAccount"));
    }
  };

  return (
    <div
      className={`relative w-screen p-8 md:p-10 h-auto pb-24 ${
        theme === "dark" ? "bg-dark-mode-bg" : "bg-light-mode-bg"
      }`}
    >
      <Texture />
      {/* Profile Header */}
      <div className="relative z-10 flex items-start md:items-center mb-10">
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
      <div className="w-full space-y-6 transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileOverviewCard
            user={user}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
            onUpdateProfile={(data) =>
              console.log("Profile updated with data:", data)
            }
          />
          <div className="flex flex-col gap-6">
            <PasswordChangeCard
              onChangePassword={(password) =>
                console.log("Password changed:", password)
              }
            />
            <ApiKeyRequestCard
              onRequestApiKey={() => console.log("API key requested")}
            />
            <NotificationsCard />
            <UsageStatsCard
              usageData={{
                labels: ["Panel 1", "Panel 2", "Panel 3"],
                datasets: [
                  {
                    label: t("energyProduced"),
                    data: [65, 59, 80],
                    backgroundColor:
                      theme === "dark"
                        ? "rgba(255, 213, 122, 0.6)"
                        : "rgba(0, 44, 63, 0.6)",
                    borderColor:
                      theme === "dark"
                        ? "rgb(255, 213, 122)"
                        : "rgb(0, 44, 63)",
                  },
                ],
              }}
              theme={theme}
            />
            <CompanyDocumentsCard />
          </div>
        </div>
      </div>

      {/* Logout and Delete Account Buttons */}
      <div className="pt-6 flex flex-col gap-4 justify-between mb-12">
        <button
          onClick={() => {
            dispatch(logoutUser());
            Cookies.remove("user");
            router.push("/");
          }}
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
  );
};

export default ProfileTab;
