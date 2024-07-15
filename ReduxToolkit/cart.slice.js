import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";

const initialState = {
  isItemAddCart: false,
  isCartList: false,
  getCartListData: null,
  getCartListDataQuantity: null,
  delete_cart_list: null,
  update_cart_list: null,
};

export const getToAllCartList = createAsyncThunk(
  "/api/product/cart/list",
  async () => {
    const response = await axiosInstance.get(
      others_api_end_points.getAllCartList
    );
    return response?.data;
  }
);
export const addToCart = createAsyncThunk(
  "/api/product/add/cart",
  async (formData) => {
    const response = await axiosInstance.post(
      others_api_end_points.productAddToCart,
      formData
    );
    return response?.data;
  }
);

export const deleteToCart = createAsyncThunk(
  "/api/cart/delete",
  async (formData) => {
    const response = await axiosInstance.get(
      `${others_api_end_points.deleteCart}/${formData}`
    );
    return response?.data;
  }
);

export const updateToCart = createAsyncThunk(
  "/api/cart/update",
  async (formData) => {
    const response = await axiosInstance.post(others_api_end_points.updateCart,
      formData
      );
    return response?.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

  },
  extraReducers: {
    /*** Get Cart list  ***/
    [getToAllCartList.pending]: (state) => {
      state.isCartList = true;
    },
    [getToAllCartList.fulfilled]: (state, { payload }) => {
      if (payload?.status === 200) {
        state.getCartListData = payload;
        state.isCartList = false;

        // state.isJobsLoading = false;
      }
    },
    [getToAllCartList.rejected]: (state, { payload }) => {
      state.isCartList = false;
    },
    /*** Get Cart list  ***/
    /*** Add to cart  ***/
    [addToCart.pending]: (state) => {
      state.isItemAddCart = true;
    },
    [addToCart.fulfilled]: (state, { payload }) => {
      state.isItemAddCart = false;
      if (payload?.status === 200) {
        // state.getAllJobsData = payload;
        console.log("ok!");
        // state.isItemAddCart = false;
      }
    },
    [addToCart.rejected]: (state, { payload }) => {
      state.isItemAddCart = false;
    },
    /*** Add to cart  ***/

    ///// delete cart
    [deleteToCart.pending]: (state) => {
      state.delete_cart_list = null;
    },
    [deleteToCart.fulfilled]: (state, { payload }) => {
      state.delete_cart_list = true;
      if (payload?.status === 200) {
        //state.delete_cart_list_data = payload;
        
      }
    },
    [deleteToCart.rejected]: (state, { payload }) => {
      state.delete_cart_list = null;
    },
    ///// delete cart

    ///// update cart
    [updateToCart.pending]: (state) => {
      state.update_cart_list = null;
    },
    [updateToCart.fulfilled]: (state, { payload }) => {
      state.update_cart_list = true;
      if (payload?.status === 200) {
        state.update_cart_list = payload;
        
      }
    },
    [updateToCart.rejected]: (state, { payload }) => {
      state.update_cart_list = null;
    },
    ///// update cart
  },
});

export const { } = cartSlice.actions;
export default cartSlice.reducer;
