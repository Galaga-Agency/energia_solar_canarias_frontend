"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Texture from "../Texture";
import PrimaryButton from "../ui/PrimaryButton";
import DateSelector from "../DateSelector";
import { format } from "date-fns";

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
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

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
        <div className="fixed inset-0 z-[999]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.1,
                }}
                className="relative w-full max-w-4xl rounded-2xl bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-4 md:p-6 backdrop-blur-lg shadow-xl max-h-[80vh] xl:max-h-[85vh] overflow-y-auto custom-scrollbar"
              >
                <Texture className="opacity-30" />

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between mb-6 md:mb-8"
                >
                  <h2 className="text-xl md:text-2xl  bg-gradient-to-r from-custom-dark-blue to-custom-dark-blue/70 dark:from-custom-yellow dark:to-custom-yellow/70 bg-clip-text text-transparent">
                    {t("Rangos rápidos")}
                  </h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <X className="h-6 w-6 text-custom-dark-blue dark:text-custom-yellow" />
                  </motion.button>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Range Sections (Horas, Días, Semanas y meses, Años) */}
                  {[
                    {
                      title: "Horas",
                      ranges: [
                        "lastHour",
                        "last3Hours",
                        "last6Hours",
                        "last12Hours",
                        "last24Hours",
                      ],
                    },
                    {
                      title: "Días",
                      ranges: [
                        "last2days",
                        "last7days",
                        "last30days",
                        "last90days",
                        "last12months",
                      ],
                    },
                    {
                      title: "Semanas y meses",
                      ranges: [
                        "thisWeek",
                        "lastWeek",
                        "thisMonth",
                        "lastMonth",
                        "last6months",
                      ],
                    },
                    {
                      title: "Años",
                      ranges: ["thisYear", "lastYear"],
                    },
                  ].map((section, idx) => (
                    <motion.div
                      key={section.title}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="bg-white/50 dark:bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm"
                    >
                      <h3 className="font-semibold text-lg mb-4 text-custom-dark-blue dark:text-custom-yellow">
                        {t(section.title)}
                      </h3>
                      <div className="space-y-1">
                        {section.ranges.map((range) => (
                          <motion.button
                            key={range}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 px-4 text-left rounded-lg hover:bg-white dark:hover:bg-gray-700/50 transition-all text-custom-dark-blue/80 dark:text-custom-light-gray/80 hover:text-custom-dark-blue dark:hover:text-custom-light-gray"
                            onClick={() => handleRangeSelect({ type: range })}
                          >
                            {t(range)}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Custom Date Range Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/50 dark:bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm mt-6"
                >
                  <h3 className="font-semibold text-lg mb-4 text-custom-dark-blue dark:text-custom-yellow">
                    {t("Personalizado")}
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 relative">
                        <label className="block text-sm text-custom-dark-blue/80 dark:text-custom-light-gray/80">
                          {t("Desde")}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <button
                              onClick={() => setIsStartDateOpen(true)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all text-left"
                            >
                              {format(new Date(customDateStart), "dd/MM/yyyy")}
                            </button>
                            <DateSelector
                              isOpen={isStartDateOpen}
                              onClose={() => setIsStartDateOpen(false)}
                              onSelect={(date) => {
                                setCustomDateStart(format(date, "yyyy-MM-dd"));
                                setIsStartDateOpen(false);
                              }}
                              value={new Date(customDateStart)}
                            />
                          </div>
                          <input
                            type="time"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                            value={customTimeStart}
                            onChange={(e) => setCustomTimeStart(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 relative">
                        <label className="block text-sm text-custom-dark-blue/80 dark:text-custom-light-gray/80">
                          {t("Hasta")}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <button
                              onClick={() => setIsEndDateOpen(true)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all text-left"
                            >
                              {format(new Date(customDateEnd), "dd/MM/yyyy")}
                            </button>
                            <DateSelector
                              isOpen={isEndDateOpen}
                              onClose={() => setIsEndDateOpen(false)}
                              onSelect={(date) => {
                                setCustomDateEnd(format(date, "yyyy-MM-dd"));
                                setIsEndDateOpen(false);
                              }}
                              value={new Date(customDateEnd)}
                            />
                          </div>
                          <input
                            type="time"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-custom-dark-blue dark:text-custom-light-gray focus:ring-2 focus:ring-custom-yellow/20 outline-none transition-all"
                            value={customTimeEnd}
                            onChange={(e) => setCustomTimeEnd(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <PrimaryButton onClick={handleCustomRangeSelect}>
                          {t("Aplicar")}
                        </PrimaryButton>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DateRangeModal;
