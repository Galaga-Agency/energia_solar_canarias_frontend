import axios from "axios";

const API_BASE_URL = "https://your-api-url.com";

// Mock login API function
export const loginUserAPI = async (email, password) => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { id: "123", name: "Thomas Augot", email } });
    }, 1000);
  });

  // Uncomment when the actual backend is set up
  /*
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
  */
};

// Mock register API function
export const registerUserAPI = async (email, password, username) => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { id: "124", name: username, email } });
    }, 1000);
  });

  // Uncomment when the actual backend is set up
  /*
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
    username,
  });
  return response.data;
  */
};

// Mock logout API function
export const logoutUserAPI = async () => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "Logged out" });
    }, 1000);
  });

  // Uncomment when the actual backend is set up
  /*
  const response = await axios.post(`${API_BASE_URL}/logout`);
  return response.data;
  */
};
