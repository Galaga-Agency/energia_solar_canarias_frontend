"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPlantDetails,
  selectPlantDetails,
  selectLoadingDetails,
  selectDetailsError,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import GoodwePlantDetails from "@/components/goodwe/GoodwePlantDetails";
import SolarEdgePlantDetails from "@/components/solaredge/SolarEdgePlantDetails";
import VictronEnergyPlantDetails from "@/components/victronenergy/VictronEnergyPlantDetails";
import Loading from "@/components/ui/Loading";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { IoArrowBackCircle } from "react-icons/io5";
import Texture from "@/components/Texture";
import TransitionEffect from "@/components/TransitionEffect";
import BottomNavbar from "@/components/BottomNavbar";

const PlantDetailsPage = ({ params }) => {
  const { plantId, userId, provider } = params;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const detailedPlant = useSelector(selectPlantDetails);
  const isLoadingDetails = useSelector(selectLoadingDetails);
  const detailsError = useSelector(selectDetailsError);

  useEffect(() => {
    if (user?.tokenIdentificador && plantId && provider) {
      dispatch(
        fetchPlantDetails({
          userId,
          token: user.tokenIdentificador,
          plantId,
          provider,
        })
      );
    }
  }, [dispatch, plantId, provider, userId, user?.tokenIdentificador]);

  const renderError = () => (
    <div className="min-h-screen p-6 w-auto">
      <Texture />
      <button onClick={() => window.history.back()}>
        <IoArrowBackCircle className="text-4xl font-primary text-custom-dark-blue dark:text-custom-yellow mb-1 mr-4" />
      </button>
      <div className="h-auto w-full flex flex-col justify-center items-center">
        <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
        <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray mb-4">
          {t("plantDataNotFound")}
        </p>
      </div>
    </div>
  );

  if (isLoadingDetails || !detailedPlant) {
    return (
      <div className="h-screen w-screen">
        <Loading />
      </div>
    );
  }

  if (detailsError) {
    return renderError();
  }

  const renderProviderComponent = () => {
    const props = {
      plant: detailedPlant,
      isLoading: false,
    };

    switch (provider.toLowerCase()) {
      case "goodwe":
        return <GoodwePlantDetails {...props} />;
      case "solaredge":
        return <SolarEdgePlantDetails {...props} />;
      case "victronenergy":
        return <VictronEnergyPlantDetails {...props} />;
      default:
        return renderError();
    }
  };

  return (
    <div className="min-h-screen flex flex-col light:bg-gradient-to-b light:from-gray-200 light:to-custom-dark-gray dark:bg-gray-900 relative overflow-y-auto custom-scrollbar pb-12">
      <TransitionEffect />
      {renderProviderComponent()}
      <BottomNavbar userId={user?.id} userClass={user?.clase} />
    </div>
  );
};

export default PlantDetailsPage;
