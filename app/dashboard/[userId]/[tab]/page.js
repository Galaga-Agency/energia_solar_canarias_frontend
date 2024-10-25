"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import PlantsTab from "@/components/PlantsTab";
import NotificationsTab from "@/components/NotificationsTab";
import SettingsTab from "@/components/SettingsTab";
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import useLocalStorageState from "use-local-storage-state";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { selectUser } from "@/store/slices/userSlice";
import {
  fetchPlants,
  selectLoading,
  selectPlants,
} from "@/store/slices/plantsSlice";

const DashboardPage = ({ params }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId, tab } = params;
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  useEffect(() => {
    const initializeDashboard = async () => {
      if (user && user.id === userId) {
        setLoadingPlants(true);
        try {
          await dispatch(fetchPlants(userId));
        } catch (error) {
          console.error("Failed to fetch plants:", error);
        } finally {
          setLoadingPlants(false);
          setIsInitialLoad(false);
        }
      } else {
        router.push("/");
      }
    };

    if (isInitialLoad) {
      initializeDashboard();
    }
  }, [user, userId, dispatch, router, isInitialLoad]);

  if (loadingPlants || (isInitialLoad && plants.length === 0)) {
    return <Loading />;
  }

  const renderTabContent = () => {
    switch (tab) {
      case "plants":
        return <PlantsTab />;
      case "notifications":
        return <NotificationsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <PlantsTab />;
    }
  };

  return (
    <div
      className={`min-h-screen w-auto flex flex-col ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
      } relative overflow-y-auto`}
    >
      <TransitionEffect />
      <div className="flex-grow">
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
        {renderTabContent()}
      </div>
      <BottomNavbar userId={userId} />
    </div>
  );
};

export default DashboardPage;
