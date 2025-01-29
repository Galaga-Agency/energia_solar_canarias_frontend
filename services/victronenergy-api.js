const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USUARIO = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const fetchVictronEnergyWeatherDataAPI = async ({ lat, lng, token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clima`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lat,
        long: lng,
        provider: "victronenergy",
      }),
    });

    const clonedResponse = response.clone();
    if (!response.ok) {
      const errorData = await clonedResponse.json().catch(() => ({}));
      console.error("API error response:", errorData);
      throw new Error(errorData.message || "Failed to fetch weather data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather data fetch error:", error);
    throw error;
  }
};

export const fetchVictronEnergyGraphDataAPI = async ({
  plantId,
  interval,
  type,
  fechaInicio,
  fechaFin,
  token,
}) => {
  try {
    console.log("API call with params:", {
      plantId,
      interval,
      type,
      fechaInicio,
      fechaFin,
      token,
    });
    const response = await fetch(
      `${API_BASE_URL}/plants/graficas?proveedor=victronenergy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: plantId,
          interval,
          type,
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
    console.log("Graph Data Response:", data);
    return data?.data;
  } catch (error) {
    console.error("Graph data fetch error:", error);
    throw error;
  }
};

export const fetchVictronEnergyRealtimeDataAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/power/realtime/${plantId}?proveedor=victronenergy`,
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
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch real-time data");
    }

    const data = await response.json();
    // console.log("Real-Time Data Response:", data);
    return data?.data;
  } catch (error) {
    console.error("Real-Time data fetch error:", error);
    throw error;
  }
};

export const fetchVictronEnergyEquipmentDetailsAPI = async ({
  plantId,
  token,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/inventario/${plantId}?proveedor=victronenergy`,
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
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch equipment details");
    }

    const data = await response.json();
    return data?.records || null;
  } catch (error) {
    console.error("Equipment details fetch error:", error);
    throw error;
  }
};

export const fetchVictronEnergyAlertsAPI = async ({ plantId, token }) => {
  try {
    // console.log("Fetching alerts for plant:", plantId);
    const response = await fetch(
      `${API_BASE_URL}/plant/alert?proveedor=victronenergy&siteId=${plantId}`,
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
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch alerts data");
    }

    const data = await response.json();
    console.log("Alerts Data Response for victron:", data);
    return data?.data || null;
  } catch (error) {
    console.error("Alerts data fetch error:", error);
    throw error;
  }
};

export const fetchVictronEnergyStatsAPI = async ({ plantId, type, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plants/graficas?proveedor=victronenergy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: plantId,
          type,
          overallstats: true,
        }),
      }
    );

    const clonedResponse = response.clone();
    if (!response.ok) {
      const errorData = await clonedResponse.json().catch(() => ({}));
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch stats data");
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Stats data fetch error:", error);
    throw error;
  }
};
