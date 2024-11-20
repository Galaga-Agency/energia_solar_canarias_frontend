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

  useEffect(() => {
    return () => dispatch(clearPlantDetails());
  }, [dispatch]);

  const normalizedPlantId = plantId?.toString();

  const currentPlant = plantsList?.find(
    (plant) => plant?.id?.toString() === normalizedPlantId
  );

  const determineProvider = () => {
    const pathParts = window.location.pathname.toLowerCase().split("/");
    const providerInPath = pathParts.find((part) =>
      ["solaredge", "goodwe"].includes(part)
    );

    if (providerInPath) {
      return providerInPath;
    }

    if (currentPlant?.organization) {
      const provider = currentPlant.organization.toLowerCase();
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

  useEffect(() => {
    if (
      !isLoadingDetails &&
      provider !== "unknown" &&
      (!detailedPlant || detailedPlant.id?.toString() !== normalizedPlantId)
    ) {
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
