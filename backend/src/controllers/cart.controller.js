const CartService = require("../services/cart.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

class CartController {
  static get = catchAsync(async (req, res) => {
    const cart = await CartService.getCart(req.user.id);
    return ApiResponse.success(res, "Cart fetched successfully", cart, 200);
  });

  static add = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await CartService.addToCart(req.user.id, productId, quantity);
    return ApiResponse.success(res, "Item added to cart", cart, 200);
  });

  static update = catchAsync(async (req, res) => {
    const cart = await CartService.updateQuantity(req.user.id, req.params.productId, req.body.quantity);
    return ApiResponse.success(res, "Cart updated successfully", cart, 200);
  });

  static remove = catchAsync(async (req, res) => {
    const cart = await CartService.removeItem(req.user.id, req.params.productId);
    return ApiResponse.success(res, "Item removed from cart", cart, 200);
  });

  static applyCoupon = catchAsync(async (req, res) => {
    const coupon = await CartService.applyCoupon(req.user.id, req.body.code);
    return ApiResponse.success(res, "Coupon applied successfully", coupon, 200);
  });
}

module.exports = CartController;
