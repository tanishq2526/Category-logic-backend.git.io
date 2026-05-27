const SubCategoryService = require("../services/subCategory.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class SubCategoryController {
  static create = catchAsync(async (req, res) => {
    const subCategory = await SubCategoryService.createSubCategory(req.body);
    return ApiResponse.success(res, "Subcategory created successfully", subCategory, 201);
  });

  static getAll = catchAsync(async (req, res) => {
    const subCategories = await SubCategoryService.getAllSubCategories();
    return ApiResponse.success(res, "Subcategories loaded successfully", subCategories, 200);
  });

  static getPublicAll = catchAsync(async (req, res) => {
    const subCategories = await SubCategoryService.getPublicSubCategories();
    return ApiResponse.success(res, "Public subcategories loaded successfully", subCategories, 200);
  });

  static update = catchAsync(async (req, res) => {
    const subCategory = await SubCategoryService.updateSubCategory(req.params.id, req.body);
    return ApiResponse.success(res, "Subcategory updated successfully", subCategory, 200);
  });

  static delete = catchAsync(async (req, res) => {
    await SubCategoryService.deleteSubCategory(req.params.id);
    return ApiResponse.success(res, "Subcategory deleted successfully", {}, 200);
  });
}

module.exports = SubCategoryController;
