"use client";

import { useEffect } from "react";
import { fetchUserData } from "@/services/api";
import InstallationGuide from "@/components/InstallationGuide";
import LanguageSelector from "@/components/LanguageSelector";
import LogoAnimation from "@/components/LogoAnimation";

export default function Home() {
  useEffect(() => {
    console.log("useEffect is running"); // Debug: Check if this logs

    // Test the API call when the component loads
    const testAPI = async () => {
      console.log("API call is being made"); // Debug: Check if this logs
      try {
        const data = await fetchUserData("anfego1", "Abfe04**"); // Replace with actual values
        console.log("API Response:", data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    // Call the API only for testing purposes
    testAPI();
  }, []); // This will run once when the component mounts

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative">
      <div className="absolute top-4 right-0 flex gap-4 items-center">
        <InstallationGuide />
        <LanguageSelector />
      </div>
      <div className="flex justify-center items-center h-full">
        <LogoAnimation />
      </div>
    </div>
  );
}
