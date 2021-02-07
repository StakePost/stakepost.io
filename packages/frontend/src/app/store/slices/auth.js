import { createAsyncThunk, createSlice, unwrapResult } from '@reduxjs/toolkit';
import { ErrorCodes, ApiError } from '../../api';
import { AuthStore } from '../../../utils';
import userService from '../../api/users';
import ethService from '../../api/eth';

const initialState = {
  loading: false,
  error: null,
  authorized: false,
  data: {
    account: null,
    nonce: null,
    token: null,
    refresh: null,
  },
};
/*
- Login Workflow
1) check nonce, if 404 then register and get nonce again
2) get nonce, save to state
3) request signature from user
4) login request, save token and refresh token to state and store
*/
export const loginRequest = createAsyncThunk(
  'auth/loginRequest',
  async ({ account, provider }, { getState, rejectWithValue }) => {
    const { loading } = getState().auth;

    if (!loading) {
      return Promise.resolve();
    }

    let nonce = null;

    try {
      const nonceResponse = await userService.nonce(account);
      nonce = nonceResponse.nonce;
    } catch (e) {
      if (e.code === ErrorCodes.NOTFOUND) {
        try {
          await userService.register(account);
          const nonceResponse = await userService.nonce(account);
          nonce = nonceResponse.nonce;
        } catch (ignored) {
          // Just ignore the error
        }
      } else {
        const { code, message } = e;
        return rejectWithValue({ code, message });
      }
    }

    try {
      if (nonce === null) {
        throw new ApiError(
          ErrorCodes.UNSPECIFIED,
          'Failed to load nonce for the user',
        );
      }

      const { signature } = await ethService.getUserSignature(
        { account, nonce },
        provider,
      );

      const loginResponse = await userService.login(account, signature);

      AuthStore.save({
        account,
        nonce,
        token: loginResponse.data.payload.token,
        refresh: loginResponse.data.payload.refresh_token,
      });

      return Promise.resolve({
        account,
        nonce,
        token: loginResponse.data.payload.token,
        refresh: loginResponse.data.payload.refresh_token,
      });
    } catch (e) {
      const { code, message } = e;
      return rejectWithValue({ code, message });
    }
  },
);

export const logoutRequest = createAsyncThunk(
  'auth/logoutRequest',
  async (_empty, { getState, rejectWithValue }) => {
    const { loading } = getState().auth;

    if (!loading) {
      return Promise.resolve();
    }

    try {
      AuthStore.remove();
      return Promise.resolve();
    } catch (e) {
      const { code, message } = e;
      return rejectWithValue({ code, message });
    }
  },
);

/*
- Status Workflow
1) check store for auth info
2) if found, save to state and set authorized = true
3) if not found, dispatch Login Workflow
*/
export const statusRequest = createAsyncThunk(
  'auth/statusRequest',
  async ({ account, provider }, { getState, rejectWithValue, dispatch }) => {
    const { loading } = getState().auth;
    let { authorized } = getState().auth;

    if (!loading) {
      return Promise.resolve();
    }

    try {
      if (!authorized) {
        const {
          storeAccount,
          storeNonce,
          storeToken,
          storeRefresh,
        } = AuthStore.get();

        if (storeAccount && storeNonce && storeToken && storeRefresh) {
          const result = await dispatch(
            authRestore({
              account: storeAccount,
              nonce: storeNonce,
              token: storeToken,
              refresh: storeRefresh,
            }),
          );
          unwrapResult(result);
        } else {
          const result = await dispatch(loginRequest({ account, provider }));
          unwrapResult(result);
        }
        authorized = true;
      }
      return Promise.resolve({ authorized });
    } catch (e) {
      const { code, message } = e;
      return rejectWithValue({ code, message });
    }
  },
);

export const refreshRequest = createAsyncThunk(
  'auth/refreshRequest',
  async (_empty, { getState, rejectWithValue }) => {
    const { loading, data } = getState().auth;
    if (!loading) {
      return Promise.resolve();
    }
    try {
      const response = await userService.refresh(data.refresh);
      return Promise.resolve(response.data.payload.token);
    } catch (e) {
      const { code, message } = e;
      return rejectWithValue({ code, message });
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRestore: (state, { payload }) => {
      state.data = payload;
    },
  },
  extraReducers: {
    // status action
    [statusRequest.pending]: (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    },
    [statusRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.authorized = action.payload.authorized;
    },
    [statusRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // login action
    [loginRequest.pending]: (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    },
    [loginRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [loginRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // logout action
    [logoutRequest.pending]: (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    },
    [logoutRequest.fulfilled]: (state) => {
      state.loading = false;
      state.authorized = false;
      state.data = initialState.data;
    },
    [logoutRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // refresh action
    [refreshRequest.pending]: (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    },
    [refreshRequest.fulfilled]: (state, action) => {
      state.loading = false;
      state.data.token = action.payload;
    },
    [refreshRequest.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});

export const { authRestore } = authSlice.actions;

export default authSlice.reducer;
