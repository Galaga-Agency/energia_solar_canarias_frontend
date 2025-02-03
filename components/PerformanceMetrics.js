import React from "react";
import { useTranslation } from "next-i18next";
import { Wallet, PiggyBank, BarChart2, Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

const PerformanceMetrics = ({ kpi }) => {
  const { t } = useTranslation();

  const getYieldColor = (yieldRate) => {
    const percentage = yieldRate * 100;
    if (!percentage || percentage === 0) return "text-gray-500";
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 70) return "text-emerald-400";
    if (percentage >= 60) return "text-yellow-500";
    if (percentage >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getYieldLabel = (yieldRate) => {
    const percentage = yieldRate * 100;
    if (!percentage || percentage === 0) return t("noData");
    if (percentage >= 80) return t("excellentPerformance");
    if (percentage >= 70) return t("goodPerformance");
    if (percentage >= 60) return t("fairPerformance");
    if (percentage >= 50) return t("belowAverage");
    return t("needsAttention");
  };

  const getYieldIcon = (yieldRate) => {
    const percentage = yieldRate * 100;
    if (percentage >= 70) return "🌟";
    if (percentage >= 50) return "⚡";
    return "⚠️";
  };

  const renderMetric = (icon, labelKey, value, tooltipKey) => (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex items-center gap-1">
          <strong className="text-lg dark:text-custom-light-gray">
            {t(labelKey)}
          </strong>
          {tooltipKey && (
            <Popover showArrow offset={20} placement="right">
              <PopoverTrigger>
                <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow cursor-help" />
              </PopoverTrigger>
              <PopoverContent className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm">
                <div className="px-1 py-2">
                  <p className="font-medium">{t(tooltipKey)}</p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <Popover showArrow offset={20} placement="left">
        <PopoverTrigger>
          <span className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow cursor-help">
            {value}
          </span>
        </PopoverTrigger>
        {tooltipKey && (
          <PopoverContent className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm">
            <div className="px-1 py-2">
              <p className="font-medium">{t(tooltipKey)}</p>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );

  return (
    <section className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-6 mb-6 backdrop-blur-sm">
      <h2 className="text-xl mb-4 text-custom-dark-blue dark:text-custom-yellow">
        {t("performanceMetrics")}
      </h2>
      <div className="space-y-4">
        {renderMetric(
          <Wallet className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />,
          "monthlyIncome",
          `${kpi?.day_income || 0} ${kpi?.currency}`,
          "monthlyIncomeTooltip"
        )}
        {renderMetric(
          <PiggyBank className="text-3xl text-custom-dark-blue dark:text-custom-yellow" />,
          "totalIncome",
          `${kpi?.total_income || 0} ${kpi?.currency}`,
          "totalIncomeTooltip"
        )}
        {renderMetric(
          <BarChart2 className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />,
          "performanceRatio",
          <>
            <span
              className={`text-lg font-semibold ${getYieldColor(
                kpi?.yield_rate
              )}`}
            >
              {`${((kpi?.yield_rate || 0) * 100).toFixed(1)}%`}
            </span>
            <span>{getYieldIcon(kpi?.yield_rate)}</span>
          </>,
          "performanceRatioTooltip"
        )}
      </div>
    </section>
  );
};

export default PerformanceMetrics;
