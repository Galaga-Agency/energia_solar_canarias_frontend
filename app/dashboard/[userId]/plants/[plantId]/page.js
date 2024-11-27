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
  const [shouldShowError, setShouldShowError] = useState(false);
  const hasFetched = useRef(false);

  const normalizedPlantId = useMemo(() => plantId?.toString(), [plantId]);
  const userToken = useMemo(() => user?.tokenIdentificador, [user]);

  const listViewPlant = useMemo(
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
    if (listViewPlant?.organization) {
      return listViewPlant.organization.toLowerCase().trim();
    }

    return "unknown";
  }, [listViewPlant?.organization]);

  const hasOnlyOrganizationField = useCallback((plant) => {
    if (!plant?.data?.details) return false;
    const details = plant.data.details;
    return Object.keys(details).length === 1 && details.organization;
  }, []);

  const createEnhancedPlantData = useCallback(() => {
    if (!listViewPlant || !detailedPlant) return null;

    // Parse the address components from the list view
    const [streetAddress, city, country] =
      listViewPlant.address?.split(", ") || [];

    return {
      ...detailedPlant,
      data: {
        details: {
          ...listViewPlant,
          location: {
            address: streetAddress || "",
            city: city || "",
            country: country || "",
          },
          installationDate: listViewPlant.installation_date,
          organization: provider,
          primary_module: listViewPlant.primary_module || {},
          public_settings: listViewPlant.public_settings || { isPublic: false },
        },
      },
    };
  }, [listViewPlant, detailedPlant, provider]);

  const handleDataFetch = useCallback(() => {
    if (!userToken || !normalizedPlantId || provider === "unknown") return;

    hasFetched.current = true;
    setShouldShowError(false);

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
    hasFetched.current = false;
    setShouldShowError(false);
    handleDataFetch();
  }, [handleDataFetch]);

  // Initial data fetch
  useEffect(() => {
    if (
      !hasFetched.current &&
      provider !== "unknown" &&
      userToken &&
      normalizedPlantId
    ) {
      handleDataFetch();
    }
  }, [provider, userToken, normalizedPlantId, handleDataFetch]);

  // Error state management
  useEffect(() => {
    let timeoutId;
    if (
      detailsError ||
      (hasOnlyOrganizationField(detailedPlant) && !listViewPlant)
    ) {
      timeoutId = setTimeout(() => {
        setShouldShowError(true);
      }, 500);
    } else {
      setShouldShowError(false);
    }
    return () => clearTimeout(timeoutId);
  }, [detailsError, detailedPlant, listViewPlant, hasOnlyOrganizationField]);

  // Loading state management
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoading(isLoadingDetails);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [isLoadingDetails]);

  // Cleanup
  useEffect(() => {
    return () => {
      hasFetched.current = false;
      dispatch(clearPlantDetails());
    };
  }, [dispatch]);

  const renderError = useCallback(
    () => (
      <div className="min-h-screen p-6 w-auto">
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
      </div>
    ),
    [detailsError, handleRefresh, showLoading, t]
  );

  const renderContent = useMemo(() => {
    // Show loading state during initial load or when loading details
    if (isLoadingDetails || (!detailedPlant && !shouldShowError)) {
      return (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      );
    }

    // Show error only after loading is complete and error is confirmed
    if (shouldShowError && !isLoadingDetails) {
      return renderError();
    }

    let plantData = detailedPlant;

    // Use enhanced data if we only have organization field
    if (hasOnlyOrganizationField(detailedPlant) && listViewPlant) {
      plantData = createEnhancedPlantData();
    }

    if (plantData) {
      const props = {
        plant: plantData,
        handleRefresh,
        isLoading: showLoading,
        isFallbackData: hasOnlyOrganizationField(detailedPlant),
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

    // Fallback to loading if we don't have data yet
    return (
      <div className="h-screen w-screen">
        <Loading />
      </div>
    );
  }, [
    isLoadingDetails,
    detailedPlant,
    shouldShowError,
    hasOnlyOrganizationField,
    listViewPlant,
    createEnhancedPlantData,
    handleRefresh,
    showLoading,
    provider,
    renderError,
  ]);

  return (
    <PageTransition>
      <div className="min-h-screen">{renderContent}</div>
    </PageTransition>
  );
};

export default PlantDetailsPage;
