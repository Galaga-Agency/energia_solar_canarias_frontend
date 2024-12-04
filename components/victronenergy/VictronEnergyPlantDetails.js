"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlantDetails,
  selectPlantDetails,
  selectLoadingDetails,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { IoArrowBackCircle } from "react-icons/io5";
import PageTransition from "@/components/PageTransition";
import Loading from "@/components/ui/Loading";
import VictronEnergyFlow from "@/components/victronenergy/VictronEnergyFlow";
import { useTranslation } from "next-i18next";

const VictronEnergyPlantDetails = ({ plantId, userId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const plant = useSelector(selectPlantDetails);
  const isLoadingDetails = useSelector(selectLoadingDetails);

  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );
  const [isFetching, setIsFetching] = useState(false);

  const fetchRealtimeData = useCallback(async () => {
    if (!plantId || !userId || !user?.tokenIdentificador) return;

    try {
      setIsFetching(true);
      await dispatch(
        fetchPlantDetails({
          plantId,
          userId,
          provider: "victronenergy",
          token: user.tokenIdentificador,
        })
      ).unwrap();
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching plant details:", err);
    } finally {
      setIsFetching(false);
    }
  }, [dispatch, plantId, userId, user?.tokenIdentificador]);

  useEffect(() => {
    fetchRealtimeData();
    const intervalId = setInterval(fetchRealtimeData, 15000);
    return () => clearInterval(intervalId);
  }, [fetchRealtimeData]);

  const energyData = useMemo(() => {
    if (!plant) return {};
    const extended = plant?.data?.records?.[0]?.extended || [];
    const findAttribute = (code) =>
      extended.find((attr) => attr.code === code)?.formattedValue || "N/A";

    return {
      acInput: findAttribute("ac_input"),
      generator: findAttribute("generator"),
      soc: findAttribute("bs"),
      batteryVoltage: findAttribute("bv"),
      batteryCurrent: findAttribute("bc"),
      temperature: findAttribute("temperature"),
      solarYield: findAttribute("solar_yield"),
      load: findAttribute("consumption"),
      inverterStatus: findAttribute("inverter_status"),
    };
  }, [plant]);

  if (isLoadingDetails && !plant) {
    return (
      <PageTransition>
        <div className="h-screen flex items-center justify-center">
          <Loading />
        </div>
      </PageTransition>
    );
  }

  if (!plant) {
    return (
      <PageTransition>
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg text-custom-dark-blue dark:text-custom-yellow">
            {t("plantDataNotFound")}
          </p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen p-6 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Back Button */}
        <button onClick={() => window.history.back()}>
          <IoArrowBackCircle className="text-4xl text-custom-dark-blue dark:text-custom-yellow mb-4" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-custom-dark-blue dark:text-custom-yellow">
            {plant?.data?.records?.[0]?.name || t("loading")}
          </h1>
        </div>

        {/* Energy Flow Section */}
        <VictronEnergyFlow
          energyData={energyData}
          fetchRealtimeData={fetchRealtimeData}
          isFetching={isFetching}
        />
      </div>
    </PageTransition>
  );
};

export default VictronEnergyPlantDetails;
