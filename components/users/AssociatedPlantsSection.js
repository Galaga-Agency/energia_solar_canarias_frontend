import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import SimplePlantsListItem from "./SimplePlantsListItem";
import { FaPlus } from "react-icons/fa";
import { useParams } from "next/navigation";
import {
  fetchUserAssociatedPlants,
  dissociatePlantFromUser,
  selectAssociatedPlants,
  selectLoadingAssociatedPlants,
  selectErrorAssociatedPlants,
} from "@/store/slices/plantsSlice";
import ConfirmRemoveModal from "./ConfirmRemoveModal";
import Loading from "../ui/Loading";

const AssociatedPlantsSection = ({
  onRemovePlant,
  t,
  selectedUser,
  onAddPlantClick,
  token,
  userClass,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [plantToRemove, setPlantToRemove] = useState(null);
  const { userId } = useParams();

  const associatedPlants = useSelector(selectAssociatedPlants);
  const isLoading = useSelector(selectLoadingAssociatedPlants);
  const error = useSelector(selectErrorAssociatedPlants);

  useEffect(() => {
    if (selectedUser && token) {
      dispatch(fetchUserAssociatedPlants({ userId: selectedUser, token }));
    }
  }, [dispatch, selectedUser, token]);

  const handleRemovePlant = (plant) => {
    setPlantToRemove(plant);
    setIsConfirmModalOpen(true);
  };

  const confirmRemovePlant = async () => {
    try {
      await dispatch(
        dissociatePlantFromUser({
          userId: selectedUser,
          plantId: plantToRemove.id,
          provider: plantToRemove.organization.toLowerCase(),
          token,
        })
      ).unwrap();

      toast.success(t("plantDissociatedSuccessfully"));
    } catch (error) {
      toast.error(t("failedToDissociatePlant"));
    } finally {
      setPlantToRemove(null);
      setIsConfirmModalOpen(false);
    }
  };

  const redirectToPlantDetails = (plant) => {
    const provider = plant.organization;
    if (userId && provider) {
      window.location.href = `/dashboard/${userId}/plants/${provider}/${plant.id}`;
    } else {
      console.error("Missing userId or provider");
    }
  };

  const filteredPlants = associatedPlants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If user is admin, show special message instead of the plants list
  if (userClass === "admin") {
    return (
      <div className="bg-white/90 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm flex flex-col flex-grow h-[620px]">
        <h3 className="text-lg font-semibold font-secondary text-custom-dark-blue dark:text-custom-yellow mb-4">
          {t("associatedPlants")}
        </h3>
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-center p-4">
          {t("adminAllPlantsAccess")}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm flex flex-col flex-grow h-[620px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg  text-custom-dark-blue dark:text-custom-yellow">
          {t("associatedPlants")}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddPlantClick}
          className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/30"
        >
          <FaPlus />
        </motion.button>
      </div>
      <input
        type="text"
        placeholder={t("searchPlants")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 mb-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:border-custom-yellow focus:ring-2 focus:ring-custom-yellow"
      />
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {isLoading ? (
          <Loading />
        ) : filteredPlants.length > 0 ? (
          filteredPlants.map((plant) => (
            <div key={plant.id} className="relative group">
              <SimplePlantsListItem
                plant={plant}
                onClick={() => redirectToPlantDetails(plant)}
                t={t}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRemovePlant(plant)}
                className="absolute right-4 inset-y-0 my-auto h-8 opacity-0 group-hover:opacity-100 px-2 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-opacity"
              >
                {t("remove")}
              </motion.button>
            </div>
          ))
        ) : (
          <div className="flex items-center font-secondary justify-center h-full text-gray-500 dark:text-gray-400">
            {t("noAssociatedPlants")}
          </div>
        )}
      </div>

      {isConfirmModalOpen && (
        <ConfirmRemoveModal
          isOpen={isConfirmModalOpen}
          plant={plantToRemove}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmRemovePlant}
          t={t}
        />
      )}
    </div>
  );
};

export default AssociatedPlantsSection;
