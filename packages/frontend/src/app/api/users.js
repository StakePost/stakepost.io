import config from "../config";
import { authHeader } from "../../utils";
import { ApiError, ErrorCodes } from "./index";

const register = async (address) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  };

  try {
    const response = await fetch(
      `${config.BackendBaseUri}/auth/signup`,
      requestOptions
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    } else {
      return Promise.reject(
        new ApiError(ErrorCodes.UNSPECIFIED, error.message)
      );
    }
  }
};

const login = async (address, signature) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature }),
  };

  try {
    const response = await fetch(
      `${config.BackendBaseUri}/auth/signin`,
      requestOptions
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    } else {
      return Promise.reject(
        new ApiError(ErrorCodes.UNSPECIFIED, error.message)
      );
    }
  }
};

const refresh = async (refreshToken) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  };

  try {
    const response = await fetch(
      `${config.BackendBaseUri}/auth/refresh`,
      requestOptions
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    } else {
      return Promise.reject(
        new ApiError(ErrorCodes.UNSPECIFIED, error.message)
      );
    }
  }
};

const nonce = async (address) => {
  const requestOptions = {
    method: "GET",
  };
  try {
    const response = await fetch(
      `${config.BackendBaseUri}/auth/nonce/${address}`,
      requestOptions
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    } else {
      return Promise.reject(
        new ApiError(ErrorCodes.UNSPECIFIED, error.message)
      );
    }
  }
};

const me = async () => {
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };
  try {
    const response = await fetch(
      `${config.BackendBaseUri}/auth/me`,
      requestOptions
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    } else {
      return Promise.reject(
        new ApiError(ErrorCodes.UNSPECIFIED, error.message)
      );
    }
  }
};

export const userService = {
  register,
  login,
  refresh,
  me,
  nonce,
};
