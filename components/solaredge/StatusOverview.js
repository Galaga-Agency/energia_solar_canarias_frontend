import React from "react";
import { BarChart2 } from "lucide-react";

const StatusOverview = ({ stats, onStatusClick, t }) => {
  return (
    <div
      className="flex-1 group relative text-center bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl 
                hover:shadow-lg hover:rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 
                p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-700"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
          <BarChart2 className="w-8 h-8 text-custom-dark-blue dark:text-custom-yellow" />
        </div>
        <h3 className="text-sm mt-8 text-slate-600 dark:text-slate-300 font-medium">
          {t("status_overview")}
        </h3>
      </div>

      <div className="flex gap-2">
        {[
          { status: "working", color: "green" },
          { status: "disconnected", color: "gray" },
          { status: "waiting", color: "yellow" },
          { status: "error", color: "red" },
        ].map(({ status, color }) => (
          <div
            key={status}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onStatusClick(status)}
          >
            <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {stats[status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverview;
