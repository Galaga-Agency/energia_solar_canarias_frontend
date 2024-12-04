import React from "react";
import { FaPlug, FaExchangeAlt } from "react-icons/fa";
import { BsLightningCharge, BsHouseDoor } from "react-icons/bs";
import { PiSolarPanelLight } from "react-icons/pi";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/Tooltip";
import BatteryIndicator from "@/components/BatteryIndicator";
import { Info } from "lucide-react";
import { TbPlug } from "react-icons/tb";

const EnergyBlock = ({
  title,
  value,
  unit,
  icon: Icon,
  tooltip,
  details,
  className,
}) => {
  return (
    <div
      className={`relative bg-white dark:bg-custom-dark-blue rounded-lg p-6 backdrop-blur-sm shadow-lg flex flex-col h-full group 
      transition-all duration-700 ease-in-out
      hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
      hover:translate-y-[-4px] ${className} z-10`}
    >
      {/* Info Icon */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="absolute top-4 right-4">
            <Info className="w-5 h-5 text-custom-dark-blue/60 dark:text-custom-yellow/60 transition-all duration-300 hover:scale-110 hover:text-custom-dark-blue dark:hover:text-custom-yellow" />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs bg-gray-200 dark:bg-gray-800 text-sm p-3 rounded-lg shadow"
          >
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div
          className="absolute -top-10 w-20 h-20 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md 
        transition-all duration-700 ease-in-out group-hover:shadow-lg group-hover:scale-110"
        >
          <Icon className="text-5xl text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 ease-in-out group-hover:scale-110" />
        </div>

        <div className="text-center mt-12 space-y-2">
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
            {title}
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-custom-dark-blue to-blue-700 dark:from-custom-yellow dark:to-yellow-500 bg-clip-text text-transparent">
            {value !== null ? `${value} ${unit}` : "-"}
          </p>
        </div>
      </div>

      {details && (
        <div className="w-full mt-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 pt-4">
          {details}
        </div>
      )}
    </div>
  );
};

const VictronEnergyFlow = () => {
  const data = {
    acInput: "100",
    generator: "900",
    battery: {
      soc: 99,
      chargingPower: 681,
      voltage: 53.7,
      current: 12.6,
      temp: 19,
      dcPower: -1257,
    },
    inverter: {
      state: "Invirtiendo",
      power: 1152,
    },
    pvCharger: { power: 644, voltage: 83.02, current: 7.9 },
    loads: 1152,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
      {/* Left Column */}
      <div className="flex flex-col gap-8">
        <EnergyBlock
          title="Entrada de CA"
          value={data.acInput}
          unit="W"
          icon={TbPlug}
          tooltip="Energía que entra desde la red eléctrica."
        />

        {/* Battery Block */}
        <div
          className="relative bg-white dark:bg-custom-dark-blue rounded-lg p-6 backdrop-blur-sm shadow-lg flex flex-col flex-grow group 
        transition-all duration-700 ease-in-out
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        hover:translate-y-[-4px] z-10"
        >
          {/* Info Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="absolute top-4 right-4">
                <Info className="w-5 h-5 text-custom-dark-blue/60 dark:text-custom-yellow/60 transition-all duration-300 hover:scale-110 hover:text-custom-dark-blue dark:hover:text-custom-yellow" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-gray-200 dark:bg-gray-800 text-sm p-3 rounded-lg shadow">
                <p>Estado y detalles de la batería</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex-1 flex flex-col items-center justify-start relative">
            <div className="absolute -top-10 w-48 transition-transform duration-700 ease-in-out group-hover:scale-105">
              <BatteryIndicator soc={data.battery.soc} />
            </div>
            <div className="text-center mt-28">
              <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                Batería {data.battery.soc}%
              </h3>
            </div>
          </div>

          <div className="w-full mt-6 text-sm space-y-2 border-t border-gray-200 dark:border-gray-700/50 pt-4">
            {["Tensión", "Corriente", "Temperatura"].map((label, index) => (
              <div
                key={label}
                className="flex justify-between items-center px-2 py-1 rounded-md transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:translate-x-1"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {label}
                </span>
                <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                  {index === 0 && `${data.battery.voltage} V`}
                  {index === 1 && `${data.battery.current} A`}
                  {index === 2 && `${data.battery.temp}°C`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Column */}
      <div className="flex flex-col gap-8">
        {/* Center Column - Inverter Block */}
        <div className="relative flex-grow group">
          {/* Enhanced glow effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] transition-all duration-1000">
            <div className="absolute inset-0 rotate-180 bg-gradient-to-t from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/40 via-green-500/40 to-transparent rounded-full blur-[100px] group-hover:blur-[120px] group-hover:scale-110 transition-all duration-1000 animate-pulse"></div>
          </div>

          <div
            className="relative bg-white dark:bg-custom-dark-blue rounded-lg p-6 backdrop-blur-md shadow-lg flex flex-col items-center justify-center h-full transition-all duration-700
    group-hover:transform group-hover:scale-105
    group-hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]
    dark:group-hover:shadow-[0_20px_50px_rgba(254,_204,_27,_0.4)]"
          >
            {/* Info Icon */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="absolute top-4 right-4">
                  <Info className="w-5 h-5 text-custom-dark-blue/60 dark:text-custom-yellow/60 transition-all duration-300 hover:scale-110 hover:text-custom-dark-blue dark:hover:text-custom-yellow" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-gray-200 dark:bg-gray-800 text-sm p-3 rounded-lg shadow">
                  <p>Estado actual del inversor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="absolute -top-10 w-20 h-20 bg-white dark:bg-custom-dark-blue/50 rounded-full flex items-center justify-center shadow-md transition-all duration-700 group-hover:shadow-lg">
              <FaExchangeAlt className="text-5xl text-custom-dark-blue dark:text-custom-yellow transition-transform duration-700 group-hover:scale-125 group-hover:rotate-180" />
            </div>

            <div className="text-center mt-12 space-y-2">
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 transition-colors duration-700 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                Inversor
              </h3>
              <p className="text-2xl font-bold bg-gradient-to-r from-custom-dark-blue to-blue-700 dark:from-custom-yellow dark:to-yellow-500 bg-clip-text text-transparent">
                {data.inverter.state}
              </p>
              {data.inverter.power && (
                <p className="text-3xl font-bold text-custom-dark-blue dark:text-custom-yellow">
                  {data.inverter.power} W
                </p>
              )}
            </div>
          </div>
        </div>

        <EnergyBlock
          title="Potencia CC"
          value={data.battery.dcPower}
          unit="W"
          icon={BsLightningCharge}
          tooltip="Potencia DC actual del sistema"
          details={
            <div className="space-y-2">
              {["Tensión", "Corriente"].map((label) => (
                <div
                  key={label}
                  className="flex justify-between items-center px-2 py-1 rounded-md transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:translate-x-1"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                    {label === "Tensión"
                      ? `${data.battery.voltage} V`
                      : `${data.battery.current} A`}
                  </span>
                </div>
              ))}
            </div>
          }
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-8">
        <EnergyBlock
          title="Cargas CA"
          value={data.loads}
          unit="W"
          icon={BsHouseDoor}
          tooltip="Energía consumida por los dispositivos conectados."
          className="h-auto md:h-[calc(50%-16px)]"
          details={
            <div className="flex justify-between items-center px-2 py-1 rounded-md transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:translate-x-1">
              <span className="text-gray-600 dark:text-gray-400">L1</span>
              <div className="flex gap-4">
                <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                  {data.loads} W
                </span>
                <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                  {50.1} Hz
                </span>
              </div>
            </div>
          }
        />

        <EnergyBlock
          title="Cargador FV"
          value={data.pvCharger.power}
          unit="W"
          icon={PiSolarPanelLight}
          tooltip="Estado del cargador solar"
          className="h-auto md:h-[calc(50%-16px)]"
          details={
            <div className="space-y-2">
              {["Voltaje", "Corriente"].map((label) => (
                <div
                  key={label}
                  className="flex justify-between items-center px-2 py-1 rounded-md transition-all duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-sm hover:translate-x-1"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {label}
                  </span>
                  <span className="font-medium text-custom-dark-blue dark:text-custom-yellow">
                    {label === "Voltaje"
                      ? `${data.pvCharger.voltage} V`
                      : `${data.pvCharger.current} A`}
                  </span>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default VictronEnergyFlow;
