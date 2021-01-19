import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  account: null,
  image: null,
  balance: 0,
};

const ethSlice = createSlice({
  name: "eth",
  initialState,
  reducers: {
    activate: (state, { payload }) => {
      state.account = payload.account;
      state.image = payload.image;
      state.balance = payload.balance;
    },
    deacivate: (state) => {
      state.account = null;
      state.image = null;
      state.balance = null;
    },
  },
});

export const { activate, deacivate } = ethSlice.actions;

export const ethSelector = (state) => state.eth;

export default ethSlice.reducer;
