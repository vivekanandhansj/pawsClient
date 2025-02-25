import { configureStore } from "@reduxjs/toolkit";
import windowReducer from "./reduxSlice.jsx";
import userReducer from "../redux/userSlice.jsx";
import menuReducer from "../redux/menuSlice.jsx";
import dogReducer from "../redux/dogSlice.jsx";
import listReducer from "../redux/listSlice.jsx";
import dashboardReducer from "./dashboardSlice.jsx";
import homeReducer from "./homeSlice.jsx";
const store = configureStore({
  reducer: {
    window: windowReducer,
    user: userReducer,
    menu: menuReducer,
    dog: dogReducer,
    lists: listReducer,
    dashboard: dashboardReducer,
    home: homeReducer,
  },
});

export default store;
