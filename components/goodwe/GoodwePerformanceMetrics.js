import React from "react";
import { Wallet, PiggyBank, BarChart2, Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import PerformanceMetricsSkeleton from "@/components/loadingSkeletons/PerformanceMetricsSkeleton";
import { useSelector } from "react-redux";
import { selectLoadingDetails } from "@/store/slices/plantsSlice";
import useDeviceType from "@/hooks/useDeviceType";

const GoodwePerformanceMetrics = ({
  theme,
  goodwePlant,
  t,
  isMobile,
  getYieldColor,
  getYieldIcon,
}) => {
  const isLoading = useSelector(selectLoadingDetails);
  const { isSmallDesktop } = useDeviceType();

  const metrics = [
    {
      icon: Wallet,
      title: "dayIncome",
      tooltip: "dayIncomeTooltip",
      value: `${goodwePlant?.kpi?.day_income?.toFixed(2) || "0.00"} ${
        goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
    {
      icon: PiggyBank,
      title: "totalIncome",
      tooltip: "totalIncomeTooltip",
      value: `${goodwePlant?.kpi?.total_income?.toFixed(2) || "0.00"} ${
        goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
    {
      icon: BarChart2,
      title: "performanceRatio",
      tooltip: "performanceRatioTooltip",
      valueComponent: (
        <span className="flex items-center gap-2">
          <span className={getYieldColor(goodwePlant?.kpi?.yield_rate)}>
            {`${((goodwePlant?.kpi?.yield_rate || 0) * 100).toFixed(0)}%`}
          </span>
          {!isMobile && (
            <span>{getYieldIcon(goodwePlant?.kpi?.yield_rate)}</span>
          )}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <PerformanceMetricsSkeleton theme={theme} />;
  }

  return (
    <section className="flex-1 xl:min-w-[40vw] bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm mb-6">
      <h2 className="text-xl mb-6 text-custom-dark-blue dark:text-custom-yellow">
        {t("performanceMetrics")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map(
          ({ icon: Icon, title, tooltip, value, valueComponent }, index) => (
            <div
              key={index}
              className="flex-1 relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
                  <Icon className="w-8 h-8 text-custom-dark-blue dark:text-custom-yellow" />
                </div>
                <div className="text-sm mt-8 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                  {t(title)}
                  <Popover showArrow offset={20} placement="top">
                    <PopoverTrigger asChild>
                      <Info className="h-4 w-4 text-custom-dark-blue dark:text-custom-yellow cursor-help ml-1" />
                    </PopoverTrigger>
                    <PopoverContent className="dark:bg-gray-800 bg-white/90 backdrop-blur-sm max-w-xs">
                      <div className="px-1 py-2">
                        <p className="text-sm font-medium">{t(tooltip)}</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {valueComponent || value}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default GoodwePerformanceMetrics;
