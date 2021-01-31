export * from "./users";
export * from "./posts";
export * from "./eth";

export const ErrorCodes = {
  Unauthorized: 401,
  NOTFOUND: 404,
  UNPROCESSABLE: 422,
  UNSPECIFIED: 0,
  BLOCKCHAIN: 9999,
};

export class ApiError {
  code;
  message;
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}
