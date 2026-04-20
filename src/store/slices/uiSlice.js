import { createSlice } from "@reduxjs/toolkit";

let toastId = 0;

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    toasts: [],
    mobileMenuOpen: false,
  },
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({
        id: ++toastId,
        type: "info",
        duration: 4000,
        ...action.payload,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    toggleMobileMenu: state => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: state => {
      state.mobileMenuOpen = false;
    },
  },
});

export const { addToast, removeToast, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
