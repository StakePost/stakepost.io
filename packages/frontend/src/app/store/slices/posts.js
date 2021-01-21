import { createSlice } from "@reduxjs/toolkit";
import { postService } from "../../api";

export const initialState = {
  loading: false,
  error: false,
  count: 0,
  offset: 0,
  limit: 3,
  entities: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    getPosts: (state) => {
      state.loading = true;
    },
    getPostsSuccess: (state, { payload }) => {
      state.count = payload.count;
      state.offset = payload.offset;
      state.limit = payload.limit;
      state.entities = payload.data;
      state.loading = false;
      state.error = false;
    },
    getPostsFailure: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const {
  getPosts,
  getPostsSuccess,
  getPostsFailure,
} = postsSlice.actions;

export const postsSelector = (state) => state.posts;

export const fetchPosts = (offset, limit) => {
  return async (dispatch) => {
    dispatch(getPosts());

    try {
      const data = await postService.list(offset, limit);

      dispatch(getPostsSuccess(data));
    } catch (error) {
      dispatch(getPostsFailure(error.message));
    }
  };
};

export default postsSlice.reducer;
