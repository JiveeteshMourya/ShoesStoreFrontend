import axiosInstance from "./axiosInstance";

export const placeOrder = data => axiosInstance.post("/orders", data);
export const listMyOrders = params => axiosInstance.get("/orders/my", { params });
export const getMyOrder = orderId => axiosInstance.get(`/orders/my/${orderId}`);
export const cancelOrder = (orderId, data) =>
  axiosInstance.patch(`/orders/my/${orderId}/cancel`, data);

export const listSellerOrders = params => axiosInstance.get("/orders/seller", { params });
export const getSellerOrder = orderId => axiosInstance.get(`/orders/seller/${orderId}`);
export const updateOrderStatus = (orderId, data) =>
  axiosInstance.patch(`/orders/seller/${orderId}/status`, data);
