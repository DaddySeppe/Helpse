import { API_BASE_URL } from "../api/axios";

export function getApiErrorMessage(error, fallback) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response) {
    return fallback;
  }

  if (error.request) {
    return `Kan de server niet bereiken. Controleer VITE_API_URL (${API_BASE_URL}).`;
  }

  return fallback;
}
