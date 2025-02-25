import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menuhideshow",
  initialState: {
    isMenuOpen: false,
  },
  reducers: {
    setIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});

export const { setIsMenuOpen, toggleMenu } = menuSlice.actions;

export default menuSlice.reducer;
