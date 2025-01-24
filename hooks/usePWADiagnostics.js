import { useState, useEffect } from "react";

const usePWADiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    isHTTPS: false,
    hasManifest: false,
    supportsBeforeInstallPrompt: false,
    hasServiceWorker: false,
    isStandalone: false,
    canInstall: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    const performDiagnostics = () => {
      const isHTTPS =
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost";
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const supportsBeforeInstallPrompt = "beforeinstallprompt" in window;
      const hasServiceWorker = "serviceWorker" in navigator;
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        navigator.standalone;

      setDiagnostics((prev) => ({
        ...prev,
        isHTTPS,
        hasManifest,
        supportsBeforeInstallPrompt,
        hasServiceWorker,
        isStandalone,
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
