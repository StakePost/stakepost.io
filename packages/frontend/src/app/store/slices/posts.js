import { createSlice } from "@reduxjs/toolkit";

import config from "../../config";

export const initialState = {
  loading: false,
  error: false,
  count: 0,
  offset: 0,
  limit: 10,
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

export function fetchPosts() {
  return async (dispatch) => {
    dispatch(getPosts());

    try {
      const response = await fetch(`${config.BackendBaseUri}/posts`);

      if (!response.ok) {
        throw new Error(`An error has occured: ${response.status}`);
      }

      const data = await response.json();

      dispatch(getPostsSuccess(data));
    } catch (error) {
      dispatch(getPostsFailure(error.message));
    }
  };
}

export default postsSlice.reducer;
