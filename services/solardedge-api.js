const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USUARIO = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const fetchSolarEdgeGraphDataAPI = async ({
  id,
  dia,
  fechaInicio,
  fechaFin,
  token,
}) => {
  // console.log("Token used for API call:", {
  //   id,
  //   dia,
  //   fechaInicio,
  //   fechaFin,
  // });

  try {
    const response = await fetch(
      `${API_BASE_URL}/plants/graficas?proveedor=solaredge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          dia,
          fechaInicio,
          fechaFin,
        }),
      }
    );

    const clonedResponse = response.clone();

    if (!response.ok) {
      const errorData = await clonedResponse.json().catch(() => ({}));
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch graph data");
    }

    const data = await response.json();
    // console.log("Graph Data Response:", data.data);

    return data?.data;
  } catch (error) {
    console.error("Error fetching SolarEdge graph data:", error);
    throw error;
  }
};

export const fetchSolarEdgeRealtimeDataAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/power/realtime/${plantId}?proveedor=solaredge`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const clonedResponse = response.clone();

    if (!response.ok) {
      const errorData = await clonedResponse.json().catch(() => ({}));
      console.error("API Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch real-time data");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Real-time data fetch error:", error);
    throw error;
  }
};

export const fetchSolarEdgeWeatherDataAPI = async ({ name, token }) => {
  const extractCityAndCountry = (address) => {
    if (!address) return null;
    const parts = address.split(",").map((part) => part.trim());
    return parts.length >= 2
      ? `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
      : null;
  };

  const cityAndCountry = extractCityAndCountry(name);
  if (!cityAndCountry) {
    throw new Error("Invalid address format");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/clima`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: cityAndCountry }),
    });

    const clonedResponse = response.clone();

    if (!response.ok) {
      const errorData = await clonedResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch weather data");
    }

    return await response.json();
  } catch (error) {
    console.error("Weather data fetch error:", error);
    throw error;
  }
};

export const fetchSolarEdgeOverviewAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/overview/${plantId}?proveedor=solaredge`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const clonedResponse = response.clone();

    if (!response.ok) {
      const errorData = await clonedResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch overview data");
    }

    const data = await response.json();
    // console.log("Overview data response:", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching SolarEdge overview:", error);
    throw error;
  }
};

export const fetchSolarEdgeComparisonGraphAPI = async ({
  plantId,
  timeUnit,
  date,
  token,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/grafica/comparacion/${plantId}?proveedor=solaredge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timeUnit,
          date,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch comparison data");
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error fetching SolarEdge comparison data:", error);
    throw error;
  }
};

export const fetchSolarEdgeInventoryAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/inventario/${plantId}?proveedor=solaredge`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch inventory data");
    }

    const data = await response.json();
    // console.log("data ----------------------> ", data);
    return data?.data?.Inventory;
  } catch (error) {
    console.error("Error fetching SolarEdge inventory:", error);
    throw error;
  }
};

export const fetchBatteryChargingStateAPI = async ({
  plantId,
  startDate,
  endDate,
  token,
}) => {
  try {
    console.log("Attempting battery fetch with params:", {
      plantId,
      fechaInicio: startDate,
      fechaFin: endDate,
    });

    const response = await fetch(
      `${API_BASE_URL}/plant/grafica/bateria/${plantId}?proveedor=solaredge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaInicio: startDate,
          fechaFin: endDate,
        }),
      }
    );

    let result = await response.text();

    try {
      // Find the first complete JSON object by matching braces
      let depth = 0;
      let firstJsonEnd = -1;

      for (let i = 0; i < result.length; i++) {
        if (result[i] === "{") depth++;
        if (result[i] === "}") {
          depth--;
          if (depth === 0) {
            firstJsonEnd = i + 1;
            break;
          }
        }
      }

      // Extract just the first complete JSON object
      const firstJson = result.slice(0, firstJsonEnd);
      console.log("Extracted JSON length:", firstJson.length);

      const data = JSON.parse(firstJson);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch battery charging state"
        );
      }

      console.log("Successfully parsed battery data:", {
        batteriesCount: data?.storageData?.batteryCount,
        telemetriesCount: data?.storageData?.batteries?.[0]?.telemetryCount,
      });

      return data;
    } catch (parseError) {
      console.error("Parse error details:", {
        errorMessage: parseError.message,
        position: parseError.message.match(/position (\d+)/)?.[1],
      });
      throw new Error("Failed to parse battery data response");
    }
  } catch (error) {
    console.error("Error fetching battery charging state:", error);
    throw error;
  }
};
