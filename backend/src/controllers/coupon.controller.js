const CouponService = require("../services/coupon.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class CouponController {
  static create = catchAsync(async (req, res) => {
    const coupon = await CouponService.createCoupon(req.body);
    return ApiResponse.success(res, "Coupon created successfully", coupon, 201);
  });

  static getAll = catchAsync(async (req, res) => {
    const coupons = await CouponService.getAllCoupons();
    return ApiResponse.success(res, "Coupons loaded successfully", coupons, 200);
  });

  static getSingle = catchAsync(async (req, res) => {
    const coupon = await CouponService.getCouponById(req.params.id);
    return ApiResponse.success(res, "Coupon fetched successfully", coupon, 200);
  });

  static update = catchAsync(async (req, res) => {
    const coupon = await CouponService.updateCoupon(req.params.id, req.body);
    return ApiResponse.success(res, "Coupon updated successfully", coupon, 200);
  });

  static delete = catchAsync(async (req, res) => {
    await CouponService.deleteCoupon(req.params.id);
    return ApiResponse.success(res, "Coupon deleted successfully", {}, 200);
  });

  static search = catchAsync(async (req, res) => {
    const search = req.query.search || "";
    const limit = Number(req.query.limit) || 10;
    const products = await CouponService.searchProducts(search, limit);
    return ApiResponse.success(res, "Products searched successfully", products, 200);
  });

  static apply = catchAsync(async (req, res) => {
    const { couponCode, cartTotal, productId } = req.body;
    const result = await CouponService.applyCouponDirect(couponCode, cartTotal, productId);
    return ApiResponse.success(res, "Coupon applied successfully", result, 200);
  });
}

module.exports = CouponController;
