import axios from "axios";
import { API_BASE, API_ENDPOINTS } from "../Config/api";
import { toast } from "react-hot-toast";
import NProgress from "nprogress";
import "nprogress/nprogress.css";  

// ------------------------------------
// AXIOS INSTANCE
// ------------------------------------
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ------------------------------------
// RESPONSE INTERCEPTOR
// ------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Explicit skip (login, logout, public APIs)
    if (originalRequest?.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (window.location.pathname === "/login") {
      return Promise.reject(error);
    }

    // 401 / 403 → session expired → logout
    if (status === 401 || status === 403) {
      toast.error("Session expired. Please login again.");
      localStorage.setItem("logout-event", Date.now().toString());
      window.location.replace("/login");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// ------------------------------------
// API FETCH
// ------------------------------------
export const apiFetch = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const { body, headers, skipAuthRefresh, responseType, ...rest } = options;

  let timer;

  try {
    NProgress.start();
    timer = setInterval(() => {
      NProgress.inc(0.05);
    }, 400);

    const res = await api({
      url,
      method: options.method || "GET",
      data: body,
      skipAuthRefresh,
      responseType: responseType || "json",
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...headers,
      },
      ...rest,
    });

    if (responseType === "blob") {
      return res;
    }

    const data = res.data;
    if (data && data.status === false) {
      const customError = new Error(data.message || "Request failed");
      customError.response = res;
      customError.data = data;
      throw customError;
    }

    return data;

  } catch (error) {
    const backendMessage = error.response?.data?.message || error.response?.data?.error || null;
    if (backendMessage) {
      const customError = new Error(backendMessage);
      customError.response = error.response;
      customError.data = error.response?.data;
      throw customError;
    }
    throw error;

  } finally {
    clearInterval(timer);
    NProgress.done();
  }
};

export default apiFetch;