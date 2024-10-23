import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logoutUser } from "@/store/slices/userSlice";
import { useTranslation } from "next-i18next";
import ProfileOverviewCard from "./ProfileOverviewCard";
import PasswordChangeCard from "./PasswordChangeCard";
import ApiKeyRequestCard from "./ApiKeyRequestCard";
import UsageStatsCard from "./UsageStatsCard";
import CompanyDocumentsCard from "./CompanyDocumentsCard";
import axios from "axios";
import Cookies from "js-cookie";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/navigation";

const ProfileTab = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const avatarPlaceholder = "/assets/img/avatar.webp";
  const { t } = useTranslation();
  const [profilePic, setProfilePic] = useState(
    user?.imagen || avatarPlaceholder
  );
  const [apiKeyRequested, setApiKeyRequested] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });
  const router = useRouter();

  const handleRequestApiKey = async () => {
    try {
      await axios.post("/api/request-api-key");
      setApiKeyRequested(true);
      alert(t("apiKeyRequestedSuccess"));
    } catch (error) {
      console.error("Error requesting API key:", error);
    }
  };

  const handlePasswordChange = async (password) => {
    try {
      await axios.put("/api/change-password", { password });
      alert(t("passwordChangeSuccess"));
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const onUpdateProfile = (data) => {
    console.log("Profile updated with data:", data);
  };

  const usageData = {
    labels: ["Panel 1", "Panel 2", "Panel 3"],
    datasets: [
      {
        label: t("energyProduced"),
        data: [65, 59, 80],
        backgroundColor:
          theme === "dark"
            ? "rgba(255, 213, 122, 0.6)"
            : "rgba(0, 44, 63, 0.6)",
        borderColor: theme === "dark" ? "rgb(255, 213, 122)" : "rgb(0, 44, 63)",
      },
    ],
  };

  return (
    <div className="relative p-8 md:p-10 h-screen pb-24">
      <div className="flex items-center mb-10 z-10">
        <Image
          src={companyIcon}
          alt="Company Icon"
          className="w-12 h-12 mr-4"
        />
        <h2 className="text-4xl font-bold dark:text-custom-yellow text-custom-dark-blue">
          {t("profile")}
        </h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileOverviewCard
          user={user}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          onEdit={() => setIsFlipped(true)}
          onUpdateProfile={onUpdateProfile}
        />
        <PasswordChangeCard onChangePassword={handlePasswordChange} />
        <ApiKeyRequestCard onRequestApiKey={handleRequestApiKey} />
        <UsageStatsCard usageData={usageData} theme={theme} />
        <CompanyDocumentsCard />
      </div>

      {/* Logout Button */}
      <div className="text-center pt-6 pb-24">
        <button
          onClick={() => {
            dispatch(logoutUser());
            Cookies.remove("user");
            router.push("/");
          }}
          className="text-red-500 dark:text-red-400 hover:opacity-80 transition-opacity font-secondary text-lg"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
