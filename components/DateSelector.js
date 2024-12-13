import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

const DateSelector = ({ isOpen, onClose, onSelect, value }) => {
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ empty: true });
    }

    // Add the actual days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  // Custom row component for better control over spacing
  const CalendarRow = ({ children }) => (
    <div className="grid grid-cols-7 gap-1">{children}</div>
  );

  const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  const isCurrentMonth = (date) => {
    return format(date, "MM/yyyy") === format(new Date(), "MM/yyyy");
  };

  const isSelected = (date) => {
    return value && format(date, "dd/MM/yyyy") === format(value, "dd/MM/yyyy");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-[300px] z-[999] overflow-visible"
        >
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-medium">
                {format(currentDate, "MMMM yyyy", { locale: es })}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Week days header */}
          <CalendarRow>
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex items-center justify-center h-8 text-sm text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </CalendarRow>

          {/* Calendar grid */}
          <div className="space-y-1">
            <CalendarRow>
              {getDaysInMonth().map((day, index) => (
                <div key={index} className="aspect-square">
                  {day.empty ? (
                    <div />
                  ) : (
                    <button
                      onClick={() => {
                        onSelect(day);
                        onClose();
                      }}
                      className={`w-full h-full flex items-center justify-center rounded-full text-sm
                        transition-colors duration-200
                        ${
                          isSelected(day)
                            ? "bg-custom-yellow text-custom-dark-blue font-medium"
                            : isCurrentMonth(day)
                            ? "text-custom-dark-blue dark:text-custom-light-gray hover:bg-gray-100 dark:hover:bg-gray-700"
                            : "text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      {format(day, "d")}
                    </button>
                  )}
                </div>
              ))}
            </CalendarRow>
          </div>

          {/* Quick actions */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="space-x-2">
              <button
                onClick={() => {
                  onSelect(new Date());
                  onClose();
                }}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                Today
              </button>
              <button
                onClick={() => {
                  onSelect(null);
                  onClose();
                }}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                This Month
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DateSelector;
