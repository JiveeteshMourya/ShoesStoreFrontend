import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productsApi from "../../api/productsApi";

export const fetchProductsThunk = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await productsApi.listProducts(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load products");
    }
  }
);

export const fetchProductThunk = createAsyncThunk(
  "products/fetchOne",
  async (slugOrId, { rejectWithValue }) => {
    try {
      const res = await productsApi.getProduct(slugOrId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Product not found");
    }
  }
);

export const fetchSellerProductsThunk = createAsyncThunk(
  "products/fetchSellerProducts",
  async (params, { rejectWithValue }) => {
    try {
      const res = await productsApi.listMyProducts(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load your products");
    }
  }
);

export const createProductThunk = createAsyncThunk(
  "products/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await productsApi.createProduct(formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "products/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await productsApi.updateProduct(id, formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
    selectedProduct: null,
    selectedProductLoading: false,
    sellerProducts: [],
    sellerTotal: 0,
    sellerPage: 1,
    sellerTotalPages: 1,
    sellerLoading: false,
  },
  reducers: {
    clearSelectedProduct: state => {
      state.selectedProduct = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProductsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductThunk.pending, state => {
        state.selectedProductLoading = true;
        state.error = null;
      })
      .addCase(fetchProductThunk.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.selectedProductLoading = false;
      })
      .addCase(fetchProductThunk.rejected, (state, action) => {
        state.selectedProductLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSellerProductsThunk.pending, state => {
        state.sellerLoading = true;
      })
      .addCase(fetchSellerProductsThunk.fulfilled, (state, action) => {
        state.sellerProducts = action.payload.items;
        state.sellerTotal = action.payload.total;
        state.sellerPage = action.payload.page;
        state.sellerTotalPages = action.payload.totalPages;
        state.sellerLoading = false;
      })
      .addCase(fetchSellerProductsThunk.rejected, (state, action) => {
        state.sellerLoading = false;
        state.error = action.payload;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.sellerProducts.unshift(action.payload);
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const idx = state.sellerProducts.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.sellerProducts[idx] = action.payload;
        if (state.selectedProduct?._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.sellerProducts = state.sellerProducts.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
