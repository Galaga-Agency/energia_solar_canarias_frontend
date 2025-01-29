import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subHours,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { es } from "date-fns/locale";

export const getDateRangeParams = (
  rangeType,
  { isMobile = false, showForecast = false } = {}
) => {
  switch (rangeType) {
    case "last2days":
      return { interval: "hours", type: "live_feed" };
    case "last7days":
      return { interval: "days", type: "live_feed" };
    case "last30days":
      return { interval: "days", type: "live_feed" };
    case "last90days":
      return { interval: isMobile ? "weeks" : "days", type: "live_feed" };
    case "last6months":
      return { interval: "months", type: "live_feed" };
    case "today":
      return {
        interval: "hours",
        type: showForecast ? "forecast" : "live_feed",
      };
    case "thisWeek":
      return { interval: "days", type: "live_feed" };
    case "thisMonth":
      return { interval: "days", type: "live_feed" };
    case "thisYear":
      return { interval: "months", type: "live_feed" };
    case "lastYear":
      return { interval: "months", type: "live_feed", aggregated: true };
    case "last12months":
      return { interval: "months", type: "live_feed" };
    case "yesterday":
      return { interval: "hours", type: "live_feed" };
    case "theDayBeforeYesterday":
      return { interval: "hours", type: "live_feed" };
    case "thisDayLastWeek":
      return { interval: "hours", type: "live_feed" };
    case "lastMonth":
      return { interval: "days", type: "live_feed" };
    case "lastWeek":
      return { interval: "days", type: "live_feed" };
    case "lastHour":
      return { interval: "15mins", type: "live_feed" };
    case "last3Hours":
      return { interval: "hours", type: "live_feed" };
    case "last6Hours":
      return { interval: "hours", type: "live_feed" };
    case "last12Hours":
      return { interval: "hours", type: "live_feed" };
    case "last24Hours":
      return { interval: "hours", type: "live_feed" };
    case "custom":
      return { interval: "15mins", type: "custom" };
    default:
      return { interval: "hours", type: "live_feed" };
  }
};

export const calculateDateRange = (range, showForecast = false) => {
  const now = new Date();
  const currentHour = new Date(now);
  currentHour.setMinutes(0, 0, 0);

  if (
    showForecast &&
    ["today", "thisWeek", "thisMonth", "thisYear"].includes(range.type)
  ) {
    switch (range.type) {
      case "today":
        return {
          start: Math.floor(now.getTime() / 1000),
          end: Math.floor(endOfDay(now).getTime() / 1000),
        };
      case "thisWeek":
        return {
          start: Math.floor(now.getTime() / 1000),
          end: Math.floor(endOfWeek(now, { locale: es }).getTime() / 1000),
        };
      case "thisMonth":
        return {
          start: Math.floor(now.getTime() / 1000),
          end: Math.floor(endOfMonth(now).getTime() / 1000),
        };
      case "thisYear":
        return {
          start: Math.floor(now.getTime() / 1000),
          end: Math.floor(endOfYear(now).getTime() / 1000),
        };
    }
  }

  switch (range.type) {
    case "lastHour":
      return {
        start: Math.floor(subHours(currentHour, 1).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last3Hours":
      return {
        start: Math.floor(subHours(currentHour, 3).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last6Hours":
      return {
        start: Math.floor(subHours(currentHour, 6).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last12Hours":
      return {
        start: Math.floor(subHours(currentHour, 12).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last24Hours":
      return {
        start: Math.floor(subHours(currentHour, 24).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "today":
      return {
        start: Math.floor(startOfDay(now).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "yesterday":
      return {
        start: Math.floor(startOfDay(subDays(now, 1)).getTime() / 1000),
        end: Math.floor(endOfDay(subDays(now, 1)).getTime() / 1000),
      };
    case "twoDaysAgo":
      return {
        start: Math.floor(startOfDay(subDays(now, 2)).getTime() / 1000),
        end: Math.floor(endOfDay(subDays(now, 2)).getTime() / 1000),
      };
    case "thisWeek":
      return {
        start: Math.floor(startOfWeek(now, { locale: es }).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "lastWeek": {
      const lastWeekStart = startOfWeek(subWeeks(now, 1), { locale: es });
      const lastWeekEnd = endOfWeek(subWeeks(now, 1), { locale: es });
      return {
        start: Math.floor(lastWeekStart.getTime() / 1000),
        end: Math.floor(lastWeekEnd.getTime() / 1000),
      };
    }
    case "thisMonth":
      return {
        start: Math.floor(startOfMonth(now).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "lastMonth":
      return {
        start: Math.floor(startOfMonth(subMonths(now, 1)).getTime() / 1000),
        end: Math.floor(endOfMonth(subMonths(now, 1)).getTime() / 1000),
      };
    case "last2days":
      return {
        start: Math.floor(startOfDay(subDays(now, 2)).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last7days":
      return {
        start: Math.floor(startOfDay(subDays(now, 7)).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last30days":
      return {
        start: Math.floor(startOfDay(subDays(now, 30)).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last90days":
      return {
        start: Math.floor(startOfDay(subDays(now, 90)).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "last6months":
      return {
        start: Math.floor(startOfMonth(subMonths(now, 6)).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "thisYear":
      return {
        start: Math.floor(startOfYear(now).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "lastYear": {
      const lastYearStart = startOfYear(subYears(now, 1));
      const lastYearEnd = endOfYear(subYears(now, 1));
      return {
        start: Math.floor(lastYearStart.getTime() / 1000),
        end: Math.floor(lastYearEnd.getTime() / 1000),
      };
    }
    case "last12months":
      return {
        start: Math.floor(subMonths(now, 12).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
    case "custom":
      return {
        start: Math.floor(range.start.getTime() / 1000),
        end: Math.floor(range.end.getTime() / 1000),
      };
    default:
      return {
        start: Math.floor(subHours(currentHour, 3).getTime() / 1000),
        end: Math.floor(now.getTime() / 1000),
      };
  }
};

export const formatAxisDate = (timestamp, rangeType) => {
  const date = new Date(timestamp);

  switch (rangeType) {
    case "last2days":
    case "last7days":
    case "last30days":
    case "last6months":
    case "lastWeek":
    case "lastMonth":
    case "last90days":
      return format(date, "dd MMM");
    case "today":
      return format(date, "HH:mm");
    case "thisWeek":
      return format(date, "EEE");
    case "thisMonth":
      return format(date, "dd");
    case "thisYear":
      return format(date, "MMM");
    case "lastHour":
    case "last3Hours":
    case "last6Hours":
    case "last12Hours":
    case "last24Hours":
      return format(date, "HH:mm");
    case "custom":
      return format(date, "MM-dd");
    default:
      return format(date, "MM-dd");
  }
};
