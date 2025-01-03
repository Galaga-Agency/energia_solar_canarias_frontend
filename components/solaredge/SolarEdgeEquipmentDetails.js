import React, { useEffect, useState } from "react";
import { ChevronDown, Info, Battery, Gauge, Cpu, Wrench } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSolarEdgeInventory,
  selectInventory,
  selectInventoryLoading,
} from "@/store/slices/plantsSlice";
import { useParams } from "next/navigation";
import EquipmentDetailsSkeleton from "../loadingSkeletons/EquipmentDetailsSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const SolarEdgeEquipmentDetails = ({ token, t }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const plantId = params.plantId;
  const theme = useSelector(selectTheme);
  const inventory = useSelector(selectInventory);
  const isLoading = useSelector(selectInventoryLoading);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (plantId && token) {
      dispatch(fetchSolarEdgeInventory({ plantId, token }));
    }
  }, [dispatch, plantId, token]);

  const toggleSection = (key) => {
    setActiveSection(activeSection === key ? null : key);
  };

  const getEquipmentIcon = (type) => {
    const iconClass = "text-custom-dark-blue dark:text-custom-yellow text-xl";
    switch (type) {
      case "batteries":
        return <Battery className={iconClass} />;
      case "meters":
        return <Gauge className={iconClass} />;
      case "inverters":
        return <Cpu className={iconClass} />;
      case "optimizers":
        return <Wrench className={iconClass} />;
      default:
        return null;
    }
  };

  const renderTooltip = (item) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 text-slate-400 dark:text-slate-500 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="bg-slate-800 text-white p-3 rounded-lg shadow-xl">
          {Object.entries(item)
            .filter(([key]) => key !== "name")
            .map(([key, value]) => (
              <div key={key} className="text-sm">
                <strong className="text-custom-yellow">{t(key)}:</strong>{" "}
                <span className="text-slate-200">{value}</span>
              </div>
            ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const invertersByModel = inventory?.inverters?.reduce((acc, inv) => {
    const model = inv.model || "Unknown";
    if (!acc[model]) acc[model] = [];
    acc[model].push(inv);
    return acc;
  }, {});

  const optimizers = {};
  inventory?.inverters?.forEach((inv) => {
    const model = inv.model || "Unknown";
    if (!optimizers[model]) optimizers[model] = 0;
    optimizers[model] += inv.connectedOptimizers || 0;
  });

  const batteries = inventory?.batteries?.map((bat) => ({
    name: `${bat.manufacturer}, ${bat.nameplateCapacity / 1000}KWh`,
    count: 1,
  }));

  const meters = Array.from(
    new Map(
      inventory?.meters
        ?.filter((m) => m.form === "physical")
        .map((m) => [m.SN, m])
    ).values()
  );

  const sections = [
    {
      key: "inverters",
      title: t("Inversores"),
      count: inventory?.inverters?.length || 0,
      items:
        Object.entries(invertersByModel || {}).map(([model, inverters]) => ({
          name: `${model} (${inverters.length})`,
          subItems: inverters.map((inv) => ({
            name: inv.SN,
            details: inv,
          })),
        })) || [],
    },
    {
      key: "optimizers",
      title: t("Optimizadores"),
      count: Object.values(optimizers).reduce((acc, count) => acc + count, 0),
      items:
        Object.entries(optimizers || {}).map(([model, count]) => ({
          name: `${model} (${count})`,
        })) || [],
    },
    {
      key: "batteries",
      title: t("Almacenamiento"),
      count: batteries?.length || 0,
      items: batteries || [],
    },
    {
      key: "meters",
      title: t("Meters"),
      count: meters?.length || 0,
      items: meters || [],
    },
  ];

  if (isLoading) return <EquipmentDetailsSkeleton theme={theme} />;

  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl mb-6 text-custom-dark-blue dark:text-custom-yellow">
        {t("equipment")}
      </h2>

      <div className="space-y-4">
        {sections?.map(({ key, title, count, items }) => (
          <div
            key={key}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex justify-between items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md">
                  {getEquipmentIcon(key)}
                </div>
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {title}{" "}
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{`(${count})`}</span>
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 dark:text-slate-300 transition-transform duration-200 ${
                  activeSection === key ? "-rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-200 ease-out ${
                activeSection === key ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2 p-4 bg-slate-100/50 dark:bg-slate-800/50">
                  {items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/70 dark:bg-slate-700/70 p-4 rounded-lg hover:bg-white dark:hover:bg-slate-600/70 transition-colors duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {item.name || item.model}
                        </span>
                        {item.SN && (
                          <span className="text-sm text-slate-500 dark:text-slate-400">{`SN: ${item.SN}`}</span>
                        )}
                      </div>
                      {item.subItems && (
                        <div className="mt-3 space-y-2">
                          {item.subItems.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                            >
                              {sub.name} {renderTooltip(sub.details)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolarEdgeEquipmentDetails;
