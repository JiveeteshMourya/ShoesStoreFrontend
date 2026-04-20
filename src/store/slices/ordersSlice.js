import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ordersApi from "../../api/ordersApi";

export const placeOrderThunk = createAsyncThunk(
  "orders/place",
  async (data, { rejectWithValue }) => {
    try {
      const res = await ordersApi.placeOrder(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to place order");
    }
  }
);

export const fetchMyOrdersThunk = createAsyncThunk(
  "orders/fetchMy",
  async (params, { rejectWithValue }) => {
    try {
      const res = await ordersApi.listMyOrders(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load orders");
    }
  }
);

export const fetchMyOrderThunk = createAsyncThunk(
  "orders/fetchMyOne",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await ordersApi.getMyOrder(orderId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  }
);

export const cancelOrderThunk = createAsyncThunk(
  "orders/cancel",
  async ({ orderId, cancelReason }, { rejectWithValue }) => {
    try {
      const res = await ordersApi.cancelOrder(orderId, { cancelReason });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel order");
    }
  }
);

export const fetchSellerOrdersThunk = createAsyncThunk(
  "orders/fetchSeller",
  async (params, { rejectWithValue }) => {
    try {
      const res = await ordersApi.listSellerOrders(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load orders");
    }
  }
);

export const fetchSellerOrderThunk = createAsyncThunk(
  "orders/fetchSellerOne",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await ordersApi.getSellerOrder(orderId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Order not found");
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status, note }, { rejectWithValue }) => {
    try {
      const res = await ordersApi.updateOrderStatus(orderId, { status, note });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    buyerOrders: { items: [], total: 0, page: 1, totalPages: 1, loading: false },
    sellerOrders: { items: [], total: 0, page: 1, totalPages: 1, loading: false },
    selectedOrder: null,
    selectedOrderLoading: false,
    placeOrderLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedOrder: state => {
      state.selectedOrder = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrderThunk.pending, state => {
        state.placeOrderLoading = true;
        state.error = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.placeOrderLoading = false;
        state.buyerOrders.items.unshift(action.payload);
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.placeOrderLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrdersThunk.pending, state => {
        state.buyerOrders.loading = true;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.buyerOrders = { ...action.payload, loading: false };
      })
      .addCase(fetchMyOrdersThunk.rejected, state => {
        state.buyerOrders.loading = false;
      })
      .addCase(fetchMyOrderThunk.pending, state => {
        state.selectedOrderLoading = true;
      })
      .addCase(fetchMyOrderThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.selectedOrderLoading = false;
      })
      .addCase(fetchMyOrderThunk.rejected, state => {
        state.selectedOrderLoading = false;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
        const idx = state.buyerOrders.items.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.buyerOrders.items[idx] = action.payload;
      })
      .addCase(fetchSellerOrdersThunk.pending, state => {
        state.sellerOrders.loading = true;
      })
      .addCase(fetchSellerOrdersThunk.fulfilled, (state, action) => {
        state.sellerOrders = { ...action.payload, loading: false };
      })
      .addCase(fetchSellerOrdersThunk.rejected, state => {
        state.sellerOrders.loading = false;
      })
      .addCase(fetchSellerOrderThunk.pending, state => {
        state.selectedOrderLoading = true;
      })
      .addCase(fetchSellerOrderThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.selectedOrderLoading = false;
      })
      .addCase(fetchSellerOrderThunk.rejected, state => {
        state.selectedOrderLoading = false;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
        const idx = state.sellerOrders.items.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.sellerOrders.items[idx] = action.payload;
      });
  },
});

export const { clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
