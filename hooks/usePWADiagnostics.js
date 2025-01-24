import { useEffect, useState } from "react";

const usePWADiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    isHTTPS: false,
    hasManifest: false,
    supportsBeforeInstallPrompt: false,
    hasServiceWorker: false,
    isStandalone: false,
    canInstall: false,
    deferredPrompt: null,
    isInstalled: false, // Indicates whether the app is already installed
  });

  useEffect(() => {
    const performDiagnostics = async () => {
      // Check basic diagnostics
      const isHTTPS =
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost";
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const supportsBeforeInstallPrompt = "beforeinstallprompt" in window;
      const hasServiceWorker = "serviceWorker" in navigator;
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        navigator.standalone;

      // Check if the app is installed using `getInstalledRelatedApps`
      let isInstalled = false;
      if ("getInstalledRelatedApps" in navigator) {
        try {
          const relatedApps = await navigator.getInstalledRelatedApps();
          isInstalled = relatedApps.some(
            (app) => app.url === `${window.location.origin}/manifest.json`
          );
        } catch (error) {
          console.error("Error checking installed related apps:", error);
        }
      }

      setDiagnostics((prev) => ({
        ...prev,
        isHTTPS,
        hasManifest,
        supportsBeforeInstallPrompt,
        hasServiceWorker,
        isStandalone,
        isInstalled,
      }));
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDiagnostics((prev) => ({
        ...prev,
        deferredPrompt: e,
        canInstall: true,
      }));
    };

    performDiagnostics();

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return diagnostics;
};

export default usePWADiagnostics;
