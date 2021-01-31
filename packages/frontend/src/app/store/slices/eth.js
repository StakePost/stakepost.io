import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethService } from "../../api";

export const getAccountDataRequest = createAsyncThunk(
  "eth/getAccountData",
  async ({ account, library }, { getState, requestId, rejectWithValue }) => {
    const { currentRequestId, loading } = getState().eth;
    if (!loading || requestId !== currentRequestId) {
      return;
    }
    try {
      const data = await ethService.getUserData({ account }, library);
      return data;
    } catch (e) {
      const { code, message } = e;
      return rejectWithValue({ code, message });
    }
  }
);

const ethSlice = createSlice({
  name: "eth",
  initialState: {
    loading: false,
    currentRequestId: undefined,
    error: null,
    account: null,
    image: null,
    balance: 0,
    post: null,
  },
  reducers: {},
  extraReducers: {
    [getAccountDataRequest.pending]: (state, action) => {
      if (!state.loading) {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      }
    },
    [getAccountDataRequest.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.account = action.payload.account;
        state.image = action.payload.image;
        state.balance = action.payload.balance;
        state.post = action.payload.post;
        state.currentRequestId = undefined;
      }
    },
    [getAccountDataRequest.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export default ethSlice.reducer;
