import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "axiosInstance";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
const initialState = {
  status: "idle",
  contact_add: [],
  contact_add_status: null,
};

export const contact_form_add = createAsyncThunk(
  "/api/contact/add",
  async (formData) => {
    const response = await axiosInstance.post(
      others_api_end_points.contact,
      formData
    );
    let resData = response?.data;
    // formData
    return resData;
  }
);

export const ContactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    removeAll: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Contact add
      .addCase(contact_form_add.pending, (state, action) => {
        state.status = "loading";
        state.contact_add_status = null;
      })
      .addCase(contact_form_add.fulfilled, (state, action) => {
        state.status = "idle";
        if (action?.payload?.status === 200) {
          state.contact_add_status = true;
          state.contact_add = action?.payload?.data;
        } else {
          state.contact_add_status = null;
        }
      })
      .addCase(contact_form_add.rejected, (state, action) => {
        state.status = "idle";
      });
  },
});

export const { removeAll } = ContactSlice.actions;

export default ContactSlice.reducer;
