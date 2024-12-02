import React, { useEffect } from "react";
import { PiSunHorizon } from "react-icons/pi";
import { BsCalendar2Month } from "react-icons/bs";
import { IoAnalyticsOutline, IoCashOutline } from "react-icons/io5";
import { GiSpeedometer } from "react-icons/gi";
import { FaEuroSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSolarEdgeOverview,
  selectOverviewLoading,
  selectPlantOverview,
} from "@/store/slices/plantsSlice";
import EnergyStatisticsSkeleton from "./LoadingSkeletons/EnergyStatisticsSkeleton";
import { over } from "lodash";

const EnergyStatistics = ({
  solaredgePlant,
  t,
  theme,
  formatValueWithDecimals,
  token,
}) => {
  const dispatch = useDispatch();
  const overviewData = useSelector(selectPlantOverview);
  const overviewLoading = useSelector(selectOverviewLoading);

  console.log("My overview data in the component: ", overviewData);

  useEffect(() => {
    if (solaredgePlant?.id) {
      dispatch(fetchSolarEdgeOverview({ plantId: solaredgePlant.id, token }));
    }
  }, []);

  if (overviewLoading) {
    return <EnergyStatisticsSkeleton theme={theme} />;
  }

  return (
    <section className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mb-6 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl mb-6 text-left text-custom-dark-blue dark:text-custom-yellow">
        {t("energyStatistics")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Energy Today Card */}
        <div className="relative group text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700 group-hover:duration-[1200ms] group-hover:scale-120">
          <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-700 group-hover:duration-[1200ms] group-hover:scale-120">
            <PiSunHorizon className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </div>
          <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
            {t("energyToday")}
          </p>
          <p className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
            {formatValueWithDecimals(
              overviewData?.overview?.lastDayData?.energy || 0,
              "kW"
            )
              .split(" ")
              .map((item, index) => (
                <span
                  key={index}
                  className={index === 0 ? "text-xl font-bold" : "text-sm"}
                >
                  {item}
                </span>
              ))}
          </p>
        </div>

        {/* Energy This Month Card */}
        <div className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700 group-hover:duration-[1200ms] group-hover:scale-120">
          <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
            <BsCalendar2Month className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </div>
          <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
            {t("energyThisMonth")}
          </p>
          <p className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
            {formatValueWithDecimals(
              overviewData?.overview?.lastMonthData?.energy || 0,
              "kW"
            )
              .split(" ")
              .map((item, index) => (
                <span
                  key={index}
                  className={index === 0 ? "text-xl font-bold" : "text-sm"}
                >
                  {item}
                </span>
              ))}
          </p>
        </div>

        {/* Energy Total Card */}
        <div className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700 group-hover:duration-[1200ms] group-hover:scale-120">
          <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
            <IoAnalyticsOutline className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </div>
          <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
            {t("energyTotal")}
          </p>
          <p className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
            {formatValueWithDecimals(
              overviewData?.overview?.lifeTimeData?.energy || 0,
              "kW"
            )
              .split(" ")
              .map((item, index) => (
                <span
                  key={index}
                  className={index === 0 ? "text-xl font-bold" : "text-sm"}
                >
                  {item}
                </span>
              ))}
          </p>
        </div>

        {/* Today Money Card */}
        <div className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700 group-hover:duration-[1200ms] group-hover:scale-120">
          <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
            <FaEuroSign className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </div>
          <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
            {t("todayMoney")}
          </p>
          <p className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
            {formatValueWithDecimals(
              overviewData?.overview?.lastDayData?.revenue || 0,
              "€"
            )
              .split(" ")
              .map((item, index) => (
                <span
                  key={index}
                  className={index === 0 ? "text-xl font-bold" : "text-sm"}
                >
                  {item}
                </span>
              ))}
          </p>
        </div>

        {/* Total Money Card */}
        <div className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700 group-hover:duration-[1200ms] group-hover:scale-120">
          <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
            <IoCashOutline className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </div>
          <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
            {t("totalMoney")}
          </p>
          <p className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
            {formatValueWithDecimals(
              overviewData?.overview?.lifeTimeData?.revenue || 0,
              "€"
            )
              .split(" ")
              .map((item, index) => (
                <span
                  key={index}
                  className={index === 0 ? "text-xl font-bold" : "text-sm"}
                >
                  {item}
                </span>
              ))}
          </p>
        </div>

        {/* Max Power Card */}
        <div className="relative text-center bg-slate-50 dark:bg-slate-700/50 p-5 rounded-lg shadow-md flex flex-col items-center gap-3 hover:scale-105 transform transition-transform duration-700 group-hover:duration-[1200ms] group-hover:scale-120">
          <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] absolute -top-6 w-14 h-14 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
            <GiSpeedometer className="text-2xl text-custom-dark-blue dark:text-custom-yellow" />
          </div>
          <p className="mt-6 text-base font-medium text-slate-600 dark:text-slate-300">
            {t("maxPower")}
          </p>
          <p className="text-custom-dark-blue dark:text-custom-yellow flex items-baseline gap-1">
            {formatValueWithDecimals(solaredgePlant?.peakPower || 0, "kW")
              .split(" ")
              .map((item, index) => (
                <span
                  key={index}
                  className={index === 0 ? "text-xl font-bold" : "text-sm"}
                >
                  {item}
                </span>
              ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnergyStatistics;
