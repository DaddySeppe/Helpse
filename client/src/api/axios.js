import axios from "axios";

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL;
  const isBrowser = typeof window !== "undefined";
  const isLocalPage = isBrowser && ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const configuredIsLocalhost =
    configuredUrl?.includes("localhost") || configuredUrl?.includes("127.0.0.1");

  if (configuredUrl && (isLocalPage || !configuredIsLocalhost)) {
    return configuredUrl;
  }

  if (isBrowser && !isLocalPage) {
    return `${window.location.origin}/api`;
  }

  return "http://localhost:4000/api";
}

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("helpse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
