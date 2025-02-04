/*
 * Utility functions for handling power-related calculations and formatting. Used in VictronEnergyFlow and other energy monitoring components.
 * formatPowerValue: Formats power values to display with proper units
 * calculateGridFlow: Calculates grid power flow based on load, solar and battery values
 */

export const formatPowerValue = (value) => {
  if (!value) return "0 W";
  return `${value.toFixed(0)} W`;
};

export const calculateGridFlow = (energyData) => {
  const loadDemand = energyData.loads.totalPower;
  const solarSupply = energyData.pvCharger.power;
  const batteryFlow = Math.abs(energyData.battery.dcPower);

  // If battery is discharging (negative dcPower)
  if (energyData.battery.dcPower < 0) {
    // Grid = Loads - (Solar + Battery discharge)
    return loadDemand - (solarSupply + batteryFlow);
  } else {
    // If battery is charging
    // Grid = Loads - Solar + Battery charging
    return loadDemand - solarSupply + batteryFlow;
  }
};
