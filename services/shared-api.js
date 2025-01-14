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
  const requestBody = JSON.stringify({ id, token });

  try {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      body: requestBody,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // For any non-200 response, return a standardized error format
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

export const updateUserAPI = async ({ userId, userData, token }) => {
  try {
    // console.log("updateUserAPI - Request payload:", {
    //   userId,
    //   userData: JSON.stringify(userData),
    //   endpoint: `${API_BASE_URL}/usuarios/${userId}`,
    // });

    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();
    // console.log("updateUserAPI - Raw response:", responseData);

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
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const deleteUserAPI = async ({ userId, token }) => {
  try {
    // console.log("Deleting user with ID:", userId);
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        usuario: USUARIO,
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

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

export const fetchAllPlantsAPI = async ({
  userId,
  token,
  page = 1,
  pageSize = 20,
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

    // console.log("Plant details response:", {
    //   status: response.status,
    //   hasData: !!responseData,
    //   hasDetails: !!responseData?.data?.details,
    //   plantId: normalizedPlantId,
    // });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.statusText} for plant ${normalizedPlantId} with provider ${providerParam}`
      );
    }

    // console.log("Plant details API response: ", response);
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

export const updateUserProfileAPI = async ({ userId, userData, token }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/profile`, {
      method: "PUT",
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
      throw new Error(errorData.message || "Failed to update user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("User profile update error:", error);
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
    return data.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
