import React, { useEffect } from "react";
import { PiSunHorizon } from "react-icons/pi";
import { BsCalendar2Month } from "react-icons/bs";
import { IoAnalyticsOutline, IoCashOutline } from "react-icons/io5";
import { FaEuroSign } from "react-icons/fa";
import {
  RiMoneyDollarCircleLine,
  RiSafe2Line,
  RiLineChartLine,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import EnergyStatisticsSkeleton from "@/components/loadingSkeletons/EnergyStatisticsSkeleton";
import {
  fetchTotalRealPrice,
  selectTotalRealPrice,
  selectTotalRealPriceLoading,
  selectTotalRealPriceError,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { formatLargeNumber } from "@/utils/numbers";
import { useParams } from "next/navigation";
import useDeviceType from "@/hooks/useDeviceType";

const SolarEdgeEnergyStatistics = ({
  plant,
  t,
  theme,
  token,
  batteryLevel,
}) => {
  const dispatch = useDispatch();
  const totalRealPrice = useSelector(selectTotalRealPrice);
  const totalRealPriceLoading = useSelector(selectTotalRealPriceLoading);
  const totalRealPriceError = useSelector(selectTotalRealPriceError);
  const user = useSelector(selectUser);
  const { plantId } = useParams();
  const { isTablet } = useDeviceType();

  useEffect(() => {
    if (plantId) {
      dispatch(
        fetchTotalRealPrice({
          plantId: plantId,
          provider: "solaredge",
          token: user.tokenIdentificador,
        })
      );
    }
  }, [dispatch, plantId, token, user.tokenIdentificador]);

  if (totalRealPriceLoading) {
    return <EnergyStatisticsSkeleton theme={theme} />;
  }

  console.log("totalRealPrice in component:", totalRealPrice);

  // Calculate energy values from the income data (can be adjusted based on actual data relationships)
  const energyToday = totalRealPrice?.hoy?.energia_kwh || 0;
  const energyMonth = totalRealPrice?.mes_actual?.energia_kwh || 0;
  const energyTotal = totalRealPrice?.total?.energia_kwh || 0;
  const incomeToday = totalRealPrice?.hoy?.ingreso || 0;
  const incomeMonth = totalRealPrice?.mes_actual?.ingreso || 0;
  const incomeTotal = totalRealPrice?.total?.ingreso || 0;
  const savingsToday = totalRealPrice?.hoy?.ahorro || 0;
  const savingsMonth = totalRealPrice?.mes_actual?.ahorro || 0;
  const savingsTotal = totalRealPrice?.total?.ahorro || 0;

  // Get currency from total real price data
  const currency = totalRealPrice?.moneda || "€";

  // Create the stats array with conditional filtering for tablets
  let stats = [
    // Energy metrics
    {
      icon: PiSunHorizon,
      title: t("energyToday"),
      value: energyToday,
      unit: "kW",
      category: "energy",
    },
    {
      icon: BsCalendar2Month,
      title: t("energyThisMonth"),
      value: energyMonth,
      unit: "kW",
      category: "energy",
    },
    {
      icon: IoAnalyticsOutline,
      title: t("energyTotal"),
      value: energyTotal,
      unit: "kW",
      category: "energy",
      hideOnTablet: true,
    },
    // Income metrics
    {
      icon: FaEuroSign,
      title: t("todayIncome"),
      value: incomeToday,
      unit: currency,
      category: "income",
    },
    {
      icon: IoCashOutline,
      title: t("monthlyIncome"),
      value: incomeMonth,
      unit: currency,
      category: "income",
    },
    {
      icon: IoCashOutline,
      title: t("totalIncome"),
      value: incomeTotal,
      unit: currency,
      category: "income",
    },
    // New savings metrics
    {
      icon: RiMoneyDollarCircleLine,
      title: t("daySavings"),
      value: savingsToday,
      unit: currency,
      category: "savings",
    },
    {
      icon: RiSafe2Line,
      title: t("monthlySavings"),
      value: savingsMonth,
      unit: currency,
      category: "savings",
    },
    {
      icon: RiLineChartLine,
      title: t("totalSavings"),
      value: savingsTotal,
      unit: currency,
      category: "savings",
    },
  ];

  // Filter out the "Energy Total" item if on tablet
  if (isTablet) {
    stats = stats.filter((item) => !item.hideOnTablet);
  }

  return (
    <section
      className={`flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg ${
        batteryLevel > 0 ? "xl:min-w-[40vw]" : "xl:min-w-[calc(50%-36px)]"
      }`}
    >
      <h2 className="text-xl mb-6 text-left text-custom-dark-blue dark:text-custom-yellow">
        {t("energyStatistics")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map(({ icon: Icon, title, value, unit }, index) => (
          <div
            key={index}
            className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700"
          >
            <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
              <Icon className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
            </div>
            <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
              {title}
            </p>
            <div className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
              <span
                className="text-xl font-bold truncate max-w-[120px]"
                title={`${value} ${unit}`}
              >
                {formatLargeNumber(value)}
              </span>
              <span className="text-sm">{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SolarEdgeEnergyStatistics;
