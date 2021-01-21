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
    setLoading: (state, { payload }) => {
      state.loading = payload;
      state.error = false;
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
    appendPost: (state, { payload }) => {
      state.entities = [payload, ...state.entities];
      state.loading = false;
      state.error = false;
    },
  },
});

export const {
  setLoading,
  getPostsSuccess,
  getPostsFailure,
  appendPost,
} = postsSlice.actions;

export const postsSelector = (state) => state.posts;

export const fetchPosts = (
  offset = postsSelector.offset,
  limit = postsSelector.limit
) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const data = await postService.list(offset, limit);

      dispatch(getPostsSuccess(data));
    } catch (error) {
      dispatch(getPostsFailure(error.message));
    }
  };
};

export default postsSlice.reducer;
