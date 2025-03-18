import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Allow sending cookies with the requests
});

// Utility function to get the access token (from localStorage or cookies if needed)
const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

// Store ongoing refresh request (to prevent duplicate refresh requests)
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to refresh the access token
const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    // The refresh token should be automatically sent with the request, because it's stored in cookies
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`);

    const newAccessToken = response.data.accessToken;

    // Store the new access token (using localStorage, or cookies as required)
    localStorage.setItem("accessToken", newAccessToken);

    // Notify all subscribers that token has been refreshed
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];

    return newAccessToken;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("Refresh token failed, logging out...");
    localStorage.removeItem("accessToken");
    window.location.href = "/login"; // Redirect to login page
    return null;
  } finally {
    isRefreshing = false;
  }
};

// Request interceptor: Attach access token to each request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get 401 Unauthorized and it's not a retry, attempt to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest); // Retry the failed request
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
