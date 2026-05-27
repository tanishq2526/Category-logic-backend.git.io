const CategoryService = require("../services/category.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class CategoryController {
  static create = catchAsync(async (req, res) => {
    const category = await CategoryService.createCategory(req.body);
    return ApiResponse.success(res, "Category created successfully", category, 201);
  });

  static getAll = catchAsync(async (req, res) => {
    const categories = await CategoryService.getAllCategories();
    return ApiResponse.success(res, "Categories loaded successfully", categories, 200);
  });

  static getPublicAll = catchAsync(async (req, res) => {
    const categories = await CategoryService.getPublicCategories();
    return ApiResponse.success(res, "Public categories loaded successfully", categories, 200);
  });

  static update = catchAsync(async (req, res) => {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    return ApiResponse.success(res, "Category updated successfully", category, 200);
  });

  static delete = catchAsync(async (req, res) => {
    await CategoryService.deleteCategory(req.params.id);
    return ApiResponse.success(res, "Category deleted successfully", {}, 200);
  });
}

module.exports = CategoryController;
