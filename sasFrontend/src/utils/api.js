import axios from "axios";

// Point this at your backend. During local dev this is localhost:5000.
// In production, set VITE_API_URL in your frontend .env (Vite) and swap
// the fallback below, e.g. baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Automatically log out on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("store");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Pulls a readable error message out of an axios error.
 * Your backend consistently returns { message: "..." } on failure,
 * so this just centralizes that extraction.
 */
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || fallback;
}

export default api;