const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USUARIO = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const fetchGoodweGraphDataAPI = async ({
  id,
  date,
  range,
  chartIndexId,
  token,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plants/graficas?proveedor=goodwe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, date, range, chartIndexId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch graph data");
    }

    console.log("graph response: ", response.json);
    return await response.json();
  } catch (error) {
    console.error("Graph data fetch error:", error);
    throw error;
  }
};

export const fetchGoodweWeatherDataAPI = async (name, token) => {
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

  //   console.log("Extracted city and country: ", cityAndCountry);

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

export const fetchGoodweRealtimeDataAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/power/realtime/${plantId}?proveedor=goodwe`,
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
