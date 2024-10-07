import axios from "axios";

const API_BASE_URL = "https://your-api-url.com";

export const loginUserAPI = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const registerUserAPI = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
  });
  return response.data;
};

export const logoutUserAPI = async () => {
  const response = await axios.post(`${API_BASE_URL}/logout`);
  return response.data;
};
