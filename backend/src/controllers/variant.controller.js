const VariantService = require("../services/variant.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class VariantController {
  static create = catchAsync(async (req, res) => {
    const variant = await VariantService.createVariant(req.body, req.file);
    return ApiResponse.success(res, "Variant product created successfully", variant, 201);
  });

  static getAll = catchAsync(async (req, res) => {
    const variants = await VariantService.getAllVariants(req.query);
    return ApiResponse.success(res, "Variant products loaded successfully", variants, 200);
  });

  static update = catchAsync(async (req, res) => {
    const variant = await VariantService.updateVariant(req.params.id, req.body, req.file);
    return ApiResponse.success(res, "Variant product updated successfully", variant, 200);
  });

  static delete = catchAsync(async (req, res) => {
    await VariantService.deleteVariant(req.params.id);
    return ApiResponse.success(res, "Variant product deleted successfully", {}, 200);
  });
}

module.exports = VariantController;
