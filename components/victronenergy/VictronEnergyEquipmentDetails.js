import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Info,
  Cpu,
  Wrench,
  Battery,
  Gauge,
  Box,
  Thermometer,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVictronEnergyEquipmentDetails,
  selectEquipmentDetails,
  selectEquipmentLoading,
} from "@/store/slices/plantsSlice";
import { useParams } from "next/navigation";
import { selectTheme } from "@/store/slices/themeSlice";
import VictronEquipmentDetailsSkeleton from "../loadingSkeletons/VictronEquipmentDetailsSkeleton";
import { useTranslation } from "react-i18next";

const victronEnergyEquipmentMockData = {
  success: true,
  records: {
    devices: [
      {
        name: "Gateway",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "Venus GX",
        firmwareVersion: "v2.51",
        remoteOnLan: "",
        autoUpdate: "Check",
        updateTo: "Official release",
        lastConnection: 1734697336,
        class: "device-gateway device-icon-venus-gx",
        loggingInterval: 60,
        identifier: "78a504ee094e",
        lastPowerUpOrRestart: 1692866120,
        vncSshAuth: true,
        vncStatus: "Enabled",
        vncPort: 0,
        twoWayCommunication: false,
        remoteSupportEnabled: false,
        remoteSupportPort: 31013,
        remoteSupport: "disabled",
        machineSerialNumber: "HQ2024A51D6",
        settings: [],
      },
      {
        name: "VE.Bus System",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "MultiPlus-II 48/5000/70-48",
        firmwareVersion: "478",
        lastConnection: 1734697336,
        class: "device-ve-bus device-icon-multiplus-ii-48-5000-70-48",
        productId: "2623",
        vmc: "VE.Bus",
        vid: {
          enumValue: "Single unit",
          devicesPerPhase: {
            L1: 1,
            L2: 0,
            L3: 0,
          },
        },
        machineSerialNumbers: [
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
          {
            serial: null,
          },
        ],
        instance: 261,
        idDeviceType: 1,
        settings: [],
      },
      {
        name: "Battery Monitor",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "Pylontech battery",
        lastConnection: 1734697336,
        class: "device-battery-monitor device-icon-pylontech-battery",
        machineSerialNumber: false,
        instance: 512,
        idDeviceType: 2,
        settings: [],
      },
      {
        name: "Solar Charger",
        customName: "",
        productCode: "",
        idSite: 168231,
        productName: "SmartSolar MPPT VE.Can 150/70 rev2",
        firmwareVersion: "v3.07",
        lastConnection: 1734697336,
        class:
          "device-solar-charger device-icon-smartsolar-mppt-ve-can-150-70-rev2",
        machineSerialNumber: "HQ2111AHEAH",
        instance: 258,
        idDeviceType: 4,
        settings: [],
      },
      {
        name: "Tank",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "Tank sensor (Built-in)",
        lastConnection: 1734369620,
        class: "device-fluid-monitor device-icon-tank-sensor--built-in-",
        instance: 20,
        idDeviceType: 5,
        settings: [],
      },
      {
        name: "Tank",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "Tank sensor (Built-in)",
        lastConnection: 1734440696,
        class: "device-fluid-monitor device-icon-tank-sensor--built-in-",
        instance: 21,
        idDeviceType: 5,
        settings: [],
      },
      {
        name: "Tank",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "Tank sensor (Built-in)",
        lastConnection: 1734365829,
        class: "device-fluid-monitor device-icon-tank-sensor--built-in-",
        instance: 22,
        idDeviceType: 5,
        settings: [],
      },
      {
        name: "Temperature sensor",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "Generic Temperature Input",
        lastConnection: 1734697336,
        class:
          "device-temperature-sensor device-icon-generic-temperature-input",
        instance: 23,
        idDeviceType: 17,
        settings: [],
      },
      {
        name: "Temperature sensor",
        customName: null,
        productCode: "",
        idSite: 168231,
        productName: "Generic Temperature Input",
        lastConnection: 1734697336,
        class:
          "device-temperature-sensor device-icon-generic-temperature-input",
        instance: 24,
        idDeviceType: 17,
        settings: [],
      },
    ],
    unconfigured_devices: [
      {
        idSite: "168231",
        name: "Tank",
        instance: "20",
        lastConnection: "1734369620",
      },
      {
        idSite: "168231",
        name: "Tank",
        instance: "21",
        lastConnection: "1734440696",
      },
      {
        idSite: "168231",
        name: "Tank",
        instance: "22",
        lastConnection: "1734365829",
      },
    ],
  },
};

const VictronEnergyEquipmentDetails = ({ token }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const plantId = params.plantId;
  const theme = useSelector(selectTheme);
  //   const equipmentDetails = useSelector(selectEquipmentDetails);
  const equipmentDetails = victronEnergyEquipmentMockData.records;
  const isLoading = useSelector(selectEquipmentLoading);
  const [activeSection, setActiveSection] = useState(null);
  const { t } = useTranslation();

  //   useEffect(() => {
  //     if (plantId && token) {
  //       dispatch(fetchVictronEnergyEquipmentDetails({ plantId, token }));
  //     }
  //   }, [dispatch, plantId, token]);

  const toggleSection = (key) => {
    setActiveSection(activeSection === key ? null : key);
  };

  const getEquipmentIcon = (type) => {
    const iconClass = "text-custom-dark-blue dark:text-custom-yellow text-xl";
    switch (type) {
      case "device-battery-monitor":
        return <Battery className={iconClass} />;
      case "device-solar-charger":
        return <Gauge className={iconClass} />;
      case "device-ve-bus":
        return <Cpu className={iconClass} />;
      case "device-gateway":
        return <Box className={iconClass} />;
      case "device-temperature-sensor":
        return <Thermometer className={iconClass} />;
      default:
        return <Wrench className={iconClass} />;
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
            .filter(([key]) => !["name", "class", "customName"].includes(key))
            .map(([key, value]) => (
              <div key={key} className="text-sm">
                <strong className="text-custom-yellow">{t(key)}:</strong>{" "}
                <span className="text-slate-200">
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </span>
              </div>
            ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Group devices by their class
  const devicesByType =
    equipmentDetails?.devices?.reduce((acc, device) => {
      const type = device.class.split(" ")[0];
      if (!acc[type]) acc[type] = [];
      acc[type].push(device);
      return acc;
    }, {}) || {};

  const sections = Object.entries(devicesByType).map(([type, devices]) => ({
    key: type,
    title: t(type.replace("device-", "").replace("-", " ")),
    count: devices.length,
    items: devices.map((device) => ({
      name: device.customName || device.productName,
      details: device,
    })),
  }));

  // Add this helper function at the top of your component
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) return <VictronEquipmentDetailsSkeleton theme={theme} />;

  return (
    <div className="flex-1 bg-white/50 dark:bg-custom-dark-blue/50 rounded-lg p-4 md:p-6 backdrop-blur-sm shadow-lg">
      <h2 className="text-xl mb-6 text-custom-dark-blue dark:text-custom-yellow">
        {t("equipment")}
      </h2>

      <div className="space-y-4">
        {sections.map(({ key, title, count, items }) => (
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
                  {t(capitalizeWords(title))}{" "}
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
                  {items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex flex-col space-y-2">
                        <div className="mt-2 space-y-1">
                          {Object.entries(item.details)
                            .filter(
                              ([key, value]) =>
                                // Exclude specific keys
                                ![
                                  "name",
                                  "class",
                                  "customName",
                                  "settings",
                                ].includes(key) &&
                                // Exclude null, undefined, and empty strings
                                value !== null &&
                                value !== undefined &&
                                value !== "" &&
                                // Exclude objects and arrays
                                !(
                                  typeof value === "object" &&
                                  !Array.isArray(value)
                                ) &&
                                !Array.isArray(value)
                            )
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="grid grid-cols-2 gap-4 text-sm py-1 border-b border-slate-100 dark:border-slate-600/50 last:border-0"
                              >
                                <span className="text-slate-600 dark:text-slate-300">
                                  {capitalizeWords(t(key))}
                                </span>
                                <span className="text-slate-800 dark:text-slate-200 break-words">
                                  {value === true
                                    ? t("enabled")
                                    : value === false
                                    ? t("disabled")
                                    : value}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
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

export default VictronEnergyEquipmentDetails;
