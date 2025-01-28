import React from "react";
import { useTranslation } from "react-i18next";

const CustomTooltipGraph = ({ active, payload, label, theme }) => {
  const { t } = useTranslation();

  if (!active || !payload || !payload.length) return null;

  const formatName = (name) => {
    // Direct name mappings with Spanish fallbacks
    const nameMap = {
      PCurve_Power_PV: t("power_pv", "PV(W)"),
      PCurve_Power_Battery: t("power_battery", "Batería(W)"),
      PCurve_Power_Meter: t("power_meter", "Medidor(W)"),
      PCurve_Power_Load: t("power_load", "Carga(W)"),
      PCurve_Power_SOC: t("power_soc", "SOC(%)"),
      PVGeneration: t("pv_generation", "Generación PV"),
      Income: t("income", "Ingresos"),
      SelfUse: t("self_use", "Autoconsumo"),
      SelfUseRatio: t("self_use_ratio", "Ratio de Autoconsumo"),
      Sell: t("sell", "Venta"),
      Consumption: t("consumption", "Consumo"),
      Buy: t("buy", "Compra"),
      ContributionRatio: t("contribution_ratio", "Ratio de Contribución"),
    };

    // Clean up the name first
    const cleanName = name.replace("PCurve_Power_", "");
    return nameMap[name] || nameMap[cleanName] || name;
  };

  return (
    <div
      className={`z-[999] p-4 rounded-lg shadow-lg ${
        theme === "dark"
          ? "bg-slate-800/95 text-gray-100 border border-gray-700"
          : "bg-white/95 text-gray-800 border border-gray-200"
      }`}
    >
      <div className="font-medium mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {label}
      </div>

      <div className="mb-3">
        {payload.map((entry, index) => (
          <div
            key={`${entry.name}-${index}`}
            className="flex justify-between items-center gap-4 py-1"
          >
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{formatName(entry.name)}:</span>
            </span>
            <span className="font-medium">
              {Number(entry.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {payload.length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-75">
              {t("graph_total", "Total")}:
            </span>
            <span className="font-medium">
              {payload
                .reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTooltipGraph;
