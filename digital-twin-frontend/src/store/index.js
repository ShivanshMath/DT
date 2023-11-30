import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import SidebarSlice from "./sidebarSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    sidebar: SidebarSlice.reducer,
  },
});

export default store;
