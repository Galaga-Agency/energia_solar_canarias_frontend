import React, { useEffect } from "react";
import { PiSunHorizon } from "react-icons/pi";
import { BsCalendar2Month } from "react-icons/bs";
import { IoAnalyticsOutline, IoCashOutline } from "react-icons/io5";
import { GiSpeedometer } from "react-icons/gi";
import { FaEuroSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import EnergyStatisticsSkeleton from "@/components/LoadingSkeletons/EnergyStatisticsSkeleton";
import {
  fetchSolarEdgeOverview,
  selectOverviewLoading,
  selectPlantOverview,
} from "@/store/slices/plantsSlice";

const formatLargeNumber = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + "K";
  }
  return value.toFixed(2);
};

const EnergyStatistics = ({ plant, t, theme, token }) => {
  const dispatch = useDispatch();
  const overviewData = useSelector(selectPlantOverview);
  const overviewLoading = useSelector(selectOverviewLoading);

  useEffect(() => {
    if (plant?.id) {
      dispatch(fetchSolarEdgeOverview({ plantId: plant.id, token }));
    }
  }, [dispatch, plant?.id, token]);

  if (overviewLoading) {
    return <EnergyStatisticsSkeleton theme={theme} />;
  }

  const stats = [
    {
      icon: PiSunHorizon,
      title: t("energyToday"),
      value: overviewData?.overview?.lastDayData?.energy || 0,
      unit: "kW",
    },
    {
      icon: BsCalendar2Month,
      title: t("energyThisMonth"),
      value: overviewData?.overview?.lastMonthData?.energy || 0,
      unit: "kW",
    },
    {
      icon: IoAnalyticsOutline,
      title: t("energyTotal"),
      value: overviewData?.overview?.lifeTimeData?.energy || 0,
      unit: "kW",
    },
    {
      icon: FaEuroSign,
      title: t("todayMoney"),
      value: overviewData?.overview?.lastDayData?.revenue || 0,
      unit: "€",
    },
    {
      icon: IoCashOutline,
      title: t("totalMoney"),
      value: overviewData?.overview?.lifeTimeData?.revenue || 0,
      unit: "€",
    },
    {
      icon: GiSpeedometer,
      title: t("maxPower"),
      value: plant?.peakPower || 0,
      unit: "kW",
    },
  ];

  return (
    <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl mb-6 text-left text-custom-dark-blue dark:text-custom-yellow">
        {t("energyStatistics")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
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

export default EnergyStatistics;
