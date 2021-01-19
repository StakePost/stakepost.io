import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  show: false,
  type: undefined,
  message: undefined,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showSuccess: (state, { payload }) => {
      state.show = true;
      state.type = "alert-success";
      state.message = payload;
    },
    showError: (state, { payload }) => {
      state.show = true;
      state.type = "alert-danger";
      state.message = payload;
    },
    showWarning: (state, { payload }) => {
      state.show = true;
      state.type = "alert-warning";
      state.message = payload;
    },
    clear: (state) => {
      state.show = false;
      state.type = undefined;
      state.message = undefined;
    },
  },
});

export const {
  showSuccess,
  showError,
  showWarning,
  clear,
} = alertSlice.actions;

export const alertSelector = (state) => state.alert;

export default alertSlice.reducer;
