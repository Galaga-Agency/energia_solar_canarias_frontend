import React from "react";
import { useTranslation } from "next-i18next";
import { RefreshCcw, AlertCircle, FileBarChart2 } from "lucide-react";
import { useParams } from "next/navigation";

const NoDataErrorState = ({ isError, onRetry, onSelectRange }) => {
  const { t } = useTranslation();
  const { provider } = useParams();

  return (
    <div className="min-h-[400px] w-full flex items-center justify-center">
      <div className="text-center space-y-6">
        {isError ? (
          <>
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 animate-bounce" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                {t("Error al cargar datos")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t("Por favor, inténtelo de nuevo más tarde")}
              </p>
            </div>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white dark:bg-custom-dark-blue hover:bg-white/80 dark:hover:bg-custom-dark-blue/80 transition-all duration-300 rounded-full shadow-md text-custom-dark-blue dark:text-custom-yellow"
            >
              <RefreshCcw className="w-4 h-4" />
              {t("Reintentar")}
            </button>
          </>
        ) : (
          <>
            <FileBarChart2 className="w-16 h-16 mx-auto text-custom-dark-blue dark:text-custom-yellow animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                {t("No hay datos disponibles")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t("Seleccione otro rango de fechas para ver los datos")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {provider !== "solaredge" && (
                <button
                  onClick={onSelectRange}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white dark:bg-custom-dark-blue hover:bg-white/80 dark:hover:bg-custom-dark-blue/80 transition-all duration-300 rounded-full shadow-md text-custom-dark-blue dark:text-custom-yellow"
                >
                  {t("Cambiar rango")}
                </button>
              )}
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-6 py-2 bg-white/50 dark:bg-custom-dark-blue/50 hover:bg-white/30 dark:hover:bg-custom-dark-blue/30 transition-all duration-300 rounded-full shadow-md text-custom-dark-blue dark:text-custom-yellow w-auto mx-auto"
              >
                <RefreshCcw className="w-4 h-4" />
                {t("Actualizar")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoDataErrorState;
