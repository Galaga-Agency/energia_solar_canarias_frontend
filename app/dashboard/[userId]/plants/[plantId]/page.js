"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPlantDetails,
  selectLoading,
  selectPlantDetails,
  selectPlants,
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
  const plant = useSelector(selectPlantDetails);
  const plantsList = useSelector(selectPlants);
  const user = useSelector(selectUser);
  const currentPlant = plantsList?.find((p) => p.id === plantId);
  const provider = currentPlant?.organization?.toLowerCase();
  const { t } = useTranslation();
  const isLoading = useSelector(selectLoading);

  const handleRefresh = () => {
    if (user?.tokenIdentificador && plantId && provider && currentPlant) {
      dispatch(
        fetchPlantDetails({
          userId,
          token: user.tokenIdentificador,
          plantId,
          proveedor: provider,
        })
      );
    }
  };

  useEffect(() => {
    handleRefresh();
  }, [
    dispatch,
    plantId,
    userId,
    provider,
    user?.tokenIdentificador,
    currentPlant,
  ]);

  if (isLoading) return <Loading />;

  const renderError = () => (
    <>
      <Texture />
      <button onClick={() => window.history.back()}>
        <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4" />
      </button>
      <div className="h-auto w-full flex flex-col justify-center items-center">
        <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
        <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
          {t("plantDataNotFound")}
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-custom-dark-blue dark:text-custom-yellow hover:scale-105 transition-transform mt-4"
          disabled={isLoading}
        >
          <BiRefresh
            className={`text-2xl ${isLoading ? "animate-spin" : ""}`}
          />
          <span>{t("refresh")}</span>
        </button>
      </div>
    </>
  );

  const renderProviderDetails = () => {
    if (!provider || !currentPlant) return <Loading />;

    switch (provider) {
      case "goodwe":
        return (
          <GoodwePlantDetails plant={plant} handleRefresh={handleRefresh} />
        );
      case "solaredge":
        return (
          <SolarEdgePlantDetails plant={plant} handleRefresh={handleRefresh} />
        );
      default:
        return renderError();
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        {!plant && !isLoading ? renderError() : renderProviderDetails()}
      </div>
    </PageTransition>
  );
};

export default PlantDetailsPage;
