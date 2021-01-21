import { createSlice } from "@reduxjs/toolkit";
import { postService } from "../../api";
import { appendPost } from "./posts";

export const initialState = {
  loading: false,
  error: false,
  post: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
      state.error = false;
    },
    savePostSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.post = payload;
    },
    savePostFailure: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.post = null;
    },
  },
});

export const {
  setLoading,
  savePostSuccess,
  savePostFailure,
} = postSlice.actions;

export const postSelector = (state) => state.post;

export const savePostRequest = ({ content, stake, txHash }, onSuccess) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const data = await postService.create(content, stake, txHash);

      dispatch(savePostSuccess(data));
      onSuccess();
      dispatch(appendPost(data));
    } catch (error) {
      const { code, message } = error;
      dispatch(savePostFailure({ code, message }));
    }
  };
};

export default postSlice.reducer;
