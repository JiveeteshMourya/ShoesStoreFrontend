import axiosInstance from "./axiosInstance";

export const getMyProfile = () => axiosInstance.get("/users/me");
export const updateMyProfile = data => axiosInstance.patch("/users/me", data);
export const changePassword = data => axiosInstance.patch("/users/me/change-password", data);
export const updateAvatar = formData => axiosInstance.patch("/users/me/avatar", formData);
export const deleteMyAccount = () => axiosInstance.delete("/users/me");
