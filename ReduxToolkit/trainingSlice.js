import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
const initialState = {
  status: "idle",
  training_list_show: [],
  training_list_status: null,
  training_details_show: [],
  training_details_status: null,
};



export const training_list = createAsyncThunk(
  "/api/training/list",
  async (formData) => {
    const response = await axiosInstance.post(
      others_api_end_points.trainingList,
      formData
    );
    let resData = response?.data;
    // formData
    return resData;
  }
);




export const training_details = createAsyncThunk(
  "/api/training/detail",
  async (formData) => {
    const response = await axiosInstance.get(
      `${others_api_end_points.trainingDetails}/${formData}`
    );
    let resData = response?.data;
    // formData
    return resData;
  }
);

export const TrainingSlice = createSlice({
  name: "training_user",
  initialState,
  reducers: {
    removeAll: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Training show
      .addCase(training_list.pending, (state, action) => {
        state.status = "loading";
        state.training_list_status = null;
      })
      .addCase(training_list.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.training_list_status = true;
          state.training_list_show = action?.payload?.data;
          
        } else {
          state.training_list_status = null;
        }
      })
      .addCase(training_list.rejected, (state, action) => {
        state.status = "idle";
      })


      // Training Details

      .addCase(training_details.pending, (state, action) => {
        state.status = "loading";
        state.training_details_status = null;
      })
      .addCase(training_details.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.training_details_status = true;
          state.training_details_show = action?.payload?.data;
        } else {
          state.training_details_status = null;
        }
      })
      .addCase(training_details.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { removeAll } = TrainingSlice.actions;

export default TrainingSlice.reducer;
