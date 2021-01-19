import config from "../config";
import { authHeader } from "../../utils";

const list = async (offset, limit) => {
  const requestOptions = {
    method: "GET",
  };
  const params = new URLSearchParams({
    offset,
    limit,
  });
  try {
    const response = await fetch(
      `${config.BackendBaseUri}/posts?${params}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`An error has occured: ${response.statusText}`);
    }

    return response.json();
  } catch (e) {
    return Promise.reject(e.message);
  }
};

export const postService = {
  list,
};
