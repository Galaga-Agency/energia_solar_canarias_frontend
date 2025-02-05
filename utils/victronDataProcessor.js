// This file only to process victron energy's real time data frfom the API response

// Base utility to find values in records
const findValue = (records, description, device = null) => {
  if (!records?.length || !description) return null;

  // Look for exact matches first
  let record = records.find((r) => {
    const descriptionMatch =
      r.description === description ||
      r.dbusPath === description ||
      r.code === description;

    const deviceMatch = device ? r.Device === device : true;
    return descriptionMatch && deviceMatch;
  });

  const value = record?.formattedValue || record?.rawValue;
  // console.log(`Finding value for: ${description}, device: ${device}`, {
  //   found: record ? "yes" : "no",
  //   value,
  //   record: record || "not found",
  // });

  return value;
};

// Get numeric values from records, handling units and formatting
const findNumericValue = (records, description, device = null) => {
  const value = findValue(records, description, device);
  if (!value) return 0;

  // Clean the string and parse the number
  const numericStr = String(value).replace(/[^\d.-]/g, "");
  const parsedValue = parseFloat(numericStr) || 0;

  // console.log(`Converting to number: ${value} -> ${parsedValue}`);
  return parsedValue;
};

// Process grid data for a specific phase
const getGridPhaseData = (records, phase) => {
  if (!records?.length) return { power: 0, voltage: 235, current: 0 };

  // Get power from System overview
  const powerRecord = records.find(
    (r) =>
      r.Device === "System overview" &&
      (r.code === `g${phase[1]}` || r.dbusPath === `/Ac/Grid/${phase}/Power`)
  );

  // Get voltage from VE.Bus System
  const voltageRecord = records.find(
    (r) =>
      r.Device === "VE.Bus System" &&
      (r.code === `IV${phase[1]}` || r.dbusPath === `/Ac/ActiveIn/${phase}/V`)
  );

  // Get current from VE.Bus System
  const currentRecord = records.find(
    (r) =>
      r.Device === "VE.Bus System" &&
      (r.code === `II${phase[1]}` || r.dbusPath === `/Ac/ActiveIn/${phase}/I`)
  );

  // console.log("Found grid records:", {
  //   power: powerRecord,
  //   voltage: voltageRecord,
  //   current: currentRecord,
  // });

  const power = powerRecord
    ? parseFloat(powerRecord.formattedValue || powerRecord.rawValue) || 0
    : 0;
  const voltage = voltageRecord
    ? parseFloat(voltageRecord.formattedValue || voltageRecord.rawValue) || 235
    : 235;
  const current = currentRecord
    ? parseFloat(currentRecord.formattedValue || currentRecord.rawValue) || 0
    : 0;

  const phaseData = { power, voltage, current };

  return phaseData;
};

// Process loads data for a specific phase
const getLoadPhaseData = (records, phase) => {
  // Log all relevant frequency records
  const freqRecords = records.filter(
    (r) =>
      r.Device === "VE.Bus System" &&
      (r.description?.toLowerCase().includes("freq") ||
        r.dbusPath?.toLowerCase().includes("freq") ||
        r.code?.toLowerCase().includes("f"))
  );

  // console.log(`All frequency records for ${phase}:`, freqRecords);

  // Get power from standard consumption
  const powerRecord = records.find(
    (r) =>
      r.description === `AC Consumption ${phase}` ||
      r.dbusPath === `/Ac/Consumption/${phase}/Power`
  );

  // Get frequency from VE.Bus System
  const frequencyRecord = records.find(
    (r) =>
      r.Device === "VE.Bus System" &&
      (r.code === `IF${phase[1]}` || // IF1 for L1
        r.code === `OF${phase[1]}` || // OF1 for L1
        r.dbusPath?.includes(`/Ac/ActiveIn/${phase}/F`) ||
        r.dbusPath?.includes(`/Ac/Out/${phase}/F`))
  );

  // console.log(`Found load records for ${phase}:`, {
  //   power: powerRecord,
  //   frequency: frequencyRecord,
  // });

  const power = powerRecord
    ? parseFloat(powerRecord.formattedValue || powerRecord.rawValue) || 0
    : 0;
  const frequency = frequencyRecord
    ? parseFloat(frequencyRecord.formattedValue || frequencyRecord.rawValue) ||
      0
    : 0;

  const phaseData = { power, frequency };
  console.log(`📊 Load data for ${phase}:`, phaseData);

  return phaseData;
};

// Get MPPT (solar charger) data
const findMPPTValue = (records, mpptId) => {
  if (!records?.length || !mpptId) return null;

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
  const current = voltage ? Math.round((power / voltage) * 10) / 10 : 0;

  return {
    voltage: isNaN(voltage) ? 0 : voltage,
    current: isNaN(current) ? 0 : current,
    power: isNaN(power) ? 0 : power,
  };
};

// Get list of MPPT instances
const getMPPTInstances = (records) => {
  if (!records?.length) return [];

  return [
    ...new Set(
      records.filter((r) => r.Device === "Solar Charger").map((r) => r.instance)
    ),
  ];
};

// Get list of inverter phases
const getInverterPhases = (records) => {
  if (!records?.length) return [];

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

// Get battery state
const findBatteryState = (records) => {
  const stateRecord = records?.find(
    (r) => r.description === "Battery state" && r.Device === "System overview"
  );

  if (!stateRecord) return "Unknown";

  const stateMapping = (stateRecord.dataAttributeEnumValues || []).reduce(
    (acc, item) => {
      acc[item.valueEnum] = item.nameEnum;
      return acc;
    },
    {}
  );

  return (
    stateMapping[stateRecord.rawValue] ||
    stateRecord.formattedValue ||
    "Unknown"
  );
};

// Main function to process all Victron data
const processVictronData = (records) => {
  if (!records?.length) {
    console.warn("No records to process");
    return null;
  }

  // Process MPPT data
  const mpptInstances = getMPPTInstances(records);
  const mpptData = {};
  mpptInstances.forEach((instance) => {
    const mpptValue = findMPPTValue(records, instance);
    if (mpptValue) mpptData[instance] = mpptValue;
  });

  // Process grid data
  const gridPower = {
    L1: getGridPhaseData(records, "L1"),
    L2: getGridPhaseData(records, "L2"),
    L3: getGridPhaseData(records, "L3"),
  };

  // Calculate total grid power
  gridPower.totalPower = Object.values(gridPower)
    .filter((phase) => typeof phase === "object")
    .reduce((sum, phase) => sum + (phase.power || 0), 0);

  // console.log("Final grid power data:", gridPower);

  // Process loads data
  const loads = {
    L1: getLoadPhaseData(records, "L1"),
    L2: getLoadPhaseData(records, "L2"),
    L3: getLoadPhaseData(records, "L3"),
  };

  // Calculate total load power
  loads.totalPower = Object.values(loads)
    .filter((phase) => typeof phase === "object")
    .reduce((sum, phase) => sum + (phase.power || 0), 0);

  // Build and return the complete data object
  const processedData = {
    acInput: {
      state:
        findValue(records, "AC-Input", "System overview") ||
        findValue(records, "AC Input 1 source", "System overview") ||
        "Unknown",
    },
    battery: {
      soc: findNumericValue(records, "Battery SOC"),
      voltage: findNumericValue(records, "Voltage", "Battery Monitor"),
      current: findNumericValue(records, "Current", "Battery Monitor"),
      temp: findNumericValue(records, "Battery temperature"),
      dcPower: findNumericValue(records, "Battery Power"),
      state: findBatteryState(records),
    },
    pvCharger: {
      power: findNumericValue(records, "PV - DC-coupled"),
      mpptData,
    },
    gridPower,
    loads,
    solarYield: findNumericValue(records, "PV - DC-coupled"),
    generator: {
      status: findValue(records, "Manual start", "Generator"),
      uptime: findValue(records, "Manual start timer", "Generator"),
    },
  };

  // console.log("✅ Final processed data:", processedData);
  return processedData;
};

export {
  processVictronData,
  findValue,
  findNumericValue,
  getGridPhaseData,
  findMPPTValue,
  getMPPTInstances,
  getInverterPhases,
  findBatteryState,
};
