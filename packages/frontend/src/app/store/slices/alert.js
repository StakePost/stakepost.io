import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  show: false,
  type: null,
  message: null,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showSuccess: (state, { payload }) => {
      state.show = true;
      state.type = 'success';
      state.message = payload;
    },
    showError: (state, { payload }) => {
      state.show = true;
      state.type = 'error';
      state.message = payload;
    },
    showWarning: (state, { payload }) => {
      state.show = true;
      state.type = 'warning';
      state.message = payload;
    },
    showInfo: (state, { payload }) => {
      state.show = true;
      state.type = 'info';
      state.message = payload;
    },
    showAlert: (state, { payload }) => {
      state.show = true;
      state.type = 'unspecified';
      state.message = payload;
    },
    clearAlert: (state) => {
      state.show = false;
      state.type = null;
      state.message = null;
    },
  },
});

export const {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showAlert,
  clearAlert,
} = alertSlice.actions;

export const alertSelector = (state) => state.alert;

export default alertSlice.reducer;
