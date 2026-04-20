import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as categoriesApi from "../../api/categoriesApi";

export const fetchCategoriesThunk = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoriesApi.listCategories();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load categories");
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategoriesThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
