// Import additional icons
import React, { useEffect } from "react";
import {
  Wallet,
  PiggyBank,
  BarChart2,
  Info,
  Coins,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import PerformanceMetricsSkeleton from "@/components/loadingSkeletons/PerformanceMetricsSkeleton";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLoadingDetails,
  selectTotalRealPrice,
  selectTotalRealPriceLoading,
  fetchTotalRealPrice,
  selectTotalRealPriceError,
} from "@/store/slices/plantsSlice";
import useDeviceType from "@/hooks/useDeviceType";
import { selectUser } from "@/store/slices/userSlice";
import { useParams } from "next/navigation";

const GoodwePerformanceMetrics = ({ theme, goodwePlant, t }) => {
  const dispatch = useDispatch();
  const { plantId } = useParams();
  const isLoading = useSelector(selectLoadingDetails);
  const totalRealPrice = useSelector(selectTotalRealPrice);
  const totalRealPriceLoading = useSelector(selectTotalRealPriceLoading);
  const totalRealPriceError = useSelector(selectTotalRealPriceError);
  const { isSmallDesktop } = useDeviceType();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (plantId && user?.tokenIdentificador) {
      console.log("🟠 Dispatching fetch with plantId:", plantId);
      dispatch(
        fetchTotalRealPrice({
          plantId: plantId,
          provider: "goodwe",
          token: user.tokenIdentificador,
        })
      );
    } else {
      console.log("🟠 Missing data for fetch:", {
        plantId: plantId || "missing",
        token: user?.tokenIdentificador ? "exists" : "missing",
      });
    }
  }, [dispatch, plantId, user?.tokenIdentificador]);

  const loading = isLoading || totalRealPriceLoading;

  if (loading) {
    return <PerformanceMetricsSkeleton theme={theme} />;
  }

  // Safe formatting function
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "0.00";
    }
    return typeof value === "number" ? value.toFixed(2) : "0.00";
  };

  // Get currency - use moneda from totalRealPrice if available, otherwise fallback
  const currency =
    totalRealPrice?.moneda || goodwePlant?.kpi?.currency || "EUR";

  const incomeMetrics = [
    {
      icon: Wallet,
      title: "dayIncome",
      tooltip: "dayIncomeTooltip",
      value: `${formatValue(totalRealPrice?.hoy?.ingreso)} ${
        totalRealPrice?.moneda || goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
    {
      icon: PiggyBank,
      title: "monthlyIncome",
      tooltip: "monthlyIncomeTooltip",
      value: `${formatValue(totalRealPrice?.mes_actual?.ingreso)} ${
        totalRealPrice?.moneda || goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
    {
      icon: BarChart2,
      title: "totalIncome",
      tooltip: "totalIncomeTooltip",
      value: `${formatValue(totalRealPrice?.total?.ingreso)} ${
        totalRealPrice?.moneda || goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
  ];

  const savingsMetrics = [
    {
      icon: Coins,
      title: "daySavings",
      tooltip: "daySavingsTooltip",
      value: `${formatValue(totalRealPrice?.hoy?.ahorro)} ${
        totalRealPrice?.moneda || goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
    {
      icon: CreditCard,
      title: "monthlySavings",
      tooltip: "monthlySavingsTooltip",
      value: `${formatValue(totalRealPrice?.mes_actual?.ahorro)} ${
        totalRealPrice?.moneda || goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
    {
      icon: TrendingUp,
      title: "totalSavings",
      tooltip: "totalSavingsTooltip",
      value: `${formatValue(totalRealPrice?.total?.ahorro)} ${
        totalRealPrice?.moneda || goodwePlant?.kpi?.currency || "EUR"
      }`,
    },
  ];

  // Combine both metric arrays
  const allMetrics = [...incomeMetrics, ...savingsMetrics];

  return (
    <section className="flex-1 xl:min-w-[40vw] bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm mb-6">
      <h2 className="text-xl mb-6 text-custom-dark-blue dark:text-custom-yellow">
        {t("performanceMetrics")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {incomeMetrics.map(
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

      <h3 className="text-lg mb-4 text-custom-dark-blue dark:text-custom-yellow">
        {t("savings")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {savingsMetrics.map(
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
