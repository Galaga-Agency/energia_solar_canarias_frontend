"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { selectUser } from "@/store/slices/userSlice";
import Loading from "@/components/Loading";
import PlantsTab from "@/components/PlantsTab";
import WifiTab from "@/components/WifiTab";
import MessageTab from "@/components/MessageTab";
import DiscoveryTab from "@/components/DiscoveryTab";
import ProfileTab from "@/components/ProfileTab";
import BottomNavbar from "@/components/BottomNavbar";

const DashboardPage = ({ params }) => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const { userId, tab } = params;
  const [isLoading, setIsLoading] = useState(true);

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
        <div className="h-screen w-screen flex flex-col bg-gray-900 relative overflow-hidden">
          <div className="flex-grow">{renderTabContent()}</div>
          <BottomNavbar userId={userId} />
        </div>
      ) : null}
    </>
  );
};

export default DashboardPage;
