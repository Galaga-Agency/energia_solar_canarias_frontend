"use client";

import React, { useEffect, useState } from "react";
import i18n from "i18next";
import { useRouter } from "next/router";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/locales/en.json";
import esTranslation from "@/locales/es.json";
import Loading from "./Loading";

const TranslationProvider = ({ children }) => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const [minimumLoadingDone, setMinimumLoadingDone] = useState(false);

  useEffect(() => {
    i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: enTranslation },
          es: { translation: esTranslation },
        },
        lng: "es",
        fallbackLng: "es",
        react: {
          useSuspense: false,
        },
      })
      .then(() => {
        setIsI18nInitialized(true);
      });

    const timer = setTimeout(() => {
      setMinimumLoadingDone(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isI18nInitialized || !minimumLoadingDone) {
    return (
      <div className="w-screen h-screen bg-custom-dark-blue flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = async (url) => {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.active.postMessage({
          type: "CACHE_URLS",
          payload: [url],
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <>{children}</>;
};

export default TranslationProvider;
