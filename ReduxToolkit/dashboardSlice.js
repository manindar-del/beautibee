import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
const initialState = {
  status: "idle",
  faq_list: [],
  faq_status: null,
  feedback_add_list: [],
  feedback_status: null,
  service_list_show: [],
  service_list_status: null,
  studio_list_show: [],
  studio_list_status: null,
  studio_details_show: [],
  studio_details_status: null,
};

/* This is a thunk function. It is a function that returns a function. */
export const faq_show = createAsyncThunk("/api/faq/list", async (formData) => {
  const response = await axiosInstance.get(
    others_api_end_points.faqList,
    formData
  );
  let resData = response?.data;
  // formData
  return resData;
});

/* This is a thunk function. It is a function that returns a function. */
export const feedback_add = createAsyncThunk(
  "/api/feedback/service/add",
  async (formData) => {
    const response = await axiosInstance.post(
      others_api_end_points.feedBackAdd,
      formData
    );
    let resData = response?.data;
    return resData;
  }
);

export const service_list = createAsyncThunk(
  "/api/service/list",
  async (formData) => {
    const response = await axiosInstance.get(
      others_api_end_points.serviceList,
      formData
    );
    let resData = response?.data;
    // formData
    return resData;
  }
);

export const studio_list = createAsyncThunk(
  "/api/studio/list",
  async (formData) => {
    const response = await axiosInstance.post(
      others_api_end_points.studioList,
      formData
    );
    let resData = response?.data;
    // formData
    return resData;
  }
);

export const studio_details = createAsyncThunk(
  "/api/studio/detail",
  async (formData) => {
    const response = await axiosInstance.get(
      `${others_api_end_points.studioDetails}/${formData}`
    );
    let resData = response?.data;
    // formData
    return resData;
  }
);

/* Creating a slice of the redux store. */
export const DashboardSlice = createSlice({
  name: "dashboard_user",
  initialState,
  reducers: {
    removeAll: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // faq show
      .addCase(faq_show.pending, (state, action) => {
        state.status = "loading";
        state.faq_status = null;
      })
      .addCase(faq_show.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.faq_status = true;
          state.faq_list = action?.payload?.data;
        } else {
          state.faq_status = null;
        }
      })
      .addCase(faq_show.rejected, (state, action) => {
        state.status = "idle";
      })

      // Feedback add

      .addCase(feedback_add.pending, (state, action) => {
        state.status = "loading";
        state.feedback_status = null;
      })
      .addCase(feedback_add.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.feedback_status = true;
          state.feedback_add_list = action?.payload?.data;
        } else {
          state.feedback_status = null;
        }
      })
      .addCase(feedback_add.rejected, (state, action) => {
        state.status = "idle";
      })

      // Service List

      .addCase(service_list.pending, (state, action) => {
        state.status = "loading";
        state.service_list_status = null;
      })
      .addCase(service_list.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.service_list_status = true;
          state.service_list_show = action?.payload?.data;
        } else {
          state.service_list_status = null;
        }
      })
      .addCase(service_list.rejected, (state, action) => {
        state.status = "idle";
      })

      // Studio List

      .addCase(studio_list.pending, (state, action) => {
        state.status = "loading";
        state.studio_list_status = null;
      })
      .addCase(studio_list.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.studio_list_status = true;
          state.studio_list_show = action?.payload?.data;
        } else {
          state.studio_list_status = null;
        }
      })
      .addCase(studio_list.rejected, (state, action) => {
        state.status = "idle";
      })

      // Studio Details

      .addCase(studio_details.pending, (state, action) => {
        state.status = "loading";
        state.studio_details_status = null;
      })
      .addCase(studio_details.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.studio_details_status = true;
          state.studio_details_show = action?.payload?.data;
        } else {
          state.studio_details_status = null;
        }
      })
      .addCase(studio_details.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { removeAll } = DashboardSlice.actions;

export default DashboardSlice.reducer;
