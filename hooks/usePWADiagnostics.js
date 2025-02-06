"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const usePWADiagnostics = () => {
  const manifestRef = useRef(null);
  const [diagnostics, setDiagnostics] = useState({
    deferredPrompt: null,
    isInstalled: false,
    showButton: true,
    isIOS: false,
  });

  const persistDeferredPrompt = useCallback((prompt) => {
    if (typeof window === "undefined") return;

    if (prompt) {
      try {
        localStorage.setItem("deferredPrompt", JSON.stringify(prompt));
      } catch (error) {
        console.error("Error persisting prompt:", error);
      }
    } else {
      localStorage.removeItem("deferredPrompt");
    }
  }, []);

  const reloadManifest = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    try {
      // Remove existing manifest reference if it exists
      if (manifestRef.current) {
        manifestRef.current.remove();
        manifestRef.current = null;
      }

      // Create and append new manifest
      const newManifest = document.createElement("link");
      newManifest.rel = "manifest";
      const manifestUrl = "/manifest.json"; // Adjust this path as needed
      newManifest.href = `${manifestUrl}?t=${Date.now()}`;
      document.head.appendChild(newManifest);
      manifestRef.current = newManifest;

      // console.log("Manifest reloaded successfully");
    } catch (error) {
      console.error("Error reloading manifest:", error);
    }
  }, []);

  const checkStandalone = useCallback(() => {
    if (typeof window === "undefined") return false;

    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator?.standalone ||
      false
    );
  }, []);

  const isIOS = useCallback(() => {
    if (typeof window === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    const handleBeforeInstallPrompt = (e) => {
      if (!isMounted) return;

      e.preventDefault();
      // console.log("beforeinstallprompt fired");

      persistDeferredPrompt(e);

      setDiagnostics((prev) => ({
        ...prev,
        deferredPrompt: e,
        showButton: "currentTarget" in e,
      }));
    };

    const checkInstalledStatus = () => {
      if (!isMounted) return;

      setDiagnostics((prev) => ({
        ...prev,
        isInstalled: checkStandalone(),
      }));
    };

    const loadDeferredPromptFromStorage = () => {
      try {
        const savedPrompt = localStorage.getItem("deferredPrompt");
        if (savedPrompt) {
          // console.log("DeferredPrompt loaded from localStorage");
          return JSON.parse(savedPrompt);
        }
      } catch (error) {
        console.error("Error loading deferredPrompt:", error);
        localStorage.removeItem("deferredPrompt");
      }
      return null;
    };

    // Initialize
    const init = () => {
      if (!isMounted) return;

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", checkInstalledStatus);

      setDiagnostics((prev) => ({
        ...prev,
        isIOS: isIOS(),
      }));

      const storedPrompt = loadDeferredPromptFromStorage();
      if (storedPrompt) {
        setDiagnostics((prev) => ({
          ...prev,
          deferredPrompt: storedPrompt,
          showButton: "currentTarget" in storedPrompt,
        }));
      }

      checkInstalledStatus();

      // Delay manifest reload to avoid initialization issues
      setTimeout(reloadManifest, 0);
    };

    init();

    // Cleanup
    return () => {
      isMounted = false;

      if (manifestRef.current) {
        try {
          manifestRef.current.remove();
          manifestRef.current = null;
        } catch (error) {
          console.error("Error cleaning up manifest:", error);
        }
      }

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", checkInstalledStatus);
    };
  }, [checkStandalone, isIOS, persistDeferredPrompt, reloadManifest]);

  return diagnostics;
};

export default usePWADiagnostics;
