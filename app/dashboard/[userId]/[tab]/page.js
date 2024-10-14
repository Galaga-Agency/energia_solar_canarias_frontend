"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import PlantsTab from "@/components/PlantsTab";
import WifiTab from "@/components/WifiTab";
import MessageTab from "@/components/MessageTab";
import DiscoveryTab from "@/components/DiscoveryTab";
import ProfileTab from "@/components/ProfileTab";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import useLocalStorageState from "use-local-storage-state";
import { selectUser } from "@/store/slices/userSlice";

const DashboardPage = ({ params }) => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const { userId, tab } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  useEffect(() => {
    if (!user || user.id !== userId) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [user, userId, router]);

  const renderTabContent = () => {
    switch (tab) {
      case "plants":
        return <PlantsTab />;
      case "wifi":
        return <WifiTab />;
      case "message":
        return <MessageTab />;
      case "discovery":
        return <DiscoveryTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <PlantsTab />;
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : user && user.id === userId ? (
        <div
          className={`min-h-screen w-screen flex flex-col ${
            theme === "dark"
              ? "bg-gray-900"
              : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
          } relative overflow-auto`}
        >
          <TransitionEffect />
          <div className="flex-grow">
            <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
              <div className="flex flex-col items-end">
                <ThemeToggle />
              </div>
              <div className="flex flex-col items-end">
                <LanguageSelector />
              </div>
            </div>
            {renderTabContent()}
          </div>
          <BottomNavbar userId={userId} />
        </div>
      ) : null}
    </>
  );
};

export default DashboardPage;
