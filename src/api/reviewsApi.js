import axiosInstance from "./axiosInstance";

export const getProductReviews = (productId, params) =>
  axiosInstance.get(`/reviews/product/${productId}`, { params });
export const createReview = (productId, data) =>
  axiosInstance.post(`/reviews/product/${productId}`, data);
export const updateReview = (reviewId, data) => axiosInstance.patch(`/reviews/${reviewId}`, data);
export const deleteReview = reviewId => axiosInstance.delete(`/reviews/${reviewId}`);
export const getMyReviews = params => axiosInstance.get("/reviews/my", { params });
