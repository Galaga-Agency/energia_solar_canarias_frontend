import { useTranslation } from "next-i18next";

const useFormattedDate = () => {
  const { t } = useTranslation();

  const getLoginStatus = (lastLogin) => {
    if (!lastLogin)
      return {
        color: "gray-400",
        text: t("lastLogin") + ": -",
        description: t("noLoginRecorded"),
      };

    const lastLoginDate = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now - lastLoginDate) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      if (diffInHours === 0) {
        return {
          color: "green-500",
          text: t("lastLogin") + ": " + t("justNow"),
          description: lastLoginDate.toLocaleTimeString(),
        };
      }
      return {
        color: "green-500",
        text: t("lastLogin") + ": " + diffInHours + " " + t("hoursAgo"),
        description: lastLoginDate.toLocaleTimeString(),
      };
    }

    if (diffInDays < 7) {
      return {
        color: "blue-500",
        text: t("lastLogin") + ": " + diffInDays + " " + t("daysAgo"),
        description: lastLoginDate.toLocaleDateString(),
      };
    }

    if (diffInDays < 30) {
      return {
        color: "yellow-500",
        text:
          t("lastLogin") +
          ": " +
          Math.floor(diffInDays / 7) +
          " " +
          t("weeksAgo"),
        description: lastLoginDate.toLocaleDateString(),
      };
    }

    return {
      color: "gray-400",
      text: t("lastLogin") + ": " + lastLoginDate.toLocaleDateString(),
      description: lastLoginDate.toLocaleTimeString(),
    };
  };

  return getLoginStatus;
};

export default useFormattedDate;
