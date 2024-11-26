const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USUARIO = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Fetch plant details for SolarEdge
export const fetchSolarEdgePlantDetailsAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plants/details/${plantId}?proveedor=solaredge`,
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
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch plant details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching SolarEdge plant details:", error);
    throw error;
  }
};

// Fetch SolarEdge graph data
export const fetchSolarEdgeGraphDataAPI = async ({
  plantId,
  date,
  range,
  chartType,
  token,
}) => {
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
        body: JSON.stringify({ plantId, date, range, chartType }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch graph data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching SolarEdge graph data:", error);
    throw error;
  }
};

// Fetch real-time data for SolarEdge
export const fetchSolarEdgeRealtimeDataAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plants/realtime/${plantId}?proveedor=solaredge`,
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
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch real-time data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching SolarEdge real-time data:", error);
    throw error;
  }
};

// Fetch weather data for SolarEdge
export const fetchSolarEdgeWeatherDataAPI = async ({ name, token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/clima`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch weather data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching SolarEdge weather data:", error);
    throw error;
  }
};
