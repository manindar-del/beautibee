import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalToastifyOpen: false,
  toastifyMsg: null,
  toastifyType: "info",
  isOnline: false,
  page: 1,
  per_page: 10,
  searchusername: "",
  chat_per_page: 2
};

const Global = createSlice({
  name: "Global",
  initialState,
  reducers: {
    resetToastify: (state) => {
      state.globalToastifyOpen = false;
      // state.toastifyMsg = null;
      // state.toastifyType = "info";
    },
    openToast: (state, { payload }) => {
      state.globalToastifyOpen = payload;
    },
    setToastifyMsg: (state, { payload }) => {
      state.toastifyMsg = payload;
    },
    setToastifyType: (state, { payload }) => {
      state.toastifyType = payload;
    },
    setIssOnline: (state, { payload }) => {
      state.isOnline = payload;
    },
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    setPerPage: (state, { payload }) => {
      state.per_page = payload;
    },
    setSearchVal: (state, { payload }) => {
      state.searchusername = payload;
    },
    setChatPage: (state, { payload }) => {
      state.chat_per_page = payload;
    },
  },
  extraReducers: {},
});

export const {
  resetToastify,
  openToast,
  setToastifyMsg,
  setToastifyType,
  setIssOnline,
  setPage,
  setPerPage,
  setSearchVal,
  setChatPage
} = Global.actions;
export default Global.reducer;
