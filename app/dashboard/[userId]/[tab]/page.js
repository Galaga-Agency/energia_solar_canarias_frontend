"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import PlantsTab from "@/components/PlantsTab";
import NotificationsTab from "@/components/NotificationsTab";
import SettingsTab from "@/components/SettingsTab";
import ClientsTab from "@/components/ClientsTab"; // Only for Admin
import BottomNavbar from "@/components/BottomNavbar";
import TransitionEffect from "@/components/TransitionEffect";
import LanguageSelector from "@/components/LanguageSelector";
import { selectUser, selectIsAdmin } from "@/store/slices/userSlice"; // Added selectIsAdmin
import {
  fetchPlants,
  selectLoading,
  selectPlants,
} from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";
import ThemeToggle from "@/components/ThemeToggle";

const DashboardPage = ({ params }) => {
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin); // Get admin status
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId, tab } = params;
  const loading = useSelector(selectLoading);
  const plants = useSelector(selectPlants);
  const theme = useSelector(selectTheme);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (user?.id) {
        await dispatch(fetchPlants(userId));
        setIsInitialLoad(false);
      } else {
        router.push("/");
      }
    };

    if (isInitialLoad) {
      initializeDashboard();
    }
  }, [user, userId, dispatch, router, isInitialLoad]);

  if (isInitialLoad && (loading || plants.length === 0)) {
    return <Loading theme={theme} />;
  }

  const renderTabContent = () => {
    switch (tab) {
      case "plants":
        return <PlantsTab />;
      case "notifications":
        return !isAdmin ? <NotificationsTab /> : null;
      case "clients":
        return isAdmin ? <ClientsTab /> : null;
      case "settings":
        return <SettingsTab />;
      default:
        return <PlantsTab />;
    }
  };

  return (
    <div
      className={`min-h-screen w-auto flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto p-8`}
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
      <BottomNavbar userId={userId} userClass={user.clase} />
    </div>
  );
};

export default DashboardPage;
