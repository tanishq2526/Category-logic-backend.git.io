const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  const responseError = {
    message,
    ...(config.env === "development" && { stack: error.stack }),
  };

  if (statusCode >= 500) {
    console.error("[SYSTEM ERROR]:", err);
  }

  return ApiResponse.error(res, message, responseError, statusCode);
};

module.exports = errorHandler;
