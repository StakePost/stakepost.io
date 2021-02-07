import config from '../config';
import { authHeader } from '../../utils';
import { ApiError, ErrorCodes } from './index';

const list = async (offset, limit) => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const params = new URLSearchParams({
    offset,
    limit,
  });
  try {
    const response = await fetch(
      `${config.BackendBaseUri}/posts?${params}`,
      requestOptions,
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }
    return Promise.reject(new ApiError(ErrorCodes.UNSPECIFIED, error.message));
  }
};

const create = async (content, stake, txHash) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ content, stake, txHash }),
  };

  try {
    const response = await fetch(
      `${config.BackendBaseUri}/posts`,
      requestOptions,
    );

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }
    return Promise.reject(new ApiError(ErrorCodes.UNSPECIFIED, error.message));
  }
};
export default {
  list,
  create,
};
