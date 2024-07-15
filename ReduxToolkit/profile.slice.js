import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";

const initialState = {
  getProfileData: null,
  isProfileLoading: false,
  allBadgeList: null,
};

export const getProfileDetails = createAsyncThunk(
  "/api/profileDetails",
  async () => {
    let res = await axiosInstance.get(others_api_end_points.getProfileDetails);
    return res?.data;
  }
);

export const updateProfileDetails = createAsyncThunk(
  "/api/updateProfileDetails",
  async (formData) => {
    let res = await axiosInstance.post(
      others_api_end_points.updateProfileDetails,
      formData
    );
    return res?.data;
  }
);

export const getBadgeList = createAsyncThunk("/api/getBadgeList", async () => {
  let res = await axiosInstance.get(others_api_end_points.badgeList);
  return res?.data;
});

const profileSlice = createSlice({
  name: "profileSlice",
  initialState,
  reducers: {
    // checkLogin: (state, { payload }) => {
    //   state.isLoggedIn = payload;
    // },
    // set_userProfile: (state, { payload }) => {
    //   state.profile = payload;
    // },
  },
  extraReducers: {
    [getProfileDetails.pending]: (state) => {
      state.isProfileLoading = true;
    },
    [getProfileDetails.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.getProfileData = payload?.data;
      } else {
        state.isProfileLoading = true;
      }
    },
    [getProfileDetails.rejected]: (state, { payload }) => {
      state.isProfileLoading = false;
    },

    [updateProfileDetails.pending]: (state) => {
      // state.isProfileLoading = true;
    },
    [updateProfileDetails.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        // state.isProfileLoading = false;
        console.log("ok !");
      } else {
        // state.isProfileLoading = false;
      }
    },
    [updateProfileDetails.rejected]: (state, { payload }) => {
      // state.isProfileLoading = false;
    },

    [getBadgeList.pending]: (state) => {
      // state.isProfileLoading = true;
    },
    [getBadgeList.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        // state.isProfileLoading = false;
        console.log("ok !");
        state.allBadgeList = payload?.data;
      } else {
        // state.isProfileLoading = false;
      }
    },
    [getBadgeList.rejected]: (state, { payload }) => {
      // state.isProfileLoading = false;
    },
  },
});

export const { checkLogin, set_userProfile } = profileSlice.actions;
export default profileSlice.reducer;
