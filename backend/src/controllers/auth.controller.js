const AuthService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class AuthController {
  static register = catchAsync(async (req, res) => {
    const user = await AuthService.registerUser(req.body);
    return ApiResponse.success(res, "User registered successfully", { id: user._id, name: user.name, email: user.email }, 201);
  });

  static registerAdmin = catchAsync(async (req, res) => {
    const admin = await AuthService.registerAdmin(req.body);
    return ApiResponse.success(res, "Admin registered successfully", { id: admin._id, name: admin.name, email: admin.email }, 201);
  });

  static login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    return ApiResponse.success(res, "Login successful", result, 200);
  });
}

module.exports = AuthController;
