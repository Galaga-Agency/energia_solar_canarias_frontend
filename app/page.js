"use client";

import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie && !hasNavigated) {
      try {
        const user = JSON.parse(userCookie);
        if (user && user.id && user.clase === "cliente") {
          dispatch(setUser(user));
          setHasNavigated(true); // Prevent further navigation
          router.push(`/dashboard/${user.id}/plants`);
        } else {
          console.warn("User cookie data is invalid:", user);
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    } else {
      console.log("No user cookie found.");
    }
  }, [dispatch, router, hasNavigated]);

  return (
    <div className="h-screen w-screen bg-white dark:bg-custom-dark-blue overflow-hidden relative">
      <div className="fixed top-4 right-4 z-50 hidden md:block">
        <InstallationGuide />
      </div>
      <div className="absolute top-4 md:top-16 right-4 z-50 flex flex-col items-end gap-2">
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
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <InstallationGuide />
      </div>
    </div>
  );
}
