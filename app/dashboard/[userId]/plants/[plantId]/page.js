"use client";

import { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearPlantDetails,
  fetchPlantDetails,
  selectLoadingDetails,
  selectPlantDetails,
  selectPlants,
  selectDetailsError,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import GoodwePlantDetails from "@/components/PlantDetails/GoodwePlantDetails";
import SolarEdgePlantDetails from "@/components/PlantDetails/SolarEdgePlantDetails";
import Loading from "@/components/Loading";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { IoArrowBackCircle } from "react-icons/io5";
import { BiRefresh } from "react-icons/bi";
import Texture from "@/components/Texture";
import PageTransition from "@/components/PageTransition";

const PlantDetailsPage = ({ params }) => {
  const { plantId, userId } = params;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const user = useSelector(selectUser);
  const plantsList = useSelector(selectPlants);
  const detailedPlant = useSelector(selectPlantDetails);
  const isLoadingDetails = useSelector(selectLoadingDetails);
  const detailsError = useSelector(selectDetailsError);

  const [showLoading, setShowLoading] = useState(false);
  const hasFetched = useRef(false);
  const retryTimeoutRef = useRef(null);
  const fetchAttempts = useRef(0);
  const MAX_RETRY_ATTEMPTS = 3;

  const normalizedPlantId = useMemo(() => plantId?.toString(), [plantId]);
  const userToken = useMemo(() => user?.tokenIdentificador, [user]);

  const currentPlant = useMemo(
    () =>
      plantsList?.find((plant) => plant?.id?.toString() === normalizedPlantId),
    [plantsList, normalizedPlantId]
  );

  const provider = useMemo(() => {
    if (typeof window === "undefined") return "unknown";

    const pathParts = window.location.pathname.toLowerCase().split("/");
    const providerInPath = pathParts.find((part) =>
      ["solaredge", "goodwe"].includes(part)
    );

    if (providerInPath) return providerInPath;
    if (currentPlant?.organization) {
      return currentPlant.organization.toLowerCase().trim();
    }

    return "unknown";
  }, [currentPlant?.organization]);

  const isPlantDataIncomplete = useCallback((plant) => {
    if (!plant || !plant.data || !plant.data.details) return true;
    const details = plant.data.details;
    return (
      !details.name ||
      !details.status ||
      details.name === null ||
      details.status === null
    );
  }, []);

  const handleDataFetch = useCallback(() => {
    if (!userToken || !normalizedPlantId || provider === "unknown") return;

    fetchAttempts.current += 1;
    hasFetched.current = true;

    dispatch(
      fetchPlantDetails({
        userId,
        token: userToken,
        plantId: normalizedPlantId,
        provider,
      })
    );
  }, [dispatch, userToken, normalizedPlantId, provider, userId]);

  const handleRefresh = useCallback(() => {
    fetchAttempts.current = 0;
    hasFetched.current = false;
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    handleDataFetch();
  }, [handleDataFetch]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      hasFetched.current = false;
      dispatch(clearPlantDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      !isLoadingDetails &&
      detailedPlant &&
      isPlantDataIncomplete(detailedPlant)
    ) {
      if (fetchAttempts.current < MAX_RETRY_ATTEMPTS) {
        console.log(
          `Incomplete plant data detected. Retry attempt ${
            fetchAttempts.current + 1
          } of ${MAX_RETRY_ATTEMPTS}`
        );

        retryTimeoutRef.current = setTimeout(() => {
          handleDataFetch();
        }, 2000);
      } else {
        console.error(
          "Max retry attempts reached. Plant data still incomplete:",
          detailedPlant
        );
      }
    }
  }, [detailedPlant, isLoadingDetails, handleDataFetch, isPlantDataIncomplete]);

  useEffect(() => {
    if (
      !hasFetched.current &&
      provider !== "unknown" &&
      userToken &&
      normalizedPlantId &&
      !isLoadingDetails
    ) {
      handleDataFetch();
    }
  }, [
    provider,
    userToken,
    normalizedPlantId,
    isLoadingDetails,
    handleDataFetch,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoading(isLoadingDetails);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [isLoadingDetails]);

  const renderError = useCallback(
    () => (
      <>
        <Texture />
        <button onClick={() => window.history.back()}>
          <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4" />
        </button>
        <div className="h-auto w-full flex flex-col justify-center items-center">
          <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
          <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
            {detailsError || t("plantDataNotFound")}
          </p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow hover:scale-105 transition-transform mt-4"
            disabled={showLoading}
          >
            <BiRefresh
              className={`text-2xl ${showLoading ? "animate-spin" : ""}`}
            />
            <span>{t("refresh")}</span>
          </button>
        </div>
      </>
    ),
    [detailsError, handleRefresh, showLoading, t]
  );

  const renderContent = useMemo(() => {
    if (!detailedPlant && showLoading) {
      return (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      );
    }

    if (
      detailsError ||
      (fetchAttempts.current >= MAX_RETRY_ATTEMPTS &&
        isPlantDataIncomplete(detailedPlant))
    ) {
      return renderError();
    }

    if (detailedPlant && !isPlantDataIncomplete(detailedPlant)) {
      const props = {
        plant: detailedPlant,
        handleRefresh,
        isLoading: showLoading,
      };

      switch (provider) {
        case "goodwe":
          return <GoodwePlantDetails {...props} />;
        case "solaredge":
          return <SolarEdgePlantDetails {...props} />;
        default:
          return renderError();
      }
    }

    return renderError();
  }, [
    detailedPlant,
    detailsError,
    handleRefresh,
    showLoading,
    provider,
    renderError,
    isPlantDataIncomplete,
  ]);

  return (
    <PageTransition>
      <div className="min-h-screen">{renderContent}</div>
    </PageTransition>
  );
};

export default PlantDetailsPage;
