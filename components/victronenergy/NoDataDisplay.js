import React from "react";
import { useTranslation } from "next-i18next";
import { AlertCircle, RefreshCcw, CalendarRange } from "lucide-react";

const NoDataErrorState = ({ isError, onRetry, onSelectRange }) => {
  const { t } = useTranslation();

  return (
    <div className="h-[400px] mb-6 flex items-center justify-center w-full bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="text-center">
        {isError ? (
          <>
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500 dark:text-red-400 animate-bounce" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              {t("Error al cargar datos")}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t("Por favor, inténtelo de nuevo más tarde")}
            </p>
            <button
              onClick={onRetry}
              className="mt-4 px-6 py-2 text-sm bg-custom-yellow text-custom-dark-blue rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              {t("Reintentar")}
            </button>
          </>
        ) : (
          <>
            <CalendarRange className="w-12 h-12 mx-auto mb-3 text-custom-dark-blue dark:text-custom-yellow animate-pulse" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              {t("No hay datos disponibles")}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t("Seleccione otro rango de fechas para ver los datos")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <button
                onClick={onSelectRange}
                className="px-6 py-2 text-sm bg-custom-yellow text-custom-dark-blue rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <CalendarRange className="w-4 h-4" />
                {t("Cambiar rango")}
              </button>
              <button
                onClick={onRetry}
                className="px-6 py-2 text-sm bg-custom-yellow/50 text-custom-dark-blue rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
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
