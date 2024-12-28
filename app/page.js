"use client";

import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUser, selectIsLoggedIn } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const redirectAttempted = useRef(false);

  useEffect(() => {
    if (redirectAttempted.current) {
      return;
    }

    const userCookie = Cookies.get("user");
    if (userCookie && !isLoggedIn) {
      try {
        const user = JSON.parse(userCookie);
        if (user && user.id) {
          dispatch(setUser(user));
          redirectAttempted.current = true;
          router.push(`/dashboard/${user.id}/plants`);
        } else {
          console.warn("User cookie data is invalid:", user);
          Cookies.remove("user");
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        Cookies.remove("user");
      }
    }
  }, [dispatch, router, isLoggedIn]);

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
