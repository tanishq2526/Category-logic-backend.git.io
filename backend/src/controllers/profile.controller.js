const ProfileService = require("../services/profile.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class ProfileController {
  static getAdmin = catchAsync(async (req, res) => {
    const profile = await ProfileService.getAdminProfile(req.user.id);
    return ApiResponse.success(res, "Profile fetched successfully", profile, 200);
  });

  static updateAdmin = catchAsync(async (req, res) => {
    const profile = await ProfileService.updateAdminProfile(req.user.id, req.body, req.file);
    return ApiResponse.success(res, "Profile updated successfully", profile, 200);
  });
}

module.exports = ProfileController;
