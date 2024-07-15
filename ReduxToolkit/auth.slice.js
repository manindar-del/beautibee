import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth_end_point } from "@/api/Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";
import { Cookies } from "react-cookie";
const cookie = new Cookies();

const initialState = {
  upload_status: "idle",
  upload_message: "idle",
  redirectTo: null,
  isloggedIn: false,
  forget_status: "idle",
  reset_status: "idle",
  status: "idle",
};

export const registration = createAsyncThunk("/api/reg", async (formData) => {
  let res = await axiosInstance.post(auth_end_point.signUpUser, formData);

  return res;
});

export const authSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    check_token: (state, { payload }) => {
      //   let token = localStorage.getItem("token");
      //   check token exist in cookie or not
      //   let token = cookie.get("token");
      //   if (token !== null && token !== undefined) {
      //     state.isloggedIn = true;
      //   }
    },

    setLoginData: (state, { payload }) => {
      state.userData = payload;
      state.isloggedIn = true;
    },
  
    handleLoggedout: (state, { payload }) => {
      cookie.remove("userDetails", { path: "/" });
      cookie.remove("token", { path: "/" });
      window.location.href = "/";
    },
  },
  extraReducers: {
    [registration.pending]: (state) => {
      state.status = "loading";

      //   state.successfull_Sign_up_status = false;
    },
    [registration.fulfilled]: (state, { payload }) => {
      //   state.status = "idle";
      //   if (payload?.status === 200) {
      //     state.successfull_Sign_up_status = true;
      //   } else {
      //     state.successfull_Sign_up_status = false;
      //   }
    },
    [registration.rejected]: (state, { payload }) => {
      state.status = "idle";
    },
  },
});

export const { check_token, handleLoggedout, setLoginData } = authSlice.actions;

export default authSlice.reducer;
