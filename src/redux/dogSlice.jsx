import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const infoData = [
  {
    id: 0,
    header: "Paw GPS",
    info: "",
    previledge: true,
    type: "dog",
    edit: false,
    field: "gps",
  },
  {
    id: 1,
    header: "Vaccine",
    info: "",
    previledge: true,
    type: "dog",
    edit: false,
    field: "dVaccine",
  },
  {
    id: 2,
    header: "Medical information",
    info: "",
    previledge: true,
    type: "dog",
    edit: false,
    field: "medicalDesc",
  },
  {
    id: 3,
    header: "Street",
    info: "",
    previledge: true,
    type: "dog",
    edit: false,
    field: "dStreet",
  },
  {
    id: 4,
    header: "Area",
    info: "",
    previledge: true,
    type: "dog",
    edit: false,
    field: "dArea",
  },
  {
    id: 5,
    header: "City",
    info: "",
    previledge: true,
    type: "dog",
    edit: false,
    field: "dCity",
  },
  {
    id: 6,
    header: "State",
    info: "",
    previledge: true,
    type: "dog",
    edit: false,
    field: "dState",
  },
  {
    id: 7,
    header: "Name",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uName",
  },
  {
    id: 8,
    header: "Vaccine",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uVaccine",
  },
  {
    id: 9,
    header: "Street",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uStreet",
  },
  {
    id: 10,
    header: "Area",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uArea",
  },
  {
    id: 11,
    header: "City",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uCity",
  },
  {
    id: 12,
    header: "State",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uState",
  },
  {
    id: 13,
    header: "Email",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uEmail",
  },
  {
    id: 14,
    header: "Mobile",
    info: "",
    previledge: true,
    type: "Setting",
    edit: false,
    field: "uMobile",
  },
];

export const addDog = createAsyncThunk(
  "dog/addDog",
  async (dogDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        "http://localhost:5000/dog/addDog",
        dogDetails,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
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

export const dogInfo = createAsyncThunk(
  "dog/dogInfo",
  async (dogDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/dog/dogInfo",

        {
          params: { id: dogDetails },
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

export const dogEdit = createAsyncThunk(
  "dog/dogEdit",
  async (editDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        "http://localhost:5000/dog/dogEdit",
        editDetails,
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

export const settingInfo = createAsyncThunk(
  "user/settingInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        "http://localhost:5000/volunteer/settingInfo",
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

export const settingEdit = createAsyncThunk(
  "user/settingEdit",
  async (editDetails, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.put(
        "http://localhost:5000/volunteer/settingEdit",
        editDetails,
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

const dogSlice = createSlice({
  name: "dog",
  initialState: {
    loading: false,
    dogData: null,
    infoData: infoData,
    imgData: "",
    error: null,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDog.fulfilled, (state, action) => {
        state.loading = false;
        state.dogData = action.payload;
      })
      .addCase(addDog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //dog info
      .addCase(dogInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dogInfo.fulfilled, (state, action) => {
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
      .addCase(dogInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //edit dog info
      .addCase(dogEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dogEdit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(dogEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //setting info
      .addCase(settingInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(settingInfo.fulfilled, (state, action) => {
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
      .addCase(settingInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      })
      //setting edit
      .addCase(settingEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(settingEdit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(settingEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || action.error.message;
      });
  },
});

export const { editField, saveField } = dogSlice.actions;
export default dogSlice.reducer;
