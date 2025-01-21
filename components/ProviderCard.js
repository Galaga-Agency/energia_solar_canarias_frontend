import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const ProviderCard = ({ provider, onClick }) => {
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[30vh] 2xl:h-[32vh] group">
      <div
        className={`relative w-full h-full overflow-hidden 
                   bg-white/50 dark:bg-custom-dark-blue/50
                   rounded-lg shadow-lg
                   transition-all duration-300
                   backdrop-blur-sm
                   ${
                     provider.isReady
                       ? "cursor-pointer hover:shadow-xl"
                       : "cursor-not-allowed"
                   }`}
        onClick={provider.isReady ? onClick : undefined}
      >
        {/* Coming Soon Banner - only for non-ready providers */}
        {!provider.isReady && (
          <div className="absolute -left-10 top-8 z-30 rotate-[-45deg]">
            <div className="bg-slate-500/90 dark:bg-slate-700/90 py-1 px-12 shadow-lg">
              <span className="text-xs font-medium text-white">
                {t("comingSoon")}
              </span>
            </div>
          </div>
        )}

        {/* Dynamic background effect - only for ready providers */}
        {provider.isReady && (
          <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
            <div
              className="absolute w-full h-full blur-2xl transition-opacity duration-700 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(45deg, rgba(255, 213, 122, 0.2), rgba(0, 44, 63, 0.1))"
                    : "linear-gradient(45deg, rgba(0, 44, 63, 0.1), rgba(255, 213, 122, 0.2))",
              }}
            />
          </div>
        )}

        {/* Circle decoration - only for ready providers */}
        {provider.isReady && (
          <div className="absolute inset-0 transition-transform duration-700">
            <div
              className="absolute -right-20 -top-20 w-40 h-40 bg-custom-yellow/5 
                         rounded-full blur-md group-hover:scale-150 
                         transition-transform duration-700"
            />
            <div
              className="absolute -left-20 -bottom-20 w-40 h-40 bg-custom-yellow/5 
                         rounded-full blur-md group-hover:scale-150
                         transition-transform duration-700"
            />
          </div>
        )}

        {/* Logo container with conditional effects */}
        <div
          className={`relative w-full h-full rounded-lg transition-all duration-700
                     ${
                       provider.isReady
                         ? "bg-slate-50 dark:bg-slate-700/50 group-hover:bg-opacity-80 dark:group-hover:bg-opacity-80"
                         : "bg-slate-100 dark:bg-slate-800/50"
                     }`}
        >
          <Image
            src={theme === "dark" ? provider.imgDark : provider.imgLight}
            alt={provider.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-contain p-8 transition-all duration-700 ease-out
                       ${
                         provider.isReady
                           ? "group-hover:scale-110"
                           : "opacity-50"
                       }`}
            priority
          />
        </div>

        {/* Enhanced overlay with wave effect - only for ready providers */}
        {provider.isReady && (
          <div
            className="absolute inset-0 z-10 rounded-lg
                       bg-gradient-to-br from-custom-dark-blue/0 to-custom-dark-blue/0
                       dark:from-slate-900/0 dark:to-slate-900/0
                       group-hover:from-custom-dark-blue/95 group-hover:to-custom-dark-blue/90
                       dark:group-hover:from-slate-900/95 dark:group-hover:to-slate-900/90
                       transition-all duration-700
                       after:absolute after:inset-0 after:bg-gradient-to-t 
                       after:from-custom-yellow/5 after:to-transparent 
                       after:translate-y-full after:group-hover:translate-y-0
                       after:transition-transform after:duration-700"
          />
        )}

        {/* Content with reveal animation - only for ready providers */}
        {provider.isReady && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6
                       opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-700"
          >
            <h2
              className="text-center font-primary text-3xl font-bold text-custom-yellow mb-4 
                        tracking-wider translate-y-8 group-hover:translate-y-0
                        transition-transform duration-700"
            >
              {provider.name}
            </h2>

            <p
              className="font-secondary text-slate-300 text-sm text-center 
                        max-w-[90%] line-clamp-3 translate-y-8 group-hover:translate-y-0
                        transition-transform duration-700 delay-100"
            >
              {provider.description || t("clickToSeeAllPlants")}
            </p>

            <button
              className="mt-6 px-8 py-3 bg-custom-yellow text-custom-dark-blue 
                        rounded-full text-sm font-secondary font-bold
                        translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                        hover:bg-opacity-90 hover:scale-105
                        transition-all duration-500 delay-200
                        shadow-md"
            >
              {t("more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderCard;
