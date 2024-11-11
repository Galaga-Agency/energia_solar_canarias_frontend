const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USUARIO = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const loginRequestAPI = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/esc-backend/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed (unknown error)");
    }

    return await response.json();
  } catch (error) {
    console.error("Login request error:", error);
    throw error;
  }
};

export const validateTokenRequestAPI = async (id, token) => {
  const requestBody = JSON.stringify({ id, token });

  try {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      body: requestBody,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response
        .clone()
        .json()
        .catch(() => {
          return { message: "Unknown error" };
        });

      return {
        status: "error",
        code: response.status,
        message: errorData.message || "Unknown error",
        errors: errorData,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      status: "error",
      code: 0,
      message: error.message || "Unknown error",
      errors: error,
    };
  }
};

export const updateUserProfileAPI = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      usuario: USUARIO,
      apiKey: API_KEY,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Profile update failed");
  }

  return await response.json();
};

export const deleteNotificationAPI = async (notificationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }

    return await response.json();
  } catch (error) {
    console.error("Delete notification error:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email) => {};

export const fetchUsersAPI = async (userToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch clients");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVRYTHING BELOW THIS SHOULD BE REMOVED ONCE THE ENTIRE BACKEND IS FINISHED
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fetchPlantsMock = async (userId) => {
  try {
    const response = await fetch("/plants.json");
    if (!response.ok) {
      throw new Error(`Error fetching plants: ${response.statusText}`);
    }
    const plants = await response.json();

    console.log("plants returned: ", plants);

    return plants;
  } catch (error) {
    console.error("Error fetching plants data:", error);
    throw error;
  }
};
