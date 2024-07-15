import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
const initialState = {
  status: "idle",
  product_list: null,
  product_list_status: null,
  product_details_show_list: null,
  product_details_status: null,
  product_categories_show_list: [],
  product_categories_status: null,
};

export const product_show = createAsyncThunk(
  "/api/product/list",
  async (formData) => {
    const response = await axiosInstance.post(
      others_api_end_points.productList,
      formData
    );
    let resData = response?.data;
    // formData
    return resData;
  }
);

export const product_details_show = createAsyncThunk(
  "/api/product/detail",
  async (formData) => {
    const response = await axiosInstance.get(
      `${others_api_end_points.productDetails}/${formData}`
    );
    let resData = response?.data;
    return resData;
  }
);

export const product_categories_show = createAsyncThunk(
  "/api/product/categoies",
  async (formData) => {
    const response = await axiosInstance.get(
      others_api_end_points.product_categories,
      formData
    );
    let resData = response?.data;
    return resData;
  }
);


export const ProductSlice = createSlice({
  name: "product_user",
  initialState,
  reducers: {
    removeAll: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Product list
      .addCase(product_show.pending, (state, action) => {
        state.status = "loading";
        state.product_list_status = null;
      })
      .addCase(product_show.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.product_list_status = true;
          state.product_list = action?.payload?.data;
        } else {
          state.product_list_status = null;
        }
      })
      .addCase(product_show.rejected, (state, action) => {
        state.status = "idle";
      })

      // Product Details

      .addCase(product_details_show.pending, (state, action) => {
        state.status = "loading";
        state.product_details_status = null;
      })
      .addCase(product_details_show.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {

          state.product_details_status = true;
          state.product_details_show_list = action?.payload?.data.product;
        } else {
          state.product_details_status = null;
        }
      })
      .addCase(product_details_show.rejected, (state, action) => {
        state.status = "idle";
      })


      // Product category

      .addCase(product_categories_show.pending, (state, action) => {
        state.status = "loading";
        state.product_categories_status = null;
      })
      .addCase(product_categories_show.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {

          state.product_categories_status = true;
          state.product_categories_show_list = action?.payload?.data;
        } else {
          state.product_categories_status = null;
        }
      })
      .addCase(product_categories_show.rejected, (state, action) => {
        state.status = "idle";
      });

  },
});

export const { removeAll } = ProductSlice.actions;

export default ProductSlice.reducer;
