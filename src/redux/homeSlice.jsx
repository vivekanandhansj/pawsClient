import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const pawsData = {
  user: {
    lat: "",
    lon: "",
    name: "",
    address: "",
    img: "",
    mid: "",
  },
  dogs: [
    {
      gps: "",
      lat: "9.92520070",
      lon: "78.11977540",
      name: "",
      address: "",
      img: "",
      mid: "",
      isFeed: "",
    },
  ],
};

export const pawsInformation = createAsyncThunk(
  "home/pawsInformation",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/home/pawsInformation",
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

export const addFeed = createAsyncThunk(
  "home/addFeed",
  async (feedDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        "http://localhost:5000/home/addFeed",
        feedDetails,
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

export const addEmergency = createAsyncThunk(
  "home/addEmergency",
  async (emergencyDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        "http://localhost:5000/home/addEmergency",
        emergencyDetails,
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

const homeSlice = createSlice({
  name: "home",
  initialState: {
    loading: false,
    pawsData: pawsData,
    dogPopData: "",
    userData: "",
    markerClicked:true,
    openPopup: 0,
    error: null,
  },
  reducers: {
    setDogPopData: (state, action) => {
      state.dogPopData = action.payload;
    },
    setOpenPopup: (state, action) => {
      state.openPopup = action.payload;
    },
    setMarkerClicked:(state,action)=>{
      state.markerClicked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(pawsInformation.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pawsInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.pawsData = action.payload;
        state.userData = action.payload.user;
      })
      .addCase(pawsInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      .addCase(addFeed.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeed.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      .addCase(addEmergency.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmergency.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addEmergency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      });
  },
});

export const { setDogPopData, setOpenPopup ,setMarkerClicked} = homeSlice.actions;

export default homeSlice.reducer;
