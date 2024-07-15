import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
  },
  extraReducers: {},
});

export const { increment } = testSlice.actions;
export default testSlice.reducer;
