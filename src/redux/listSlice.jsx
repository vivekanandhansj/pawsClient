import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const dogList = createAsyncThunk(
  "dog/dogList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get("http://localhost:5000/dog/dogList", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  },
);

export const volunteerList = createAsyncThunk(
  "volunteer/volunteerList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/volunteer/volunteerList",
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

export const notificationList = createAsyncThunk(
  "notify/notificationList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/notify/notificationList",
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

export const emergencyList = createAsyncThunk(
  "notify/emergencyList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/notify/emergencyList",
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

const listSlice = createSlice({
  name: "lists",
  initialState: {
    loading: false,
    listData: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dogList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dogList.fulfilled, (state, action) => {
        state.loading = false;
        state.listData = action.payload;
      })
      .addCase(dogList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //volunteer list
      .addCase(volunteerList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(volunteerList.fulfilled, (state, action) => {
        state.loading = false;
        state.listData = action.payload;
      })
      .addCase(volunteerList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //notification list
      .addCase(notificationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(notificationList.fulfilled, (state, action) => {
        state.loading = false;
        state.listData = action.payload;
      })
      .addCase(notificationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //emergency list
      .addCase(emergencyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emergencyList.fulfilled, (state, action) => {
        state.loading = false;
        state.listData = action.payload;
      })
      .addCase(emergencyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      });
  },
});

export default listSlice.reducer;
