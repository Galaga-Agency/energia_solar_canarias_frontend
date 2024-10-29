import axios from "axios";

// Function to create a delay to avoid 429 Too Many Requests response
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_CONCURRENT_REQUESTS = 3;
let activeRequests = 0;

// Fetch all sites
export async function fetchAllSitesSolarEdgeAPI() {
  await delay(1500); // Initial delay

  try {
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/sites/list?api_key=${process.env.NEXT_PUBLIC_SOLAREDGE_API_KEY}`
    );
    const sites = response.data.sites;
    console.log("All Sites:", sites);
    return sites;
  } catch (error) {
    console.error("Error fetching sites:", error);
  }
}

// Fetch site details
export async function fetchSiteDataSolarEdgeAPI(siteId) {
  await delay(3000); // Initial delay

  try {
    while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
      await delay(100); // Wait until a slot is available
    }

    activeRequests++;

    const apiKey = process.env.NEXT_PUBLIC_SOLAREDGE_API_KEY;
    const detailsResponse = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/site/${siteId}/details?api_key=${apiKey}`
    );

    console.log(`Site Details for Site ID ${siteId}:`, detailsResponse.data);
    return detailsResponse.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error(`Received 429 response for site ID ${siteId}. Retrying...`);
      await delay(5000); // Wait before retrying
      return fetchSiteDataSolarEdgeAPI(siteId); // Retry the request
    }
    console.error(`Error fetching data for site ID ${siteId}:`, error);
  } finally {
    activeRequests--;
  }
}

// Fetch energy data for the site
export async function fetchSiteEnergyDataSolarEdgeAPI(
  siteId,
  startDate,
  endDate,
  timeUnit
) {
  await delay(3000); // Initial delay

  try {
    while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
      await delay(100);
    }

    activeRequests++;

    const apiKey = process.env.NEXT_PUBLIC_SOLAREDGE_API_KEY;
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/site/${siteId}/energy?timeUnit=${timeUnit}&startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`
    );

    console.log(`Energy Data for Site ID ${siteId}:`, response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error(`Received 429 response for site ID ${siteId}. Retrying...`);
      await delay(5000);
      return fetchSiteEnergyDataSolarEdgeAPI(
        siteId,
        startDate,
        endDate,
        timeUnit
      );
    }
    console.error(`Error fetching energy data for site ID ${siteId}:`, error);
  } finally {
    activeRequests--;
  }
}

// Fetch current energy production
export const fetchCurrentEnergyProductionAPI = async (siteId) => {
  await delay(1000);

  const apiKey = process.env.NEXT_PUBLIC_SOLAREDGE_API_KEY;
  const now = new Date();
  const endDate = now.toISOString().slice(0, 19).replace("T", " "); // Current time
  const startDate = new Date(now.getTime() - 15 * 60000) // 15 minutes ago
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // 15 minutes before now

  try {
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/site/${siteId}/energy?timeUnit=QUARTER_OF_AN_HOUR&startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`
    );

    console.log(
      `Current Energy Production for Site ID ${siteId}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching current energy production for site ID ${siteId}:`,
      error
    );
  }
};

// Function to start fetching energy data every 5 seconds
export const startFetchingEnergyData = (siteId) => {
  fetchCurrentEnergyProductionAPI(siteId); // Initial fetch

  // Set an interval to fetch data every 5 seconds
  const intervalId = setInterval(() => {
    fetchCurrentEnergyProductionAPI(siteId);
  }, 10000); // 5000 milliseconds = 5 seconds

  return intervalId;
};

// Fetch all sites data
export async function fetchAllSitesDataSolarEdgeAPI() {
  const sites = await fetchAllSitesSolarEdgeAPI();
  if (sites) {
    for (const site of sites) {
      const siteData = await fetchSiteDataSolarEdgeAPI(site.id);
      console.log(`Data for Site ${site.name}:`, siteData);
      // Optionally, fetch energy data as well
      const energyData = await fetchSiteEnergyDataSolarEdgeAPI(
        site.id,
        "2023-10-01",
        "2023-10-02",
        "DAY"
      );
      console.log(`Energy Data for Site ${site.name}:`, energyData);
    }
  }
}
