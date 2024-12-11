import React from "react";
import { useTranslation } from "next-i18next";
import { Clock } from "lucide-react";
import moment from "moment";
import "moment/locale/es";

const TankData = ({ tankData = {} }) => {
  const { t } = useTranslation();

  const getTankInstances = () => {
    const tankInstances = [];

    if (tankData?.tf?.instances) {
      Object.keys(tankData.tf.instances)
        .filter((id) => tankData.tf.instances[id]?.formattedValue === "Fuel")
        .forEach((instanceId) => {
          const fluidLevel =
            tankData.tr?.instances?.[instanceId]?.formattedValue;
          const percentage = parseInt(fluidLevel?.replace("%", "") || 0);
          const timestamp = tankData.tr?.instances?.[instanceId]?.timestamp;

          tankInstances.push({
            id: instanceId,
            formattedValue:
              tankData.tl?.instances?.[instanceId]?.formattedValue,
            remainingFluid: fluidLevel,
            percentage: Math.min(percentage, 100),
            lastUpdate: timestamp ? parseInt(timestamp) : null,
          });
        });
    }

    return tankInstances;
  };

  const getFillGradient = (percentage) => {
    if (percentage <= 30) {
      return {
        gradient: "tankLowGradient",
        animation: "0.8;0.9;0.8",
      };
    }
    return {
      gradient: "tankNormalGradient",
      animation: "0.9;1;0.9",
    };
  };

  const renderTankBlock = (instance) => {
    const { id, formattedValue, remainingFluid, percentage, lastUpdate } =
      instance;

    moment.locale("es");
    const timeAgo = lastUpdate ? moment(lastUpdate * 1000).fromNow() : null;

    const heightPercentage = Math.min(Math.max(0, percentage), 100);
    const fluidHeight = heightPercentage * 1.5;
    const yPosition = 175 - fluidHeight;
    const { gradient, animation } = getFillGradient(percentage);

    return (
      <div
        key={id}
        className="flex-1 bg-white/80 dark:bg-custom-dark-blue/80 rounded-lg p-4 backdrop-blur-sm shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-custom-dark-blue dark:text-custom-yellow">
            {t("Combustible")} #{id}
          </h3>
          {timeAgo !== null && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 justify-end">
              <Clock size={14} />
              {timeAgo && (
                <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[70%]">
                  {t("lastUpdated")} {timeAgo}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-8">
          <div className="w-20 flex-shrink-0">
            <svg
              viewBox="0 0 120 200"
              className="w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="tankNormalGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>
                <linearGradient
                  id="tankLowGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#FB923C" />
                </linearGradient>
                <filter
                  id="innerShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="3"
                    result="blur"
                  />
                  <feOffset in="blur" dx="0" dy="2" />
                  <feComposite in="SourceGraphic" operator="over" />
                </filter>
                <filter id="liquidFilter">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                  <feColorMatrix
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7"
                  />
                </filter>
                <linearGradient id="glassGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Outer container with enhanced depth */}
              <rect
                x="10"
                y="10"
                width="100"
                height="180"
                rx="15"
                fill="#f8f9fa"
                className="dark:fill-gray-800"
                filter="url(#innerShadow)"
              />

              {/* Inner tank frame */}
              <rect
                x="20"
                y="20"
                width="80"
                height="160"
                rx="10"
                fill="#ffffff"
                className="dark:fill-gray-700"
              />

              {/* Level indicator background */}
              <rect
                x="25"
                y="25"
                width="70"
                height="150"
                rx="8"
                fill="#f8f9fa"
                className="dark:fill-gray-900"
              />

              {/* Fluid level with dynamic gradient */}
              <rect
                x="25"
                y={yPosition}
                width="70"
                height={fluidHeight}
                rx="8"
                fill={`url(#${gradient})`}
                filter="url(#liquidFilter)"
                className="transition-all duration-700"
              >
                <animate
                  attributeName="opacity"
                  values={animation}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </rect>

              {/* Level markers with improved visibility */}
              {[0, 25, 50, 75, 100].map((mark) => (
                <g key={mark}>
                  <text
                    x="105"
                    y={180 - mark * 1.5}
                    fontSize="10"
                    className="fill-gray-500 dark:fill-gray-400"
                    fontWeight="500"
                  >
                    {mark}
                  </text>
                  <line
                    x1="25"
                    x2="95"
                    y1={175 - mark * 1.5}
                    y2={175 - mark * 1.5}
                    stroke="#e5e5e5"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    className="dark:stroke-gray-600"
                  />
                </g>
              ))}

              {/* Enhanced glass effect */}
              <rect
                x="25"
                y="25"
                width="70"
                height="150"
                rx="8"
                fill="url(#glassGradient)"
                className="pointer-events-none"
              />

              {/* Container borders and highlights */}
              <rect
                x="20"
                y="20"
                width="80"
                height="160"
                rx="10"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="2"
                className="dark:stroke-gray-600"
              />
              <path
                d="M30,30 Q60,45 90,30"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                opacity="0.5"
              />
            </svg>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <div className="text-2xl font-semibold text-custom-dark-blue dark:text-custom-yellow">
                {remainingFluid || "--"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t("Current Level")}
              </div>
            </div>
            <div>
              <div className="text-lg text-custom-dark-blue dark:text-custom-yellow">
                {formattedValue || "--"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t("Volume")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tankInstances = getTankInstances();

  if (tankInstances.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 min-h-0">
      {tankInstances.map(renderTankBlock)}
    </div>
  );
};

export default TankData;
