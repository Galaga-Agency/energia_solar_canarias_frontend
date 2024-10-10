import axios from "axios";

const API_BASE_URL = "https://your-api-url.com";

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
