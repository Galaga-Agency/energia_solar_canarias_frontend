import React from "react";
import { useTranslation } from "next-i18next";
import { BarChart2, Users, AlertTriangle } from "lucide-react";

const UsersStats = ({ users }) => {
  const { t } = useTranslation();

  const stats = {
    admin: users?.filter((user) => user.clase === "admin").length || 0,
    client: users?.filter((user) => user.clase === "cliente").length || 0,
    total: users?.length || 0,
    active:
      users?.filter((user) => {
        if (!user.lastLogin) return false;
        const lastLogin = new Date(user.lastLogin);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastLogin > thirtyDaysAgo;
      }).length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Status Overview */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <BarChart2 className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("status_overview")}
          </h3>
        </div>
        <div className="flex justify-around">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-custom-yellow"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.admin}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.client}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.total}
            </span>
          </div>
        </div>
      </div>

      {/* Total Users */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <Users className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("totalUsers")}
          </h3>
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-2xl font-medium text-slate-700 dark:text-slate-200">
            {stats.total}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {t("users")}
          </span>
        </div>
      </div>

      {/* Active Users */}
      <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue rounded-full flex items-center justify-center shadow-md">
            <AlertTriangle className="text-custom-dark-blue dark:text-custom-yellow text-xl" />
          </div>
          <h3 className="text-lg text-slate-700 dark:text-slate-200">
            {t("activeUsers")}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {stats.active}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("active")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-medium text-slate-700 dark:text-slate-200">
              {Math.round((stats.active / stats.total) * 100)}%
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("total")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersStats;
