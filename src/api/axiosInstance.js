import axios from "axios";
import { backendUrl } from "../utils/constants";
import { resetAuth } from "../store/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export function setupInterceptors(store) {
  axiosInstance.interceptors.response.use(
    res => res,
    async err => {
      const original = err.config;
      if (err.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          await axiosInstance.post("/auth/refresh-token");
          return axiosInstance(original);
        } catch {
          store.dispatch(resetAuth());
          window.location.href = "/login";
        }
      }
      return Promise.reject(err);
    }
  );
}

export default axiosInstance;
