import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  startOfYear,
  isValid,
  parseISO,
} from "date-fns";
import { es } from "date-fns/locale";

const views = {
  DAY: "dia",
  MONTH: "mes",
  YEAR: "año",
};

const GoodweDateSelector = ({
  isOpen,
  onClose,
  onSelect,
  selectedDate,
  parentRef,
  range = views.DAY,
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      return selectedDate;
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

  const getMonthsInYear = () => {
    const months = [];
    for (let month = 0; month < 12; month++) {
      months.push(new Date(currentDate.getFullYear(), month, 1));
    }
    return months;
  };

  const getYearsInDecade = () => {
    const year = currentDate.getFullYear();
    const decadeStart = Math.floor(year / 10) * 10;
    const years = [];
    for (let i = decadeStart - 1; i <= decadeStart + 10; i++) {
      years.push(new Date(i, 0, 1));
    }
    return years;
  };

  const handlePrevious = () => {
    if (range === views.DAY) {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (range === views.MONTH) {
      setCurrentDate((prev) => subYears(prev, 1));
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear() - 10, 0, 1));
    }
  };

  const handleNext = () => {
    if (range === views.DAY) {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else if (range === views.MONTH) {
      setCurrentDate((prev) => addYears(prev, 1));
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear() + 10, 0, 1));
    }
  };

  const isToday = (date) => {
    const today = new Date();
    if (range === views.DAY) {
      return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    } else if (range === views.MONTH) {
      return format(date, "yyyy-MM") === format(today, "yyyy-MM");
    }
    return date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    if (range === views.DAY) {
      return format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    } else if (range === views.MONTH) {
      return format(date, "yyyy-MM") === format(selectedDate, "yyyy-MM");
    }
    return date.getFullYear() === selectedDate.getFullYear();
  };

  const handleDateSelect = (date) => {
    if (range === views.DAY) {
      onSelect(date);
    } else if (range === views.MONTH) {
      onSelect(startOfMonth(date));
    } else {
      onSelect(startOfYear(date));
    }
    onClose();
  };

  const getHeaderText = () => {
    if (range === views.DAY) {
      return format(currentDate, "MMMM yyyy", { locale: es });
    } else if (range === views.MONTH) {
      return format(currentDate, "yyyy");
    }
    const decadeStart = Math.floor(currentDate.getFullYear() / 10) * 10;
    return `${decadeStart} - ${decadeStart + 9}`;
  };

  const renderDayView = () => {
    const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    const days = getDaysInMonth();

    return (
      <>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
          {days.map((day, index) => (
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
      </>
    );
  };

  const renderMonthView = () => {
    const months = getMonthsInYear();
    return (
      <div className="grid grid-cols-3 gap-1 px-1">
        {months.map((month, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleDateSelect(month)}
            className={`h-8 text-xs flex items-center justify-center rounded
              ${
                isSelected(month)
                  ? "bg-custom-yellow text-custom-dark-blue font-medium"
                  : isToday(month)
                  ? "bg-blue-100 dark:bg-blue-900 text-custom-dark-blue dark:text-custom-light-gray"
                  : "text-custom-dark-blue dark:text-custom-light-gray hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
          >
            {format(month, "MMM", { locale: es })}
          </button>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const years = getYearsInDecade();
    return (
      <div className="grid grid-cols-3 gap-1 px-1">
        {years.map((year, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleDateSelect(year)}
            className={`h-8 text-xs flex items-center justify-center rounded
              ${
                isSelected(year)
                  ? "bg-custom-yellow text-custom-dark-blue font-medium"
                  : isToday(year)
                  ? "bg-blue-100 dark:bg-blue-900 text-custom-dark-blue dark:text-custom-light-gray"
                  : "text-custom-dark-blue dark:text-custom-light-gray hover:bg-gray-100 dark:hover:bg-gray-700"
              }
            `}
          >
            {format(year, "yyyy")}
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={datePickerRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[9999] mt-1 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 min-w-[280px]"
        style={{
          top: parentRef.current?.getBoundingClientRect().bottom - 40,
          left: parentRef.current?.getBoundingClientRect().left,
          width: Math.max(280, parentRef.current?.offsetWidth || 0),
        }}
      >
        <div className="p-2">
          <div className="flex items-center justify-between mb-2 text-custom-dark-blue dark:text-custom-light-gray">
            <button
              onClick={handlePrevious}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">{getHeaderText()}</span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {range === views.DAY && renderDayView()}
          {range === views.MONTH && renderMonthView()}
          {range === views.YEAR && renderYearView()}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default GoodweDateSelector;
