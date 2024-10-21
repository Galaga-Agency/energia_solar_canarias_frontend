import axios from "axios";

export const loginRequestAPI = async (userData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          usuario: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify(userData),
      }
    );

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

export const validateTokenRequestAPI = async (userId, token) => {
  return new Promise((resolve, reject) => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token`, {
      method: "POST",
      body: { id: userId, token },
      headers: {
        "Content-Type": "application/json",
        usuario: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
      },
    })
      .then((response) => {
        // Check if the response status is not ok (4xx or 5xx)
        if (!response.ok) {
          // Attempt to parse the error response as JSON
          return response
            .clone()
            .json()
            .then((errorData) => {
              const errorResponse = {
                status: "error",
                code: response.status,
                message: errorData.message || "Unknown error",
                errors: errorData,
              };
              resolve(errorResponse);
            })
            .catch(() => {
              // If not possible to parse as JSON, get it as text
              return response.text().then((errorText) => {
                const errorResponse = {
                  status: "error",
                  code: response.status,
                  message: errorText || "Unknown error",
                  errors: errorText,
                };
                resolve(errorResponse);
              });
            });
        }

        // If response is successful, return the parsed JSON data
        return response
          .clone()
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            // If not possible to parse as JSON, get it as text
            return response.text().then((errorText) => {
              const errorResponse = {
                status: "error",
                code: response.status,
                message: errorText || "Unknown error",
                errors: errorText,
              };
              resolve(errorResponse);
            });
          });
      })
      .catch((error) => {
        // Handle network errors
        if (error.message === "Failed to fetch") {
          const errorResponse = {
            status: "error",
            code: 0,
            message: "Network error: Unable to connect to the server.",
            errors: error,
          };
          resolve(errorResponse);
        } else {
          // Handle other types of errors
          const errorResponse = {
            status: "error",
            code: 0,
            message: error.message || "Unknown error",
            errors: error,
          };
          resolve(errorResponse);
        }
      });
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVRYTHING BELOW THIS SHOULD BE REMOVED ONCE THE ENTIRE BACKEND IS FINISHED
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to fetch user data from the API (added for testing purposes)
export const fetchUserData = async (usuario, apiKey) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usuarios`, {
      headers: {
        usuario,
        apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Existing API functions (kept intact)

// Mock login API function
export const loginUserAPI = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate receiving a token from the backend
      const token = "mockToken123";
      const user = { id: "123", name: "Thomas Augot", email };

      // Save token and user to local storage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      resolve({ user });
    }, 1000);
  });

  // Uncomment when the actual backend is set up
  /*
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  const { token, user } = response.data;
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
  return response.data;
  */
};

// Mock register API function
export const registerUserAPI = async (email, password, username) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate receiving a token from the backend
      const token = "mockToken124";
      const user = { id: "124", name: username, email };

      // Save token and user to local storage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      resolve({ user });
    }, 1000);
  });

  // Uncomment when the actual backend is set up
  /*
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
    username,
  });
  const { token, user } = response.data;
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
  return response.data;
  */
};

export const sendPasswordResetEmail = async (email) => {};

export const fetchUserMock = async (email, password) => {
  try {
    const response = await fetch("/user.json");
    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }
    const data = await response.json();
    const user = data.users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      return user;
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const fetchPlantsMock = async (userId) => {
  try {
    const response = await fetch("/plants.json");
    if (!response.ok) {
      throw new Error(`Error fetching plants: ${response.statusText}`);
    }
    const data = await response.json();
    const plants = data.plants.filter((plant) => plant.userId === userId);

    return plants;
  } catch (error) {
    console.error("Error fetching plants data:", error);
    throw error;
  }
};
