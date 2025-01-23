import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import {
  selectPlants,
  associatePlantToUser,
  fetchPlants,
} from "@/store/slices/plantsSlice";
import Texture from "@/components/Texture";
import SimplePlantsListItem from "./SimplePlantsListItem";
import { selectUser } from "@/store/slices/userSlice";

const AssociatePlantModal = ({ isOpen, onClose, selectedUser, token, t }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [associating, setAssociating] = useState(false);
  const plants = useSelector(selectPlants);
  const user = useSelector(selectUser);

  console.log(" plants available to associate: ", plants);

  const filteredPlants = (plants || []).filter((plant) =>
    plant.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(
      fetchPlants({
        userId: user.id,
        token: user.tokenIdentificador,
        page: 1,
        pageSize: 10000,
      })
    );
  }, [user, dispatch]);

  const handleAddPlant = async (plant) => {
    setAssociating(true);
    try {
      await dispatch(
        associatePlantToUser({
          userId: selectedUser,
          plantId: plant.id,
          provider: plant.organization.toLowerCase(),
          token,
        })
      ).unwrap();

      toast.success(t("plantAssociatedSuccessfully"));
      onClose();
    } catch (error) {
      toast.error(t("failedToAssociatePlant"));
    } finally {
      setAssociating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="relative w-full max-w-lg bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg p-6"
      backdropClass="backdrop-blur-sm"
    >
      <Texture className="opacity-30" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-4 text-custom-dark-blue dark:text-custom-yellow">
          {t("associatePlant")}
        </h3>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-custom-yellow focus:border-custom-yellow text-custom-dark-blue dark:text-custom-light-gray"
        />
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {associating ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-custom-yellow" />
            </div>
          ) : filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <SimplePlantsListItem
                key={plant.id}
                plant={plant}
                onClick={() => handleAddPlant(plant)}
                t={t}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">{t("noPlantsFound")}</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
        </motion.button>
      </div>
    </Modal>
  );
};

export default AssociatePlantModal;
