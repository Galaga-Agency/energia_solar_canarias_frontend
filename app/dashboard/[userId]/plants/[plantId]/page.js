"use client";

import { useEffect, useMemo, useCallback } from "react";
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
  const user = useSelector(selectUser);
  const plantsList = useSelector(selectPlants);
  const detailedPlant = useSelector(selectPlantDetails);
  const isLoadingDetails = useSelector(selectLoadingDetails);
  const detailsError = useSelector(selectDetailsError);
  const { t } = useTranslation();

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
    if (currentPlant?.organization)
      return currentPlant.organization.toLowerCase();

    return "unknown";
  }, [currentPlant]);

  const handleRefresh = useCallback(() => {
    if (!userToken || !normalizedPlantId || provider === "unknown") return;

    dispatch(
      fetchPlantDetails({
        userId,
        token: userToken,
        plantId: normalizedPlantId,
        provider,
      })
    );
  }, [dispatch, userToken, normalizedPlantId, provider, userId]);

  // Initial data fetch
  useEffect(() => {
    const shouldFetch =
      provider !== "unknown" &&
      userToken &&
      normalizedPlantId &&
      (!detailedPlant || detailedPlant.id?.toString() !== normalizedPlantId);

    if (shouldFetch && !isLoadingDetails) {
      handleRefresh();
    }
  }, [
    provider,
    userToken,
    normalizedPlantId,
    detailedPlant,
    handleRefresh,
    isLoadingDetails,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => dispatch(clearPlantDetails());
  }, [dispatch]);

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
            disabled={isLoadingDetails}
          >
            <BiRefresh
              className={`text-2xl ${isLoadingDetails ? "animate-spin" : ""}`}
            />
            <span>{t("refresh")}</span>
          </button>
        </div>
      </>
    ),
    [detailsError, handleRefresh, isLoadingDetails, t]
  );

  const renderContent = useCallback(() => {
    // Only show loading on initial fetch
    if (!detailedPlant && isLoadingDetails) {
      return (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      );
    }

    if (detailsError) {
      return renderError();
    }

    if (detailedPlant) {
      const props = {
        plant: detailedPlant,
        handleRefresh,
        isLoading: isLoadingDetails,
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
  }, [detailedPlant, detailsError, handleRefresh, isLoadingDetails, provider]);

  return (
    <PageTransition>
      <div className="min-h-screen">{renderContent()}</div>
    </PageTransition>
  );
};

export default PlantDetailsPage;
