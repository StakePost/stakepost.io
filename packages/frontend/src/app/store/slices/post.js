import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import postService from '../../api/posts';

const initialState = {
  loading: false,
  currentRequestId: undefined,
  error: null,
  post: null,
  count: 0,
  offset: 0,
  limit: 5,
  entities: [],
};

export const createPostRequest = createAsyncThunk(
  'post/createPost',
  async (
    { content, stake, txHash = '0x0' },
    { getState, requestId, rejectWithValue },
  ) => {
    const { currentRequestId, loading } = getState().post;
    if (!loading || requestId !== currentRequestId) {
      return Promise.resolve();
    }
    try {
      const data = await postService.create(content, stake, txHash);
      return Promise.resolve(data);
    } catch (e) {
      const { code, message } = e;
      return rejectWithValue({ code, message });
    }
  },
);
export const fetchPostsRequest = createAsyncThunk(
  'post/fetchPosts',
  async ({ offset, limit }, { getState, requestId, rejectWithValue }) => {
    const { currentRequestId, loading } = getState().post;
    if (!loading || requestId !== currentRequestId) {
      return Promise.resolve();
    }
    try {
      const data = await postService.list(offset, limit);
      return Promise.resolve(data);
    } catch (e) {
      const { code, message } = e;
      return rejectWithValue({ code, message });
    }
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
  extraReducers: {
    [createPostRequest.pending]: (state, action) => {
      if (!state.loading) {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      }
    },
    [createPostRequest.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.post = action.payload;
        state.entities = [action.payload, ...state.entities];
        state.count += 1;
        state.currentRequestId = undefined;
      }
    },
    [createPostRequest.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
    [fetchPostsRequest.pending]: (state, action) => {
      if (!state.loading) {
        state.loading = true;
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchPostsRequest.fulfilled]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.count = action.payload.count;
        state.offset = action.payload.offset;
        state.limit = action.payload.limit;
        state.entities = [...state.entities, ...action.payload.data];
        state.currentRequestId = undefined;
      }
    },
    [fetchPostsRequest.rejected]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading && state.currentRequestId === requestId) {
        state.loading = false;
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export const { setLoading } = postSlice.actions;

export default postSlice.reducer;
