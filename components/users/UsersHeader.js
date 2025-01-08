import React from "react";
import { useTranslation } from "next-i18next";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";

const UsersHeader = ({ viewMode, onViewModeChange, onToggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-white/10 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
      >
        <IoFilterOutline className="w-6 h-6 text-custom-dark-blue dark:text-custom-yellow" />
      </button>

      <div className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-1 flex shadow-lg">
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "list"
              ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
              : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
          }`}
        >
          <HiViewList className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "grid"
              ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
              : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
          }`}
        >
          <HiViewGrid className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UsersHeader;
