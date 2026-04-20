import axiosInstance from "./axiosInstance";

export const listCategories = () => axiosInstance.get("/categories");
export const getCategory = slugOrId => axiosInstance.get(`/categories/${slugOrId}`);
