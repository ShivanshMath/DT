import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeOption: "analytics",
};

const SidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    onChangeOption(state, action) {
      state.activeOption = action.payload;
    },
  },
});

export const sidebarActions = SidebarSlice.actions;

export default SidebarSlice;
