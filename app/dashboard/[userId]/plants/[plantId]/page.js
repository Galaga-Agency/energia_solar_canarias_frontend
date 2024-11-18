"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPlantDetails,
  selectPlantDetails,
  selectPlants,
} from "@/store/slices/plantsSlice";
import GoodwePlantDetails from "@/components/PlantDetails/GoodwePlantDetails";
import SolarEdgePlantDetails from "@/components/PlantDetails/SolarEdgePlantDetails";
import { selectUser } from "@/store/slices/userSlice";

const PlantDetailsPage = ({ params }) => {
  const { plantId, userId } = params;
  const dispatch = useDispatch();
  const plant = useSelector(selectPlantDetails);
  const plantsList = useSelector(selectPlants);
  const user = useSelector(selectUser);
  const currentPlant = plantsList.find((p) => p.id === plantId);
  const provider = currentPlant?.organization?.toLowerCase();

  useEffect(() => {
    if (user?.tokenIdentificador && plantId && provider) {
      dispatch(
        fetchPlantDetails({
          userId,
          token: user?.tokenIdentificador,
          plantId,
          proveedor: provider,
        })
      );
    }

    console.log("object passed: ", {
      userId,
      token: user?.tokenIdentificador,
      plantId,
      proveedor: provider,
    });
  }, [dispatch, plantId, userId, provider, user?.tokenIdentificador]);

  console.log("current plant selected: ", currentPlant);
  console.log("current provider: ", provider);

  const renderProviderDetails = () => {
    if (!plant) return null;

    switch (provider) {
      case "goodwe":
        return <GoodwePlantDetails plant={plant} />;
      case "solaredge":
        return <SolarEdgePlantDetails plant={plant} />;
      default:
        return null;
    }
  };

  return <div className="min-h-screen p-6">{renderProviderDetails()}</div>;
};

export default PlantDetailsPage;
