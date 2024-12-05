import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const ProviderCard = ({ provider, onClick }) => {
  const theme = useSelector(selectTheme);
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-[30vh] group">
      <div
        className="relative w-full h-full overflow-hidden cursor-pointer 
                   bg-white/50 dark:bg-custom-dark-blue/50 
                   rounded-lg shadow-lg
                   transition-all duration-700
                   backdrop-blur-sm"
        onClick={onClick}
      >
        {/* Logo container */}
        <div className="relative w-full h-full">
          <div className="absolute inset-0 dark:bg-slate-700/50 rounded-lg transition-opacity duration-700" />

          {theme === "dark" ? (
            <Image
              src={provider.imgDark}
              alt={provider.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8 
                      transition-transform duration-700 ease-in-out
                      group-hover:scale-110"
              priority
            />
          ) : (
            <Image
              src={provider.imgLight}
              alt={provider.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8 
                    transition-transform duration-700 ease-in-out
                    group-hover:scale-110"
              priority
            />
          )}
        </div>

        {/* Hover overlay - matching your gradient style */}
        <div
          className="absolute inset-0 z-10
                       bg-gradient-to-br from-custom-dark-blue/0 to-custom-dark-blue/0
                       dark:from-slate-900/0 dark:to-slate-900/0
                       group-hover:from-custom-dark-blue/95 group-hover:to-custom-dark-blue/90
                       dark:group-hover:from-slate-900/95 dark:group-hover:to-slate-900/90
                       transition-colors duration-700"
        />

        {/* Content container */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6
                       opacity-0 translate-y-8
                       group-hover:opacity-100 group-hover:translate-y-0
                       transition-all duration-700 ease-in-out"
        >
          <h2
            className="text-center font-primary text-3xl font-bold text-custom-yellow mb-4 
                        tracking-wider transform group-hover:scale-110
                        transition-transform duration-700"
          >
            {provider.name}
          </h2>

          <p
            className="font-secondary text-white text-sm text-center 
                       max-w-[80%] line-clamp-3
                       transform group-hover:scale-105 transition-transform duration-700"
          >
            {provider.description || t("clickToSeeAllPlants")}
          </p>

          <button
            className="mt-6 px-6 py-2 bg-custom-yellow text-custom-dark-blue 
                            rounded-full text-sm font-secondary font-bold
                            transform translate-y-4 opacity-0
                            group-hover:translate-y-0 group-hover:opacity-100
                            hover:bg-opacity-90 transition-all duration-300"
          >
            {t("more")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
