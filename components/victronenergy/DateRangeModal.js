import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

const DateRangeModal = ({ isOpen, onClose, onSelectRange }) => {
  const { t } = useTranslation();
  const [customDateStart, setCustomDateStart] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [customTimeStart, setCustomTimeStart] = useState("00:00");
  const [customDateEnd, setCustomDateEnd] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [customTimeEnd, setCustomTimeEnd] = useState("23:59");
  const handleRangeSelect = (range) => {
    onSelectRange(range);
    onClose();
  };

  const handleCustomRangeSelect = () => {
    const startDateTime = new Date(`${customDateStart}T${customTimeStart}`);
    const endDateTime = new Date(`${customDateEnd}T${customTimeEnd}`);
    onSelectRange({
      type: "custom",
      start: startDateTime,
      end: endDateTime,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white dark:bg-custom-dark-blue rounded-xl shadow-xl w-full max-w-3xl mx-4 p-6"
          >
            <DialogHeader className="mb-6">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold text-custom-dark-blue dark:text-custom-light-gray">
                  {t("Rangos rápidos")}
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-custom-dark-blue dark:text-custom-light-gray" />
                </button>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-custom-dark-blue dark:text-custom-light-gray">
                    {t("Horas")}
                  </h3>
                  <div className="space-y-2">
                    {[
                      "lastHour",
                      "last3Hours",
                      "last6Hours",
                      "last12Hours",
                      "last24Hours",
                    ].map((range) => (
                      <button
                        key={range}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-custom-dark-blue dark:text-custom-light-gray"
                        onClick={() => handleRangeSelect({ type: range })}
                      >
                        {t(range)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-custom-dark-blue dark:text-custom-light-gray">
                    {t("Días")}
                  </h3>
                  <div className="space-y-2">
                    {[
                      "today",
                      "yesterday",
                      "twoDaysAgo",
                      "last2days",
                      "last7days",
                    ].map((range) => (
                      <button
                        key={range}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-custom-dark-blue dark:text-custom-light-gray"
                        onClick={() => handleRangeSelect({ type: range })}
                      >
                        {t(range)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-custom-dark-blue dark:text-custom-light-gray">
                    {t("Semanas y meses")}
                  </h3>
                  <div className="space-y-2">
                    {[
                      "thisWeek",
                      "lastWeek",
                      "thisMonth",
                      "lastMonth",
                      "last30days",
                      "last90days",
                      "last6months",
                    ].map((range) => (
                      <button
                        key={range}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-custom-dark-blue dark:text-custom-light-gray"
                        onClick={() => handleRangeSelect({ type: range })}
                      >
                        {t(range)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-lg mb-3 text-custom-dark-blue dark:text-custom-light-gray">
                  {t("Personalizado")}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-custom-dark-blue dark:text-custom-light-gray">
                      {t("Desde")}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray"
                        value={customDateStart}
                        onChange={(e) => setCustomDateStart(e.target.value)}
                      />
                      <input
                        type="time"
                        className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray"
                        value={customTimeStart}
                        onChange={(e) => setCustomTimeStart(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-custom-dark-blue dark:text-custom-light-gray">
                      {t("Hasta")}
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray"
                        value={customDateEnd}
                        onChange={(e) => setCustomDateEnd(e.target.value)}
                      />
                      <input
                        type="time"
                        className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray"
                        value={customTimeEnd}
                        onChange={(e) => setCustomTimeEnd(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full px-4 py-2 bg-custom-light-blue dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-light-gray rounded-lg hover:bg-blue-500 transition-all duration-200 mt-4"
                    onClick={handleCustomRangeSelect}
                  >
                    {t("Aplicar")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DateRangeModal;
