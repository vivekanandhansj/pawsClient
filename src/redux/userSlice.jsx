import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const infoData = [
  {
    id: 0,
    header: "Name",
    info: "",
    previledge: false,
    type: "user",
    edit: false,
    field: "uName",
  },
  {
    id: 1,
    header: "Vaccine",
    info: "",
    previledge: false,
    type: "user",
    edit: false,
    field: "uVaccine",
  },
  {
    id: 2,
    header: "Total dogs fed",
    info: "",
    previledge: false,
    type: "user",
    edit: false,
    field: "fedCount",
  },
  {
    id: 3,
    header: "Street",
    info: "",
    previledge: false,
    type: "user",
    edit: false,
    field: "uStreet",
  },
  {
    id: 4,
    header: "Area",
    info: "",
    previledge: false,
    type: "user",
    edit: false,
    field: "uArea",
  },
  {
    id: 5,
    header: "City",
    info: "",
    previledge: false,
    type: "user",
    edit: false,
    field: "uCity",
  },
  {
    id: 6,
    header: "State",
    info: "",
    previledge: false,
    type: "user",
    edit: false,
    field: "uState",
  },
];

export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/signup",
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxContentLength: 50 * 1024 * 1024, // 50MB limit
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

export const loginUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          maxContentLength: 50 * 1024 * 1024,
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

export const volunteerInfo = createAsyncThunk(
  "volunteer/volunteerInfo",
  async (volunteerDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/volunteer/volunteerInfo",

        {
          params: { id: volunteerDetails },
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

export const setting = createAsyncThunk(
  "user/setting",
  async (user, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/volunteer/setting",

        {
          params: { id: user },
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

export const updateLocation = createAsyncThunk(
  "user/updateLocation",
  async (locationDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/updateLocation",
        null,
        {
          params: {
            latitude: parseFloat(locationDetails.latitude),
            longitude: parseFloat(locationDetails.longitude),
            user: locationDetails.email,
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

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    infoData: infoData,
    imgData: "",
    error: null,
    location: {
      latitude: null,
      longitude: null,
    },
  },
  reducers: {
    editField: (state, action) => {
      state.infoData.forEach((field) => (field.edit = false));
      const field = state.infoData.find((f) => f.id === action.payload);
      if (field) field.edit = true;
    },
    saveField: (state, action) => {
      const { id, value } = action.payload;
      const field = state.infoData.find((f) => f.id === id);
      if (field) {
        field.edit = false;
        field.info = value;
      }
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //login
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //update location for user
      .addCase(updateLocation.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        // state.location = action.payload;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //volunteer info
      .addCase(volunteerInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(volunteerInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.imgData = action.payload["imgData"];
        state.infoData = state.infoData.map((info) => {
          const fetchedInfo = action.payload[info.header.toLowerCase()];
          if (info.header.toLowerCase() == "vaccine") {
            return fetchedInfo !== undefined
              ? { ...info, info: JSON.parse(fetchedInfo) }
              : info;
          } else
            return fetchedInfo !== undefined
              ? { ...info, info: fetchedInfo }
              : info;
        });
      })
      .addCase(volunteerInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //setting
      .addCase(setting.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setting.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(setting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      });
    //setting info
  },
});

export const fetchGeoLocation = () => async (dispatch) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("lat && lng :", latitude, longitude);
        dispatch(setLocation({ latitude, longitude }));
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
        dispatch(setLocation({ latitude: null, longitude: null }));
      },
    );
  } else {
    console.log("geolocation is not supported by browser.");
    dispatch(setLocation({ latitude: null, longitude: null }));
  }
};

export const { setLocation } = userSlice.actions;
export default userSlice.reducer;
