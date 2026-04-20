import axios from "axios";
import { backendUrl } from "../utils/constants";
import { resetAuth } from "../store/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = error => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  failedQueue = [];
};

export function setupInterceptors(store) {
  axiosInstance.interceptors.response.use(
    res => res,
    async err => {
      const original = err.config;
      const is401 = err.response?.status === 401;
      const isRefreshUrl = original.url?.includes("refresh-token");

      if (!is401 || original._retry || isRefreshUrl) {
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(original))
          .catch(e => Promise.reject(e));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token");
        processQueue(null);
        return axiosInstance(original);
      } catch (refreshErr) {
        processQueue(refreshErr);
        store.dispatch(resetAuth());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

export default axiosInstance;
