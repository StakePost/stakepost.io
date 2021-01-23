import { createSlice } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../../utils";
import { ErrorCodes, userService } from "../../api";

export const initialState = {
  loading: false,
  requestSignature: false,
  authorized: false,
  authError: false,
  nonce: null,
  token: null,
  refreshToken: null,
  me: null,
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
      state.authError = payload;
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
      state.authError = payload;
      state.token = null;
      state.refreshToken = null;
    },
    nonceSuccess: (state, { payload }) => {
      state.loading = false;
      state.nonce = payload.nonce;
    },
    nonceFailure: (state, { payload }) => {
      state.loading = false;
      state.authError = payload;
      state.nonce = null;
    },
    signatureRequest: (state) => {
      state.loading = true;
      state.authError = null;
      state.requestSignature = true;
    },
    signatureSuccess: (state) => {
      state.loading = false;
      state.authError = false;
      state.requestSignature = false;
    },
    signatureFailure: (state, { payload }) => {
      state.loading = false;
      state.authError = payload;
      state.requestSignature = false;
    },
    refreshSuccess: (state, { payload }) => {
      state.loading = false;
      state.authError = false;
      state.token = payload.token;
    },
    refreshFailure: (state, { payload }) => {
      state.loading = false;
      state.authError = payload;
    },
    logout: (state) => {
      state.loading = false;
      state.requestSignature = false;
      state.authorized = false;
      state.authError = false;
      state.nonce = null;
      state.token = null;
      state.refreshToken = null;
    },
    meSuccess: (state, { payload }) => {
      state.loading = false;
      state.me = payload.address;
    },
    meFailure: (state, { payload }) => {
      state.loading = false;
      state.authError = payload;
      state.me = null;
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
  refreshSuccess,
  refreshFailure,
  logout,
  meSuccess,
  meFailure,
} = authSlice.actions;

export const authSelector = (state) => state.auth;

export function registerRequest(account) {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const data = await userService.register(account);

      dispatch(registerSuccess(data));
      dispatch(nonceRequest(account));
    } catch (e) {
      const { code, message } = e;
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
    } catch (e) {
      const { code, message } = e;
      dispatch(loginFailure({ code, message }));
    }
  };
}

export function refreshRequest(refreshToken) {
  return async (dispatch) => {
    dispatch(setLoading());

    try {
      const response = await userService.refresh(refreshToken);

      dispatch(
        refreshSuccess({
          token: response.data.payload.token,
        })
      );
    } catch (e) {
      const { code, message } = e;
      dispatch(refreshFailure({ code, message }));
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
    } catch (e) {
      const { code, message } = e;
      dispatch(nonceFailure({ code, message }));
    }
  };
}

export function meRequest(token, refresh) {
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
          const data = await userService.me();
          dispatch(meSuccess(data));
        }, 500);
      } else {
        const data = await userService.me();
        dispatch(meSuccess(data));
      }
    } catch (e) {
      const { code, message } = e;

      dispatch(meFailure({ code, message }));
    }
  };
}

export default authSlice.reducer;
