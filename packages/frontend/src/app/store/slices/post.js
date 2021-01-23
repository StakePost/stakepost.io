import { createSlice } from "@reduxjs/toolkit";
import { postService, userService } from "../../api";
import { appendPost } from "./posts";
import { isTokenExpired } from "../../../utils";
import { refreshSuccess } from "./auth";

export const initialState = {
  loading: false,
  postError: false,
  post: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.postError = false;
    },
    savePostSuccess: (state, { payload }) => {
      state.loading = false;
      state.postError = false;
      state.post = payload;
    },
    savePostFailure: (state, { payload }) => {
      state.loading = false;
      state.postError = payload;
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

export const savePostRequest = (
  { content, stake, txHash = "0x0" },
  token,
  refresh,
  onSuccess
) => {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      if (isTokenExpired(token)) {
        const response = await userService.refresh(refresh);

        dispatch(
          refreshSuccess({
            token: response.data.payload.token,
          })
        );
        setTimeout(async () => {
          const data = await postService.create(content, stake, txHash);

          dispatch(savePostSuccess(data));
          onSuccess();
          dispatch(appendPost(data));
        }, 1000);
      } else {
        const data = await postService.create(content, stake, txHash);

        dispatch(savePostSuccess(data));
        onSuccess();
        dispatch(appendPost(data));
      }
    } catch (e) {
      const { code, message } = e;
      dispatch(savePostFailure({ code, message }));
    }
  };
};

export default postSlice.reducer;
