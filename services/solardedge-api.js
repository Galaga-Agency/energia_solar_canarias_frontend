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
    console.log("Graph Data Response:", data);

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
    console.log("Overview data response:", data);
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
  console.log("passed in api call: ", {
    plantId,
    timeUnit,
    date,
    token,
  });
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/grafica/comparacion/${plantId}?proveedor=solaredge`,
      {
        method: "GET",
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

    const clonedResponse = response.clone();

    if (!response.ok) {
      const errorData = await clonedResponse.json().catch(() => ({}));
      console.error("Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch comparison data");
    }

    const data = await response.json();
    console.log("Comparison Data Response:", data);

    return data?.data;
  } catch (error) {
    console.error("Error fetching SolarEdge comparison data:", error);
    throw error;
  }
};
