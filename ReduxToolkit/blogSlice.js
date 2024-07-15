import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
const initialState = {
  status: "idle",
  blog_list: null,
  blog_list_status: null,
  blog_details_show_list: [],
  blog_details_status: null,
 
};

export const blog_show = createAsyncThunk(
  "/api/blog/list",
  async (formData) => {
    const response = await axiosInstance.post(
      others_api_end_points.blogList,
      formData
    );
    let resData = response;
    // formData
    return resData;
  }
);

export const blog_details_show = createAsyncThunk(
  "/api/blog/detail",
  async (formData) => {
    const response = await axiosInstance.get(
      `${others_api_end_points.blogDetails}/${formData}`
    );
    let resData = response?.data;
    return resData;
  }
);



export const BlogSlice = createSlice({
  name: "blog_user",
  initialState,
  reducers: {
    removeAll: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Blog list
      .addCase(blog_show.pending, (state, action) => {
        state.status = "loading";
        state.blog_list_status = null;
      })
      .addCase(blog_show.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.blog_list_status = true;
          state.blog_list = action?.payload?.data;
        } else {
          state.blog_list_status = null;
        }
      })
      .addCase(blog_show.rejected, (state, action) => {
        state.status = "idle";
      })

    //   // Blog Details

      .addCase(blog_details_show.pending, (state, action) => {
        state.status = "loading";
        state.blog_details_status = null;
      })
      .addCase(blog_details_show.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {

          state.blog_details_status = true;
          state.blog_details_show_list = action?.payload?.data;
        } else {
          state.blog_details_status = null;
        }
      })
      .addCase(blog_details_show.rejected, (state, action) => {
        state.status = "idle";
      })


      
  },
});

export const { removeAll } = BlogSlice.actions;

export default BlogSlice.reducer;
