"use client";

import React from "react";
import { BiHomeAlt } from "react-icons/bi";
import { useTranslation } from "next-i18next";
import TransitionEffect from "@/components/TransitionEffect";
import Texture from "@/components/Texture";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import BottomNavbar from "@/components/BottomNavbar";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";

const NotFoundPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentUser = useSelector(selectUser);

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-custom-dark-blue dark:text-custom-yellow light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900">
      <TransitionEffect />
      <Texture />

      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
        <div className="flex flex-col items-end">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-end">
          <LanguageSelector />
        </div>
      </div>

      <div className="text-center max-w-[80vw]">
        <h1 className="text-9xl font-extrabold mb-4 text-custom-dark-blue dark:text-custom-yellow opacity-20">
          404
        </h1>
        <h2 className="text-4xl font-primary mb-2 ">{t("pageNotFound")}</h2>
        <p className="text-lg font-secondary mb-8">{t("pageDoesNotExist")}</p>
        <PrimaryButton onClick={handleGoBack}>
          <BiHomeAlt className="mr-2 text-xl" />
          {t("goBackHome")}
        </PrimaryButton>
      </div>
      <BottomNavbar userId={currentUser?.id} userClass={currentUser?.clase} />
    </div>
  );
};

export default NotFoundPage;
