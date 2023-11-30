import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: "John",
  role: "Admin",
};

const authSlice = createSlice({
  name: "auth-slice",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
  },
});

export const authAction = authSlice.actions;

export default authSlice;
