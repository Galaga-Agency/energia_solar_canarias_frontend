"use client";

import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
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
