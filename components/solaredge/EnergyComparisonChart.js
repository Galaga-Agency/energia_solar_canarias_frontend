import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchSolarEdgeComparisonGraph,
  selectComparisonData,
  selectComparisonLoading,
} from "@/store/slices/plantsSlice";

const COLORS = {
  2020: "#1976D2",
  2021: "#E91E63",
  2022: "#FFC107",
  2023: "#4CAF50",
  2024: "#00BCD4",
};

const monthNames = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const EnergyComparisonChart = ({ plantId, installationDate, token }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const comparisonData = useSelector(selectComparisonData);
  const isLoading = useSelector(selectComparisonLoading);

  console.log("EnergyComparisonChart mounted with:", {
    plantId,
    installationDate,
    hasToken: !!token,
  });

  useEffect(() => {
    if (plantId && installationDate) {
      const formattedDate = new Date(installationDate)
        .toISOString()
        .split("T")[0];
      console.log("Dispatching with formatted date:", formattedDate);

      dispatch(
        fetchSolarEdgeComparisonGraph({
          plantId,
          timeUnit: "MONTH",
          date: formattedDate, // Send formatted date
          token,
        })
      );
    } else {
      console.log("Missing required props for comparison chart:", {
        plantId,
        installationDate,
      });
    }
  }, [dispatch, plantId, installationDate, token]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  if (!comparisonData) {
    return null;
  }

  // Transform data for the chart
  const transformedData = monthNames.map((month, idx) => {
    const monthData = { name: month };

    // Get all available years from the data
    const years = Array.from(
      new Set(comparisonData.map((item) => new Date(item.date).getFullYear()))
    ).sort();

    // Add data for each year
    years.forEach((year) => {
      const monthValue = comparisonData.find((item) => {
        const date = new Date(item.date);
        return date.getMonth() === idx && date.getFullYear() === year;
      });
      monthData[year] = monthValue?.value || 0;
    });

    return monthData;
  });

  return (
    <div className="bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 mt-6">
      <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-6">
        {t("energyComparison")}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: "MWh",
              angle: -90,
              position: "insideLeft",
              offset: 5,
            }}
          />
          <Tooltip
            formatter={(value) => [`${(value / 1000).toFixed(2)} MWh`, ""]}
          />
          <Legend />
          {Object.keys(COLORS).map((year) => (
            <Bar key={year} dataKey={year} fill={COLORS[year]} name={year} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyComparisonChart;
