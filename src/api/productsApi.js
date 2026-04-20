import axiosInstance from "./axiosInstance";

export const listProducts = params => axiosInstance.get("/products", { params });
export const getProduct = slugOrId => axiosInstance.get(`/products/${slugOrId}`);
export const listMyProducts = params =>
  axiosInstance.get("/products/seller/my-products", { params });
export const createProduct = formData => axiosInstance.post("/products", formData);
export const updateProduct = (id, formData) => axiosInstance.patch(`/products/${id}`, formData);
export const deleteProduct = id => axiosInstance.delete(`/products/${id}`);
