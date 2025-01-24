"use client";

import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "sonner";
import usePlatformDetection from "@/hooks/usePlatformDetection";
import usePWADiagnostics from "@/hooks/usePWADiagnostics";
import PrimaryButton from "./ui/PrimaryButton";

const InstallationGuide = () => {
  const platformInfo = usePlatformDetection(); // Detect OS, browser, etc.
  const pwaDiagnostics = usePWADiagnostics(); // PWA-related diagnostics
  const isDev = process.env.NODE_ENV === "development"; // Check if in development mode

  const [installState, setInstallState] = useState({
    deferredPrompt: null,
    canInstall: false,
  });

  // Listen for the `beforeinstallprompt` event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent automatic prompt display
      console.log("beforeinstallprompt event fired");
      setInstallState({
        deferredPrompt: e,
        canInstall: true,
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Check if app is already installed
  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone;

    if (isStandalone) {
      console.log("App is already running in standalone mode");
      setInstallState((prev) => ({ ...prev, canInstall: false }));
    }
  }, []);

  const handleInstallClick = async () => {
    const { deferredPrompt } = installState;

    if (!deferredPrompt) {
      console.error("No installation prompt available.");
      toast.error("Installation prompt is not available.");
      return;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        toast.success("App installed successfully!");
        setInstallState((prev) => ({ ...prev, canInstall: false }));
      } else {
        toast.info("Installation canceled.");
      }
    } catch (error) {
      console.error("Installation error:", error);
      toast.error("Failed to install the app.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {installState.canInstall && (
        <PrimaryButton onClick={handleInstallClick}>
          <FaDownload className="text-lg" />
          <span className="px-2">Install App</span>
        </PrimaryButton>
      )}
      {isDev && (
        <div className="p-4 bg-gray-100 rounded mt-4">
          <h2 className="font-bold mb-2">Platform Information</h2>
          <ul>
            <li>
              <strong>OS:</strong> {platformInfo.os || "Unknown"}
            </li>
            <li>
              <strong>Platform:</strong> {platformInfo.platform || "Unknown"}
            </li>
            <li>
              <strong>Browser:</strong> {platformInfo.browser || "Unknown"}
            </li>
            <li>
              <strong>Browser Version:</strong>{" "}
              {platformInfo.browserVersion || "Unknown"}
            </li>
            <li>
              <strong>Device Type:</strong>{" "}
              {platformInfo.deviceType || "Unknown"}
            </li>
          </ul>

          <h2 className="font-bold mt-4 mb-2">PWA Diagnostics</h2>
          <ul>
            <li
              className={
                pwaDiagnostics?.isHTTPS ? "text-green-500" : "text-red-500"
              }
            >
              <strong>HTTPS:</strong>{" "}
              {pwaDiagnostics?.isHTTPS !== undefined
                ? pwaDiagnostics.isHTTPS.toString()
                : "Unknown"}
            </li>
            <li
              className={
                pwaDiagnostics?.hasManifest ? "text-green-500" : "text-red-500"
              }
            >
              <strong>Manifest:</strong>{" "}
              {pwaDiagnostics?.hasManifest !== undefined
                ? pwaDiagnostics.hasManifest.toString()
                : "Unknown"}
            </li>
            <li
              className={
                pwaDiagnostics?.supportsBeforeInstallPrompt
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              <strong>Supports Install:</strong>{" "}
              {pwaDiagnostics?.supportsBeforeInstallPrompt !== undefined
                ? pwaDiagnostics.supportsBeforeInstallPrompt.toString()
                : "Unknown"}
            </li>
            <li
              className={
                pwaDiagnostics?.hasServiceWorker
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              <strong>Service Worker:</strong>{" "}
              {pwaDiagnostics?.hasServiceWorker !== undefined
                ? pwaDiagnostics.hasServiceWorker.toString()
                : "Unknown"}
            </li>
            <li
              className={
                pwaDiagnostics?.isStandalone ? "text-green-500" : "text-red-500"
              }
            >
              <strong>Standalone Mode:</strong>{" "}
              {pwaDiagnostics?.isStandalone !== undefined
                ? pwaDiagnostics.isStandalone.toString()
                : "Unknown"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InstallationGuide;
