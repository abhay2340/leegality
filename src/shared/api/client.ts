import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for handling global error responses (e.g. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle global errors here (like token expiration, redirect to login, etc.)
    return Promise.reject(error);
  },
);
