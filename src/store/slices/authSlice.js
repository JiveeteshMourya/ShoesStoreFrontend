import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../api/authApi";

export const getMeThunk = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.getMe();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Not authenticated");
  }
});

export const loginThunk = createAsyncThunk("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const res = await authApi.login(creds);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initDone: false,
  },
  reducers: {
    resetAuth: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.initDone = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMeThunk.pending, state => {
        state.loading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.initDone = true;
        state.error = null;
      })
      .addCase(getMeThunk.rejected, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.initDone = true;
      })
      .addCase(loginThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { resetAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
