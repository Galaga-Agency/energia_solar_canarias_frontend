import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  isValid,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

const DateSelector = ({ isOpen, onClose, onSelect, value, parentRef }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (value && isValid(parseISO(value))) {
      return parseISO(value);
    }
    return startOfMonth(new Date());
  });

  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        parentRef?.current &&
        !parentRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, parentRef]);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ empty: true });
    }

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

  const isToday = (date) => {
    const today = new Date();
    return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  };

  const isSelected = (date) => {
    if (!value) return false;
    try {
      const valueDate = parseISO(value);
      return format(date, "yyyy-MM-dd") === format(valueDate, "yyyy-MM-dd");
    } catch {
      return false;
    }
  };

  const handleDateSelect = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    onSelect(formattedDate);
    onClose();
  };

  if (!isOpen) return null;

  const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={datePickerRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute z-[9999] mt-1 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
        style={{
          top: parentRef.current?.getBoundingClientRect().bottom - 10,
          left: parentRef.current?.getBoundingClientRect().left,
          width: parentRef.current?.offsetWidth,
        }}
      >
        <div className="p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 text-custom-dark-blue dark:text-custom-light-gray">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
            {getDaysInMonth().map((day, index) => (
              <div key={index}>
                {day.empty ? (
                  <div className="h-6" />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`w-full h-6 text-xs flex items-center justify-center rounded
                      ${
                        isSelected(day)
                          ? "bg-custom-yellow text-custom-dark-blue font-medium"
                          : isToday(day)
                          ? "bg-blue-100 dark:bg-blue-900 text-custom-dark-blue dark:text-custom-light-gray"
                          : "text-custom-dark-blue dark:text-custom-light-gray hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {format(day, "d")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default DateSelector;
