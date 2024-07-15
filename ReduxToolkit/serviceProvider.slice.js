import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";

const initialState = {
  getAllTechData: null,
  isAllTechLoad: false,
  isDetails: false,
  getTechDetails: null,
};

export const getAllTechnician = createAsyncThunk(
  "/api/getall/technician",
  async (formData) => {
    // let res = await axiosInstance.post(
    //   others_api_end_points.getTechnicianList,
    //   formData
    // );
    return res?.data;
  }
);

export const getTechnicianDetails = createAsyncThunk(
  "/api/getall/technician/details",
  async (formData) => {
    let res = await axiosInstance.post(
      others_api_end_points.getTechnicianDetails,
      formData
    );
    return res?.data;
  }
);
const serviceProvider = createSlice({
  name: "serviceProvider",
  initialState,
  reducers: {},
  extraReducers: {
    /*** Get All Technician  ***/
    [getAllTechnician.pending]: (state) => {
      state.isAllTechLoad = true;
    },
    [getAllTechnician.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.getAllTechData = payload;
        // state.isAllTechLoad = false;
      } else {
        state.isAllTechLoad = false;
      }
    },
    [getAllTechnician.rejected]: (state, { payload }) => {
      state.isAllTechLoad = false;
    },
    /*** Get All Technician  ***/

    /*** Get  Technician  Details***/
    [getTechnicianDetails.pending]: (state) => {
      state.isDetails = true;
    },
    [getTechnicianDetails.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.getTechDetails = payload?.data;
        // state.isAllTechLoad = false;
      }
      state.isDetails = false;
    },
    [getTechnicianDetails.rejected]: (state, { payload }) => {
      state.isDetails = false;
    },
    /*** Get  Technician  Details***/
  },
});

export const {} = serviceProvider.actions;
export default serviceProvider.reducer;
