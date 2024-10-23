// UsageStatsCard.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "next-i18next";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UsageStatsCard = ({ usageData }) => {
  const { t } = useTranslation();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#000",
        },
      },
      title: {
        display: true,
        text: t("usageStats"),
        color: "#000",
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#000",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#000",
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-dark-shadow border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
        {t("usageStats")}
      </h2>
      <Bar data={usageData} options={options} />
    </div>
  );
};

export default UsageStatsCard;
