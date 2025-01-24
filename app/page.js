"use client";

import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  selectIsLoggedIn,
  selectTokenValidated,
} from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { storage } from "@/utils/storage";
import PWAInstallDiagnostic from "@/components/PWAInstallDiagnostic";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const tokenValidated = useSelector(selectTokenValidated);
  const userData = useSelector((state) => state.user?.user);
  const redirectAttempted = useRef(false);

  useEffect(() => {
    const handleInitialRedirect = async () => {
      if (redirectAttempted.current) return;

      const storedUser = storage.getItem("user");
      const storedToken = storage.getItem("authToken");

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          if (user?.id && user?.tokenIdentificador) {
            await dispatch(setUser(user));
          } else {
            console.warn("Invalid user data in storage");
            storage.removeItem("user");
            storage.removeItem("authToken");
          }
        } catch (error) {
          console.error("Error handling redirect:", error);
          storage.removeItem("user");
          storage.removeItem("authToken");
        }
      }
    };

    handleInitialRedirect();
  }, [dispatch]);

  // Simplified user redirect effect
  useEffect(() => {
    const handleUserRedirect = () => {
      if (userData && !redirectAttempted.current) {
        console.log("User data loaded:", userData);
        redirectAttempted.current = true;

        userData?.clase === "admin"
          ? router.push(`/dashboard/${userData.id}/admin`)
          : router.push(`/dashboard/${userData.id}/plants`);
      }
    };

    handleUserRedirect();
  }, [userData, router]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex flex-col items-end">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-end">
          <LanguageSelector />
        </div>
      </div>
      <div className="flex justify-center items-center h-full">
        <LogoAnimation />
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <InstallationGuide debug={true} />
      </div>
    </div>
  );
}
