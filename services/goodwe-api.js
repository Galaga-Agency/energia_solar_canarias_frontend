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
