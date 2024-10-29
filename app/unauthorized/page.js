"use client";

import React from "react";
import { FaLock } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import TransitionEffect from "@/components/TransitionEffect";
import Texture from "@/components/Texture";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

const UnauthorizedPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

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
      <FaLock className="text-6xl mb-6" />
      <h1 className="text-4xl font-primary mb-2">{t("accessDenied")}</h1>
      <p className="text-lg font-secondary mb-8">{t("unauthorizedMessage")}</p>
      <PrimaryButton onClick={handleGoBack}>{t("goBackHome")}</PrimaryButton>
    </div>
  );
};

export default UnauthorizedPage;
