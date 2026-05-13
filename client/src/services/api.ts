import axios from "axios";
import { API_URL } from "@/utils/constants";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAdmin = window.location.pathname.startsWith("/admin");
      if (!isAdmin) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
