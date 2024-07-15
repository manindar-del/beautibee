import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";

const initialState = {
  getAllJobsData: null,
  isJobsLoading: false,
  getJobDetail: null,
  isFavorite: false,
  isReport: false,
  isApplied: false,
  allApplyList: [],
  isFetch: false,
};

export const getAllJobs = createAsyncThunk("/api/jobs", async (formData) => {
  let res = await axiosInstance.post(
    others_api_end_points.getAllJobsList,
    formData
  );
  return res?.data;
});

export const getJobsDetails = createAsyncThunk(
  "/api/jobs/details",
  async (data) => {
    let res = await axiosInstance.get(
      `${others_api_end_points.getJobDetails}/${data?.id}?user_id=${data?.userID}`
    );
    return res?.data;
  }
);

export const getApplyList = createAsyncThunk(
  "/api/apply/list",
  async (data) => {
    let res = await axiosInstance.post(
      `${others_api_end_points.jobApplyList}/`,
      data
    );
    return res?.data;
  }
);
export const addToFavJobs = createAsyncThunk(
  "/api/jobs/fav",
  async (formData) => {
    let res = await axiosInstance.post(
      `${others_api_end_points.addToJobFavorite}`,
      formData
    );
    return res?.data;
  }
);

export const applyToJobs = createAsyncThunk(
  "/api/apply/job",
  async (formData) => {
    let res = await axiosInstance.post(
      `${others_api_end_points.applyToJob}`,
      formData
    );
    return res?.data;
  }
);
export const reportJobPost = createAsyncThunk(
  "/api/jobs/report",
  async (formData) => {
    let res = await axiosInstance.post(
      `${others_api_end_points.reportJob}`,
      formData
    );
    return res?.data;
  }
);

const jobs = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: {
    /*** Get All Jobs  ***/
    [getAllJobs.pending]: (state) => {
      state.isJobsLoading = true;
    },
    [getAllJobs.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.getAllJobsData = payload;
        // state.isJobsLoading = false;
      } else {
        state.isJobsLoading = false;
      }
    },
    [getAllJobs.rejected]: (state, { payload }) => {
      state.isJobsLoading = false;
    },
    /*** Get All Jobs  ***/

    /*** Get Job Details  ***/
    [getJobsDetails.pending]: (state) => {
      // state.isJobsLoading = true;
    },
    [getJobsDetails.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.getJobDetail = payload?.data;

        // state.isJobsLoading = false;
      } else {
        // state.isJobsLoading = false;
      }
    },

    [getJobsDetails.rejected]: (state, { payload }) => {
      state.isJobsLoading = false;
    },
    /*** Get Job Details  ***/

    /*** Add Job Favorite  ***/
    [addToFavJobs.pending]: (state) => {
      state.isFavorite = true;
    },
    [addToFavJobs.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.isFavorite = true;
      } else {
        state.isFavorite = false;
      }
    },
    [addToFavJobs.rejected]: (state, { payload }) => {
      state.isFavorite = false;
    },
    /*** Add Job Favorite  ***/

    /*** Apply Job  ***/
    [applyToJobs.pending]: (state) => {
      state.isApplied = true;
    },
    [applyToJobs.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.isApplied = true;
      } else {
        state.isApplied = false;
      }
    },
    [applyToJobs.rejected]: (state, { payload }) => {
      state.isApplied = false;
    },
    /*** AApply Job  ***/
    /*** Report Job  ***/
    [reportJobPost.pending]: (state) => {
      state.isReport = true;
    },
    [reportJobPost.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.isReport = true;
      } else {
        state.isReport = false;
      }
    },
    [reportJobPost.rejected]: (state, { payload }) => {
      state.isReport = false;
    },
    /*** Report Job  ***/

    /*** Apply list  ***/
    [getApplyList.pending]: (state) => {
      state.isFetch = true;
    },
    [getApplyList.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.isFetch = true;

        state.allApplyList = payload?.data;
      } else {
        state.isFetch = false;
      }
    },
    [getApplyList.rejected]: (state, { payload }) => {
      state.isFetch = false;
    },
    /*** Apply list  ***/
  },
});

export const {} = jobs.actions;
export default jobs.reducer;
