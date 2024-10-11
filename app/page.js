"use client";
import { useEffect } from "react";
import { fetchUserData } from "@/services/api";
import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  useEffect(() => {
    console.log("useEffect is running");
    const testAPI = async () => {
      console.log("API call is being made");
      try {
        const data = await fetchUserData("anfego1", "Abfe04**");
        console.log("API Response:", data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    testAPI();
  }, []);

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
