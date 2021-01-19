import { createSlice } from "@reduxjs/toolkit";
import { ErrorCodes } from "../../api";
import { userService } from "../../api/users";

export const initialState = {
  loading: false,
  requestSignature: false,
  authorized: false,
  error: null,
  nonce: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, { payload }) => {
      state.loading = false;
      state.account = payload.account;
    },
    registerFailure: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    restoreLoginSuccess: (state, { payload }) => {
      state.loading = false;
      state.authorized = true;
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
    },
    loginSuccess: (state, { payload }) => {
      state.loading = false;
      state.authorized = true;
      state.token = payload.token;
      state.refreshToken = payload.refreshToken;
    },
    loginFailure: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.token = null;
      state.refreshToken = null;
    },
    nonceSuccess: (state, { payload }) => {
      state.loading = false;
      state.nonce = payload.nonce;
    },
    nonceFailure: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.nonce = null;
    },
    signatureRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.requestSignature = true;
    },
    signatureSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.requestSignature = false;
    },
    signatureFailure: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.requestSignature = false;
    },
    logout: (state) => {
      state.loading = false;
      state.requestSignature = false;
      state.authorized = false;
      state.error = null;
      state.nonce = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const {
  setLoading,
  registerSuccess,
  registerFailure,
  restoreLoginSuccess,
  loginSuccess,
  loginFailure,
  nonceSuccess,
  nonceFailure,
  signatureRequest,
  signatureSuccess,
  signatureFailure,
  logout,
} = authSlice.actions;

export const authSelector = (state) => state.auth;

export function registerRequest(account) {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const data = await userService.register(account);

      dispatch(registerSuccess(data));
    } catch (error) {
      const { code, message } = error;
      if (code === ErrorCodes.UNPROCESSABLE) {
        dispatch(nonceRequest(account));
      } else {
        dispatch(registerFailure({ code, message }));
      }
    }
  };
}
export function loginRequest(account, signature) {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const response = await userService.login(account, signature);

      dispatch(
        loginSuccess({
          token: response.data.payload.token,
          refreshToken: response.data.payload.refresh_token,
        })
      );
    } catch (error) {
      const { code, message } = error;
      dispatch(loginFailure({ code, message }));
    }
  };
}

export function nonceRequest(account) {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const data = await userService.nonce(account);

      dispatch(nonceSuccess(data));
      dispatch(signatureRequest());
    } catch (error) {
      const { code, message } = error;
      dispatch(nonceFailure({ code, message }));
    }
  };
}

export default authSlice.reducer;
