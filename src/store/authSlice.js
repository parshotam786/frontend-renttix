import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  isLogin: false,
  role: null,
  token: null,
  status: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      state.user = action.payload?.user || null;
      state.isLogin = true;
      state.role = action?.payload?.role;
      state.token = action?.payload?.token;
      state.status = action?.payload?.status;

      Cookies.set("xpdx", action?.payload?.token);
      Cookies.set("xpdx_r", action?.payload?.role);
      Cookies.set("xpdx_s", action?.payload?.status);
    },
    setUpdateUser: (state, action) => {
      state.user = action.payload;
      state.status = action.payload.status;
    },
    setUpdateStatus: (state, action) => {
      state.user.status = action.payload;
    },
    setLogoutUser: (state) => {
      state.user = null;
      state.isLogin = false;
      state.role = null;
      state.token = null;
      state.status = null;
      Cookies.remove("xpdx");
      Cookies.remove("xpdx_r");
      Cookies.remove("xpdx_s");
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoginData, setLogoutUser, setUpdateUser, setUpdateStatus } =
  authSlice.actions;

export default authSlice.reducer;
