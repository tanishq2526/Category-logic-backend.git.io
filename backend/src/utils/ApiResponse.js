class ApiResponse {
  static success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message, error = {}, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: typeof error === "string" ? { message: error } : error,
    });
  }
}

module.exports = ApiResponse;
