import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "next-i18next";

const PlantDetailsModal = ({ selectedPlant, onClose }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {selectedPlant && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden rounded-lg"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-custom-dark-blue rounded-lg shadow-lg w-[90vw] md:w-[70vw] max-w-2xl relative z-10 p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-2xl text-custom-dark-blue dark:text-custom-light-gray hover:text-red-500"
            >
              <IoMdClose />
            </button>
            <h2 className="text-lg font-bold text-custom-dark-blue dark:text-custom-yellow mb-2">
              {selectedPlant.name}
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-custom-light-gray">
                <strong>{t("location")}: </strong>
                {selectedPlant.location || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-custom-light-gray">
                <strong>{t("powerOutput")}: </strong>
                {selectedPlant.currentPowerOutputKW || "N/A"} kW
              </p>
              <p className="text-gray-700 dark:text-custom-light-gray">
                <strong>{t("todayGeneration")}: </strong>
                {selectedPlant.dailyGenerationKWh || "N/A"} kWh
              </p>
              <p className="text-gray-700 dark:text-custom-light-gray">
                <strong>{t("totalIncome")}: </strong>
                {selectedPlant.totalIncomeEUR || "N/A"} EUR
              </p>
              <p className="mt-2 underline text-custom-yellow dark:text-custom-light-gray">
                <a
                  href={`http://localhost:3000/dashboard/123/plants/${selectedPlant.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("viewDetails")}
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlantDetailsModal;
