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
    const body =
      range === undefined
        ? { id, date, chartIndexId, full_script: "false" }
        : { id, date, range, chartIndexId };

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
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch graph data");
    }

    // console.log("graph response: ", response.json);
    return await response.json();
  } catch (error) {
    console.error("Graph data fetch error:", error);
    throw error;
  }
};

export const fetchGoodweWeatherDataAPI = async (name, token) => {
  // Handle the case when we don't have a valid address format
  const extractCityAndCountry = (address) => {
    if (!address) return null;

    // Handle cases like "Street name, City, Country"
    const parts = address.split(",").map((part) => part.trim());

    if (parts.length >= 2) {
      // If there are at least two parts, assume last is country and second last is city
      const city = parts[parts.length - 2];
      const country = parts[parts.length - 1];
      return `${city}, ${country}`;
    } else if (parts.length === 1) {
      // If only one part is given, assume it's a city or street
      return parts[0]; // Return as-is if no clear city/country split
    }

    // If the address format doesn't meet expectations
    return address;
  };

  // First check if lat and lng are available
  let location = null;
  if (name) {
    // Use name as a fallback (can be city, street, or combined address)
    location = extractCityAndCountry(name);
  }

  // If we still don't have a valid location, log the error
  if (!location) {
    console.error("No valid location data provided.");
    throw new Error("Invalid address or coordinates.");
  }

  console.log("Fetching weather data for:", location);

  try {
    const response = await fetch(`${API_BASE_URL}/clima`, {
      method: "POST",
      body: JSON.stringify({ name: location }), // Send the available location
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
    // console.log("API Response Data:", data.data);

    return data.data;
  } catch (error) {
    console.error("Real-time data fetch error:", error);
    throw error;
  }
};

export const fetchGoodweEquipmentDetailsAPI = async ({ plantId, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/inventario/${plantId}?proveedor=goodwe`,
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
      throw new Error(errorData.message || "Failed to fetch equipment details");
    }

    const data = await response.json();

    // console.log("API Response Data:", data.data);

    return data.data.data;
  } catch (error) {
    console.error("Equipment details fetch error:", error);
    throw error;
  }
};

export const fetchGoodweActiveNotificationsAPI = async ({
  token,
  pageIndex = 1,
  pageSize,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/alert?proveedor=goodwe&pageIndex=${pageIndex}&pageSize=${pageSize}&status=0`,
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
      throw new Error(errorData.message || "Failed to fetch active alerts");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Active alerts fetch error:", error);
    throw error;
  }
};

export const fetchGoodweResolvedNotificationsAPI = async ({
  token,
  pageIndex = 1,
  pageSize,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/alert?proveedor=goodwe&pageIndex=${pageIndex}&pageSize=${pageSize}&status=1`,
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
      throw new Error(errorData.message || "Failed to fetch resolved alerts");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Resolved alerts fetch error:", error);
    throw error;
  }
};
