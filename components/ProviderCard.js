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
                   shadow-dark-shadow 
                   group-hover:shadow-hover-dark-shadow dark:group-hover:shadow-hover-white-shadow 
                   transition-all duration-700 bg-white/30 dark:bg-white/40 rounded-lg backdrop-blur-sm"
        onClick={onClick}
      >
        <div className="relative w-full h-full">
          <Image
            src={provider.img}
            alt={provider.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain transition-transform duration-700 ease-in-out group-hover:scale-110"
            priority
          />
        </div>

        <div
          className="absolute inset-0 bg-custom-dark-blue/10 
                     dark:bg-gray-900/30
                     group-hover:bg-custom-dark-blue/90
                     dark:group-hover:bg-custom-dark-blue/95
                     transition-colors duration-700 group-hover:backdrop-blur-sm"
        />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6
                     opacity-0 translate-y-8
                     group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-700 ease-in-out"
        >
          <h2
            className="text-center font-primary text-3xl font-bold text-custom-yellow mb-4 
                       tracking-wider transform group-hover:scale-110 
                       transition-transform duration-700
                       drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
          >
            {provider.name}
          </h2>

          <p
            className="font-secondary text-custom-light-gray text-sm text-center 
                       max-w-[80%] line-clamp-3
                       transform group-hover:scale-105 transition-transform duration-700"
          >
            {provider.description || t("clickToSeeAllPlants")}{" "}
          </p>

          <button
            className="mt-6 px-6 py-2 bg-custom-yellow text-custom-dark-blue 
                       rounded-full text-sm font-secondary font-bold
                       transform translate-y-4 opacity-0
                       group-hover:translate-y-0 group-hover:opacity-100
                       hover:bg-opacity-90 transition-all duration-300
                       shadow-dark-shadow"
          >
            {t("more")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
