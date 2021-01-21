import { createSlice } from "@reduxjs/toolkit";
import { postService } from "../../api";

export const initialState = {
  loading: false,
  error: false,
  post: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    savePost: (state) => {
      state.loading = true;
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

export const { savePost, savePostSuccess, savePostFailure } = postSlice.actions;

export const postSelector = (state) => state.post;

export const savePostRequest = ({ content, stake }) => {
  return async (dispatch) => {
    dispatch(savePost());

    try {
      const data = await postService.create(content, stake);

      dispatch(savePostSuccess(data));
    } catch (error) {
      dispatch(savePostFailure(error));
    }
  };
};

export default postSlice.reducer;
