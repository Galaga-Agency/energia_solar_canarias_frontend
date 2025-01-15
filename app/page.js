"use client";

import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  selectIsLoggedIn,
  selectTokenValidated,
} from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { storage } from "@/utils/storage";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const tokenValidated = useSelector(selectTokenValidated);
  const redirectAttempted = useRef(false);

  useEffect(() => {
    const handleInitialRedirect = async () => {
      // console.log("Checking for redirect...");
      // console.log("isLoggedIn:", isLoggedIn);
      // console.log("tokenValidated:", tokenValidated);

      if (redirectAttempted.current) {
        // console.log("Redirect already attempted");
        return;
      }

      const storedUser = storage.getItem("user");
      const storedToken = storage.getItem("authToken");

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          // console.log("Parsed user:", user);

          if (user?.id && user?.tokenIdentificador) {
            // console.log("Valid user data found, redirecting...");
            dispatch(setUser(user));
            redirectAttempted.current = true;
            user?.clase === "admin"
              ? router.push(`/dashboard/${user.id}/admin`)
              : router.push(`/dashboard/${user.id}/plants`);
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
  }, [dispatch, router, isLoggedIn, tokenValidated]);

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
        <InstallationGuide />
      </div>
    </div>
  );
}
