import { fetchGoodweAlertsAPI } from "./goodwe-api";
import { fetchVictronEnergyAlertsAPI } from "./victronenergy-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USUARIO = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const loginRequestAPI = async (userData) => {
  try {
    // console.log("Logging in with data:", userData);
    const email = userData.email;
    const password = userData.password;
    const response = await fetch(`${API_BASE_URL}/esc-backend/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
      },
      body: JSON.stringify({ email, password }),
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
  try {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
      },
      body: JSON.stringify({
        id,
        token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: false,
        data: null,
        message: data.message || "Token validation failed",
      };
    }

    return {
      status: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
      message: error.message || "Token validation failed",
    };
  }
};

export const updateUserAPI = async ({ userId, userData, token, isAdmin }) => {
  try {
    let response;

    if (isAdmin) {
      response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
    } else {
      response = await fetch(`${API_BASE_URL}/usuario`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update user");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
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

export const fetchUsersAPI = async (userToken) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/usuarios?page=1&limit=20000`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch clients");
    }

    const data = await response.json();
    // console.log("users fetched --->", data.data);
    return data.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const deactivateUserAPI = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/usuarios/${userId}/deactivate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to deactivate user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
};

export const deleteUserAPI = async ({ userId, token, isAdmin }) => {
  try {
    console.log("Deleting user with ID:", { userId, token, isAdmin });

    let response;

    if (isAdmin) {
      // Admin endpoint to delete other users
      response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await fetch(`${API_BASE_URL}/usuario`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const fetchUserByIdAPI = async ({ token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuario`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const fetchAllPlantsAPI = async ({
  userId,
  token,
  page = 1,
  pageSize = 200,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plants?page=${page}&pageSize=${pageSize}`,
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
      throw new Error(`Error fetching plants: ${response.statusText}`);
    }

    const plants = await response.json();
    return plants.data;
  } catch (error) {
    console.error("Error fetching plants data:", error);
    throw error;
  }
};

export const fetchPlantsByProviderAPI = async ({ userId, token, provider }) => {
  try {
    const providerParam = encodeURIComponent(
      typeof provider === "object" ? provider.name : provider
    )
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "");
    // console.log("provider passed in api call: ", providerParam);

    const apiUrl = `${API_BASE_URL}/plants?proveedor=${providerParam}`;
    // console.log("apiUrl passed in api call: ", apiUrl);
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API call failed: ${response.statusText}`
      );
    }

    const plantsData = await response.json();

    if (plantsData?.data) {
      plantsData.data = plantsData.data.map((plant) => ({
        ...plant,
        id: plant.id?.toString(),
      }));
    }

    // console.log("plantsData: ", plantsData);
    return plantsData;
  } catch (error) {
    console.error("Error in fetchPlantsByProviderAPI:", error);
    throw error;
  }
};

export const getUserPlantsAPI = async ({ userId, token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/plants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user plants");
    }

    console.log("response from user plants api call: ", response.json);
    return await response.json();
  } catch (error) {
    console.error("Error fetching user plants:", error);
    throw error;
  }
};

export const fetchPlantDetailsAPI = async ({
  userId,
  token,
  plantId,
  provider,
}) => {
  try {
    const providerParam = encodeURIComponent(
      typeof provider === "object" ? provider.name : provider
    )
      .toLowerCase()
      .trim();

    const normalizedPlantId = plantId?.toString();
    const apiUrl = `${API_BASE_URL}/plants/details/${normalizedPlantId}?proveedor=${providerParam}`;

    // console.log("Fetching plant details:", {
    //   url: apiUrl,
    //   plantId: normalizedPlantId,
    //   provider: providerParam,
    // });

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.statusText} for plant ${normalizedPlantId} with provider ${providerParam}`
      );
    }

    // console.log("Plant details API response: ", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in fetchPlantDetailsAPI:", {
      error,
      plantId,
      provider,
      errorMessage: error.message,
    });
    throw error;
  }
};

export const fetchProvidersAPI = async ({ token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/proveedores`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching providers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching providers:", error);
    throw error;
  }
};

export const fetchPlantsWithFilters = async ({ userId, token, filters }) => {
  const queryParams = new URLSearchParams(filters).toString();
  try {
    const response = await fetch(`${API_BASE_URL}/plants?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching filtered plants");
    }

    const plantsData = await response.json();
    return plantsData.data;
  } catch (error) {
    console.error("Error fetching filtered plants:", error);
    throw error;
  }
};

export const fetchEnvironmentalBenefitsAPI = async ({
  plantId,
  provider,
  token,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/plant/benefits/${plantId}?proveedor=${provider}`,
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
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch {
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text) {
      return { gasEmissionSaved: { co2: 0 }, treesPlanted: 0 };
    }

    try {
      const data = JSON.parse(text);
      return (
        data.data?.envBenefits || {
          gasEmissionSaved: { co2: 0 },
          treesPlanted: 0,
        }
      );
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  } catch (error) {
    console.error("Error fetching environmental benefits:", error);
    // Return default values instead of throwing
    return { gasEmissionSaved: { co2: 0 }, treesPlanted: 0 };
  }
};

export const fetchUserAssociatedPlantsAPI = async ({ userId, token }) => {
  try {
    // console.log("Fetching user's associated plants:", { userId, token });
    const response = await fetch(`${API_BASE_URL}/plants?usuarioId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch user's associated plants"
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user's associated plants:", error);
    throw error;
  }
};

export const dissociatePlantFromUserAPI = async ({
  userId,
  plantId,
  provider,
  token,
}) => {
  try {
    // console.log("Dissociating plant from user:", {
    //   userId,
    //   plantId,
    //   provider,
    //   token,
    // });
    const response = await fetch(
      `${API_BASE_URL}/usuarios/relacionar?idplanta=${plantId}&idusuario=${userId}&proveedor=${provider}`,
      {
        method: "DELETE",
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
      throw new Error(
        errorData.message || "Failed to dissociate plant from user"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error dissociating plant from user:", error);
    throw error;
  }
};

export const associatePlantToUserAPI = async ({
  userId,
  plantId,
  provider,
  token,
}) => {
  try {
    // console.log("Associating plant to user:", {
    //   userId,
    //   plantId,
    //   provider,
    //   token,
    // });
    const response = await fetch(
      `${API_BASE_URL}/usuarios/relacionar?idplanta=${plantId}&idusuario=${userId}&proveedor=${provider}`,
      {
        method: "POST",
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
      throw new Error(errorData.message || "Failed to associate plant to user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error associating plant to user:", error);
    throw error;
  }
};

export const sendPasswordResetEmailAPI = async (email) => {
  try {
    console.log("Sending password reset email to:", email);
    const response = await fetch(`${API_BASE_URL}/forgot/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
      },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to send password reset email"
      );
    }
    // console.log("respuesta sservidor", response.json);
    return await response.json();
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

export const updatePasswordAPI = async (token, newPassword) => {
  try {
    // console.log("Updating password with token:", token);
    const response = await fetch(`${API_BASE_URL}/change/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
      },
      body: JSON.stringify({
        token,
        password: newPassword,
        // Add any other required fields your API expects
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update password");
    }

    return await response.json();
  } catch (error) {
    console.error("Password update error:", error);
    throw error;
  }
};

export const updateUserProfileAPI = async ({
  userId,
  userData,
  token,
  isAdmin,
}) => {
  try {
    let response;

    if (isAdmin) {
      response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
    } else {
      response = await fetch(`${API_BASE_URL}/usuario`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update user");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const createUserAPI = async ({ userData, token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }

    const data = await response.json();
    console.log("API response for createUserAPI:", data);
    return data.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const generateApiKeyAPI = async ({ token }) => {
  console.log("token passed for api key -----", token);
  try {
    const response = await fetch(`${API_BASE_URL}/usuario/bearerToken`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate API key");
    }

    const data = await response.json();
    console.log("data for token -----", data);

    return data;
  } catch (error) {
    console.error("Error generating API key:", error);
    throw error;
  }
};

export const fetchAssociatedUsersAPI = async ({ plantId, provider, token }) => {
  try {
    // console.log("Fetching associated users for plant:", {
    //   plantId,
    //   provider,
    //   token,
    // });
    const response = await fetch(
      `${API_BASE_URL}/plants?plantId=${plantId}&proveedor=${provider}`,
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
      throw new Error(errorData.message || "Failed to fetch associated users");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching associated users:", error);
    throw error;
  }
};

export const uploadProfilePictureAPI = async ({ formData, token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuario/imagen`, {
      method: "POST",
      headers: {
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      console.error("API error response:", data);
      throw new Error(data.message || "Failed to upload profile picture");
    }

    return data;
  } catch (error) {
    console.error("Error in uploadProfilePictureAPI:", error);
    throw error;
  }
};

export const deleteProfilePictureAPI = async ({ token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuario/imagen`, {
      method: "DELETE",
      headers: {
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete profile picture");
    }

    return data;
  } catch (error) {
    console.error("Error in deleteProfilePictureAPI:", error);
    throw error;
  }
};

export const downloadMobileAppAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mobile-app/download`, {
      method: "GET",
      headers: {
        usuario: USUARIO,
        apiKey: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download app");
    }

    // Get the blob from response
    const blob = await response.blob();

    // Create download URL
    const downloadUrl = window.URL.createObjectURL(blob);

    // Create temporary link
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Set correct filename based on platform
    const isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    link.download = isIOS ? "app.apfs" : "app.apk";

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
};

export const fetchTotalRealPriceAPI = async ({ plantId, provider, token }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/totalrealprice?plantId=${plantId}&proveedor=${provider}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: USUARIO,
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching total real price: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error("Error fetching total real price:", error);
    throw error;
  }
};
