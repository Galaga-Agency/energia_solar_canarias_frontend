import axios from "axios";

// Base URL for your API
const API_BASE_URL =
  "http://ec2-51-92-121-143.eu-south-2.compute.amazonaws.com/esc-backend";

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

// Function for sending a password reset email (placeholder for further development)
export const sendPasswordResetEmail = async (email) => {
  // Add your logic for sending the password reset email
};
