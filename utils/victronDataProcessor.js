// Utility functions for processing Victron energy system data

// Safely find a value in records based on description and optional device
const findValue = (records, description, device = null) => {
  if (!records || !description) return null;

  const record = records.find(
    (r) =>
      r.description === description && (device ? r.Device === device : true)
  );

  return record?.formattedValue || record?.rawValue || null;
};

// Safely find a numeric value in records
const findNumericValue = (records, description, device = null) => {
  const value = findValue(records, description, device);
  return value ? parseFloat(String(value).replace(/[^\d.-]/g, "")) : 0;
};

// Extract MPPT (Maximum Power Point Tracking) data for a specific solar charger instance
const findMPPTValue = (records, mpptId) => {
  if (!records || !mpptId) return null;

  const mpptRecords = records.filter(
    (r) => r.Device === "Solar Charger" && r.instance === mpptId
  );

  if (!mpptRecords.length) return null;

  const findRecordValue = (idDataAttribute) =>
    mpptRecords.find((r) => r.idDataAttribute === idDataAttribute);

  const voltageRecord = findRecordValue(86);
  const currentRecord = findRecordValue(442);

  if (!voltageRecord || !currentRecord) return null;

  const voltage = parseFloat(voltageRecord.formattedValue);
  const power = parseFloat(currentRecord.formattedValue);

  // Calculate current safely
  const current = voltageRecord.rawValue
    ? Math.round((power / voltage) * 10) / 10
    : 0;

  return {
    voltage: isNaN(voltage) ? 0 : voltage,
    current: isNaN(current) ? 0 : current,
    power: isNaN(power) ? 0 : power,
  };
};

// Get unique MPPT instances from records
const getMPPTInstances = (records) => {
  if (!records) return [];

  return [
    ...new Set(
      records.filter((r) => r.Device === "Solar Charger").map((r) => r.instance)
    ),
  ];
};

// Get inverter phases from records
const getInverterPhases = (records) => {
  if (!records) return [];

  return [
    ...new Set(
      records
        .filter(
          (r) =>
            r.description?.includes("L") && r.description?.includes("Power")
        )
        .map((r) => r.description.match(/L(\d)/)?.[1])
        .filter(Boolean)
    ),
  ].sort();
};

// Find battery state based on raw value and enum values
const findBatteryState = (records) => {
  const stateRecord = records.find(
    (r) => r.description === "Battery state" && r.Device === "System overview"
  );

  if (!stateRecord) return "Unknown";

  const stateValue = stateRecord.rawValue;
  const stateEnumValues = stateRecord.dataAttributeEnumValues || [];

  const stateMapping = stateEnumValues.reduce((acc, item) => {
    acc[item.valueEnum] = item.nameEnum;
    return acc;
  }, {});

  return stateMapping[stateValue] || stateRecord.formattedValue || "Unknown";
};

// Process Victron energy system records into a structured data object
export const processVictronData = (records) => {
  if (!records || !records.length) return null;

  // MPPT (Solar Charger) Processing
  const mpptInstances = getMPPTInstances(records);
  const mpptData = {};
  mpptInstances.forEach((instance) => {
    const mpptValue = findMPPTValue(records, instance);
    if (mpptValue) {
      mpptData[instance] = mpptValue;
    }
  });

  const pvCharger = {
    power: findNumericValue(records, "PV - DC-coupled"),
    mpptData,
  };

  // Inverter Processing
  const phases = getInverterPhases(records);
  const inverterData = {};

  phases.forEach((phase) => {
    inverterData[`L${phase}`] = {
      power: findNumericValue(records, `L${phase} Power`),
      voltage: findNumericValue(records, `L${phase} Voltage`),
      current: findNumericValue(records, `L${phase} Current`),
    };
  });

  const inverter = {
    ...inverterData,
    totalPower: Object.values(inverterData).reduce(
      (sum, phase) => sum + phase.power,
      0
    ),
  };

  // AC Input Source
  const acSource =
    findValue(records, "AC-Input", "System overview") ||
    findValue(records, "AC Input 1 source", "System overview") ||
    "Unknown";

  const totalGridPowerRecord = records.find(
    (r) => r.code === "g1" && r.Device === "System overview"
  );
  const totalGridPower = totalGridPowerRecord
    ? parseFloat(totalGridPowerRecord.rawValue)
    : 0;

  const gridPower = {
    totalPower: totalGridPower, //  Uses "g1" rawValue
    L1: {
      power: findNumericValue(records, "Grid L1 Power", "System overview"),
      voltage: findNumericValue(records, "Grid L1 Voltage", "System overview"),
      current: findNumericValue(records, "Grid L1 Current", "System overview"),
    },
    L2: {
      power: findNumericValue(records, "Grid L2 Power", "System overview"),
      voltage: findNumericValue(records, "Grid L2 Voltage", "System overview"),
      current: findNumericValue(records, "Grid L2 Current", "System overview"),
    },
    L3: {
      power: findNumericValue(records, "Grid L3 Power", "System overview"),
      voltage: findNumericValue(records, "Grid L3 Voltage", "System overview"),
      current: findNumericValue(records, "Grid L3 Current", "System overview"),
    },
  };

  // Loads Processing
  const loads = {
    L1: {
      power: findNumericValue(records, "AC Consumption L1"),
      frequency: findNumericValue(records, "Phase 1 frequency"),
    },
    L2: {
      power: findNumericValue(records, "AC Consumption L2"),
      frequency: findNumericValue(records, "Phase 2 frequency"),
    },
    L3: {
      power: findNumericValue(records, "AC Consumption L3"),
      frequency: findNumericValue(records, "Phase 3 frequency"),
    },
    totalPower:
      findNumericValue(records, "AC Consumption L1") +
      findNumericValue(records, "AC Consumption L2") +
      findNumericValue(records, "AC Consumption L3"),
  };

  return {
    acInput: {
      state: acSource,
    },
    battery: {
      soc: findNumericValue(records, "Battery SOC"),
      voltage: findNumericValue(records, "Voltage", "Battery Monitor"),
      current: findNumericValue(records, "Current", "Battery Monitor"),
      temp: findNumericValue(records, "Battery temperature"),
      dcPower: findNumericValue(records, "Battery Power"),
      state: findBatteryState(records),
    },
    inverter,
    pvCharger,
    gridPower,
    loads,
    solarYield: findNumericValue(records, "PV - DC-coupled"),
    generator: {
      status: findValue(records, "Manual start", "Generator"),
      uptime: findValue(records, "Manual start timer", "Generator"),
    },
    fromToGrid:
      records.find((r) => r.code === "from_to_grid")?.formattedValue || "-",
  };
};

// Export utility functions for potential standalone use
export {
  findValue,
  findNumericValue,
  findMPPTValue,
  getMPPTInstances,
  getInverterPhases,
  findBatteryState,
};
