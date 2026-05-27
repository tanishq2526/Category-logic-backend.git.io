const UserService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class UserController {
  static getAllUsers = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      search: req.query.search || "",
      status: req.query.status || "",
      tags: req.query.tags ? req.query.tags.split(",") : [],
      minSpend: req.query.minSpend || "",
      minOrders: req.query.minOrders || "",
      signupDate: req.query.signupDate || "",
    };

    const result = await UserService.getAllUsers(page, limit, filters);

    return ApiResponse.success(
      res,
      "Users fetched successfully",
      result.data,
      200,
      {
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      }
    );
  });

  static getUserById = catchAsync(async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    return ApiResponse.success(res, "User fetched successfully", user, 200);
  });

  static updateUser = catchAsync(async (req, res) => {
    const user = await UserService.updateUser(req.params.id, req.body);
    return ApiResponse.success(res, "User updated successfully", user, 200);
  });

  static blockUser = catchAsync(async (req, res) => {
    const user = await UserService.blockUser(req.params.id);
    return ApiResponse.success(res, "User blocked successfully", user, 200);
  });

  static unblockUser = catchAsync(async (req, res) => {
    const user = await UserService.unblockUser(req.params.id);
    return ApiResponse.success(res, "User unblocked successfully", user, 200);
  });

  static addTag = catchAsync(async (req, res) => {
    const { tag } = req.body;
    if (!tag) {
      return ApiResponse.error(res, "Tag is required", 400);
    }
    const user = await UserService.addTagToUser(req.params.id, tag);
    return ApiResponse.success(res, "Tag added successfully", user, 200);
  });

  static removeTag = catchAsync(async (req, res) => {
    const { tag } = req.body;
    if (!tag) {
      return ApiResponse.error(res, "Tag is required", 400);
    }
    const user = await UserService.removeTagFromUser(req.params.id, tag);
    return ApiResponse.success(res, "Tag removed successfully", user, 200);
  });

  static deleteUser = catchAsync(async (req, res) => {
    const result = await UserService.deleteUser(req.params.id);
    return ApiResponse.success(res, "User deleted successfully", result, 200);
  });

  static bulkUpdateStatus = catchAsync(async (req, res) => {
    const { userIds, status } = req.body;
    if (!userIds || !Array.isArray(userIds) || !status) {
      return ApiResponse.error(res, "userIds array and status are required", 400);
    }
    const result = await UserService.bulkUpdateStatus(userIds, status);
    return ApiResponse.success(res, "Users status updated successfully", result, 200);
  });

  static bulkAddTag = catchAsync(async (req, res) => {
    const { userIds, tag } = req.body;
    if (!userIds || !Array.isArray(userIds) || !tag) {
      return ApiResponse.error(res, "userIds array and tag are required", 400);
    }
    const result = await UserService.bulkAddTag(userIds, tag);
    return ApiResponse.success(res, "Tag added to users successfully", result, 200);
  });

  static bulkDeleteUsers = catchAsync(async (req, res) => {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds)) {
      return ApiResponse.error(res, "userIds array is required", 400);
    }
    const result = await UserService.bulkDeleteUsers(userIds);
    return ApiResponse.success(res, "Users deleted successfully", result, 200);
  });

  static getUserStats = catchAsync(async (req, res) => {
    const stats = await UserService.getUserStats();
    return ApiResponse.success(res, "User statistics fetched successfully", stats, 200);
  });
}

module.exports = UserController;
