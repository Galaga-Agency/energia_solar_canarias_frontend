"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logoutUser } from "@/store/slices/userSlice";
import { useTranslation } from "next-i18next";
import ProfileOverviewCard from "./ProfileOverviewCard";
import PasswordChangeCard from "./PasswordChangeCard";
import ApiKeyRequestCard from "./ApiKeyRequestCard";
import MetricsConfigCard from "./MetricsConfigCard";
import CompanyDocumentsCard from "./CompanyDocumentsCard";
import NotificationsCard from "./NotificationsCard";
import axios from "axios";
import Cookies from "js-cookie";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter, usePathname } from "next/navigation";
import Texture from "./Texture";
import ConfirmationModal from "./ConfirmationModal";
import useDeviceType from "@/hooks/useDeviceType";

const SettingsTab = () => {
  return (
    <div
      className={`relative w-screen p-8 md:p-10 h-auto pb-24 ${
        theme === "dark" ? "bg-dark-mode-bg" : "bg-light-mode-bg"
      }`}
    ></div>
  );
};

export default SettingsTab;
