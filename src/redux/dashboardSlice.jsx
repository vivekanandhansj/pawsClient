import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const dashboardCounts = createAsyncThunk(
  "dashboard/dashboardCounts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/dashboard/dashboardCounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const dashboardWeekReport = createAsyncThunk(
  "dashboard/dashboardWeekReport",
  async (dateRange, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/dashboard/dashboardWeekReport",
        {
          params: { from: dateRange.fromDate, to: dateRange.toDate },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    countData: {
      dc: 0,
      vc: 0,
      fc: 0,
      nfc: 0,
      pfc: 0,
    },
    weekData: [],
    fromDate: "",
    toDate: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboardCounts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.countData = action.payload;
      })
      .addCase(dashboardCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      .addCase(dashboardWeekReport.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardWeekReport.fulfilled, (state, action) => {
        state.loading = false;
        state.weekData = action.payload;
      })
      .addCase(dashboardWeekReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
