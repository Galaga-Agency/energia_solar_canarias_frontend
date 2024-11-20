"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearPlantDetails,
  fetchPlantDetails,
  selectLoading,
  selectLoadingDetails,
  selectPlantDetails,
  selectPlants,
  selectLoadingAny,
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
  const isLoading = useSelector(selectLoading);
  const isLoadingDetails = useSelector(selectLoadingDetails);
  const detailsError = useSelector(selectDetailsError);
  const { t } = useTranslation();

  // Clear only on unmount
  useEffect(() => {
    return () => dispatch(clearPlantDetails());
  }, [dispatch]);

  const normalizedPlantId = plantId?.toString();

  console.log("Normalized Plant ID:", normalizedPlantId);

  const currentPlant = plantsList?.find(
    (plant) => plant?.id?.toString() === normalizedPlantId
  );

  console.log("Current Plant:", currentPlant);

  // Determine provider from various sources
  const determineProvider = () => {
    // First check URL path
    const pathParts = window.location.pathname.toLowerCase().split("/");
    const providerInPath = pathParts.find((part) =>
      ["solaredge", "goodwe"].includes(part)
    );

    if (providerInPath) {
      console.log("Provider from URL:", providerInPath);
      return providerInPath;
    }

    // Then check current plant
    if (currentPlant?.organization) {
      const provider = currentPlant.organization.toLowerCase();
      console.log("Provider from current plant:", provider);
      return provider;
    }

    console.log("Provider not found in URL or current plant");
    return "unknown";
  };

  const provider = determineProvider();

  const handleRefresh = () => {
    if (
      !user?.tokenIdentificador ||
      !normalizedPlantId ||
      provider === "unknown"
    ) {
      console.warn("Missing required data for refresh:", {
        hasToken: !!user?.tokenIdentificador,
        plantId: normalizedPlantId,
        provider,
      });
      return;
    }

    dispatch(
      fetchPlantDetails({
        userId,
        token: user.tokenIdentificador,
        plantId: normalizedPlantId,
        provider,
      })
    );
  };

  // Fetch details when needed
  useEffect(() => {
    // Only fetch if we have the necessary data and aren't already loading
    if (
      !isLoadingDetails &&
      provider !== "unknown" &&
      (!detailedPlant || detailedPlant.id?.toString() !== normalizedPlantId)
    ) {
      console.log("Fetching plant details:", {
        plantId: normalizedPlantId,
        provider,
        currentPlant,
      });
      handleRefresh();
    }
  }, [normalizedPlantId, provider, detailedPlant, isLoadingDetails]);

  const renderError = () => (
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
  );

  const renderContent = () => {
    if (isLoadingDetails && !detailedPlant) {
      console.log("Showing loading state");
      return (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      );
    }

    if (detailsError) {
      console.log("Showing error state:", detailsError);
      return renderError();
    }

    if (detailedPlant) {
      console.log("Rendering plant details for provider:", provider);

      switch (provider) {
        case "goodwe":
          return (
            <GoodwePlantDetails
              plant={detailedPlant}
              handleRefresh={handleRefresh}
            />
          );
        case "solaredge":
          return (
            <SolarEdgePlantDetails
              plant={detailedPlant}
              handleRefresh={handleRefresh}
            />
          );
        default:
          console.warn("Unknown provider:", provider);
          return renderError();
      }
    }

    // Fallback to error if we have no data
    return renderError();
  };

  return (
    <PageTransition>
      <div className="min-h-screen">{renderContent()}</div>
    </PageTransition>
  );
};

export default PlantDetailsPage;
