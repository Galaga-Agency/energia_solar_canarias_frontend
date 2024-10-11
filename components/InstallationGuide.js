"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";
import useDeviceType from "@/hooks/useDeviceType";
import { useTranslation } from "react-i18next";

const InstallationGuide = () => {
  const { t } = useTranslation();
  const [os, setOs] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const modalRef = useRef(null);
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("android")) {
      setOs("Android");
    } else if (
      userAgent.includes("iphone") ||
      userAgent.includes("ipad") ||
      userAgent.includes("ipod") ||
      (userAgent.includes("mac") && "ontouchend" in document)
    ) {
      setOs("iOS");
    } else if (userAgent.includes("win")) {
      setOs("Windows");
    } else if (userAgent.includes("mac")) {
      setOs("macOS");
    } else if (userAgent.includes("linux")) {
      setOs("Linux");
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, isMobile, isTablet, isDesktop, os]);

  const videoSources = {
    Windows: "/videos/windows-installation.mp4",
    macOS: "/videos/macos-installation.mp4",
    Linux: "/videos/linux-installation.mp4",
    Android: "/videos/android-installation.mp4",
    iOS: "/videos/ios-installation.mp4",
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col items-end">
      {os && (
        <button
          className="flex items-center gap-2 bg-custom-yellow text-custom-dark-blue font-semibold px-4 h-9 rounded-md shadow-md hover:bg-opacity-90 transition-all"
          onClick={handleToggle}
        >
          <FaDownload className="text-lg" />
          <span>
            {t("installationGuideTitle")} {`${os}`}
          </span>
        </button>
      )}

      {isExpanded && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-60"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-[90%] md:max-w-[700px] p-1 bg-white rounded-lg shadow-lg"
          >
            <button
              className="absolute -top-3 -right-3 text-custom-dark-blue text-2xl bg-custom-yellow rounded-full p-1 hover:shadow-white-shadow z-[999]"
              onClick={handleToggle}
            >
              <FaTimes className="text-2xl" />
            </button>
            <video
              src={videoSources[os]}
              controls
              autoPlay
              className="w-full rounded-md shadow-md bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallationGuide;
