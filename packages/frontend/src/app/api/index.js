import { Class } from "@material-ui/icons";

export const ErrorCodes = {
  NOTFOUND: 404,
  UNPROCESSABLE: 422,
  UNSPECIFIED: 0,
};

export class ApiError {
  code;
  message;
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}
