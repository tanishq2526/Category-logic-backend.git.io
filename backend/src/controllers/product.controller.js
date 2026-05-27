const ProductService = require("../services/product.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class ProductController {
  static create = catchAsync(async (req, res) => {
    const product = await ProductService.createProduct(req.body, req.files);
    return ApiResponse.success(res, "Product created successfully", product, 201);
  });

  static getAll = catchAsync(async (req, res) => {
    const result = await ProductService.getAllProducts(req.query);
    return ApiResponse.success(res, "Products fetched successfully", result.products, 200);
  });

  static getPublicAll = catchAsync(async (req, res) => {
    const products = await ProductService.getPublicProducts();
    return ApiResponse.success(res, "Public products fetched successfully", products, 200);
  });

  static getSingle = catchAsync(async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    return ApiResponse.success(res, "Product fetched successfully", product, 200);
  });

  static update = catchAsync(async (req, res) => {
    const product = await ProductService.updateProduct(req.params.id, req.body, req.files);
    return ApiResponse.success(res, "Product updated successfully", product, 200);
  });

  static delete = catchAsync(async (req, res) => {
    await ProductService.deleteProduct(req.params.id);
    return ApiResponse.success(res, "Product deleted successfully", {}, 200);
  });
}

module.exports = ProductController;
