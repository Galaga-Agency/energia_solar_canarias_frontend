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
      const errorData = await response.text();
      console.error("Error response body:", errorData);
      throw new Error(errorData || "Failed to fetch plant details");
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {}; // Parse if text exists, otherwise return empty object
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
  console.log(
    "Request URL:",
    `/plant/power/realtime/${plantId}?proveedor=solaredge`
  );

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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch real-time data");
    }

    const data = await response.json();
    console.log("API Response Data:", data.data);

    return data.data;
  } catch (error) {
    console.error("Real-time data fetch error:", error);
    throw error;
  }
};

// Fetch weather data for SolarEdge
export const fetchSolarEdgeWeatherDataAPI = async ({ name, token }) => {
  //   console.log("Full address received: ", name);

  const extractCityAndCountry = (address) => {
    if (!address) return null;

    const parts = address.split(",").map((part) => part.trim());
    if (parts.length >= 2) {
      const city = parts[parts.length - 2];
      const country = parts[parts.length - 1];
      return `${city}, ${country}`;
    }

    return null;
  };

  const cityAndCountry = extractCityAndCountry(name);
  if (!cityAndCountry) {
    console.error(
      "Unable to extract city and country from the provided address."
    );
    throw new Error("Invalid address format");
  }

  // console.log("Extracted city and country: ", cityAndCountry);

  try {
    const response = await fetch(`${API_BASE_URL}/clima`, {
      method: "POST",
      body: JSON.stringify({ name: cityAndCountry }),
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
    console.error("Weather data fetch error:", error);
    throw error;
  }
};
