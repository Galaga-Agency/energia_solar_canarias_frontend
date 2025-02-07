import React from "react";
import { Zap } from "lucide-react";

const PeakPower = ({ totalPower, t }) => {
  return (
    <div
      className="flex-1 group relative text-center bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
                hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
                p-4 flex flex-col items-center h-[160px]"
    >
      <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
        <Zap className="w-8 h-8 text-custom-dark-blue dark:text-custom-yellow" />
      </div>

      <h3 className="text-sm mt-8 mb-4 text-slate-600 dark:text-slate-300 font-medium">
        {t("peak_power")}
      </h3>

      <div className="flex items-baseline justify-center gap-2">
        <span className="text-3xl font-bold text-slate-700 dark:text-slate-200">
          {totalPower.toFixed(2)}
        </span>
        <span className="text-lg text-slate-600 dark:text-slate-400">kW</span>
      </div>
    </div>
  );
};

export default PeakPower;
