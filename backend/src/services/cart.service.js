const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const ApiError = require("../utils/ApiError");

class CartService {
  static async getCart(userId) {
    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        populate: {
          path: "subCategory",
          populate: { path: "parentCategory" },
        },
      })
      .populate("coupon");

    if (!cart) {
      return { items: [], total: 0 };
    }

    return cart;
  }

  static async addToCart(userId, productId, quantity = 1) {
    if (!productId) {
      throw new ApiError(400, "Product ID is required");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    return cart;
  }

  static async updateQuantity(userId, productId, quantity) {
    if (quantity === undefined) {
      throw new ApiError(400, "Quantity is required");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found for this user");
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (!item) {
      throw new ApiError(404, "Item not found in cart");
    }

    const numQuantity = Number(quantity);
    if (numQuantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString()
      );
    } else {
      item.quantity = numQuantity;
    }

    await cart.save();
    return cart;
  }

  static async removeItem(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    return cart;
  }

  static async applyCoupon(userId, code) {
    if (!code) {
      throw new ApiError(400, "Coupon code is required");
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      status: "active",
    });

    if (!coupon) {
      throw new ApiError(404, "Invalid coupon code");
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      throw new ApiError(400, "Coupon has expired");
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    if (cart.items.length === 0) {
      throw new ApiError(400, "Cannot apply coupon to an empty cart");
    }

    // Type-safeObjectId checking: map Mongoose ObjectId to string for safe comparison
    if (coupon.type === "product") {
      const hasEligible = cart.items.some((item) =>
        coupon.applicableProducts.some(
          (apId) => apId.toString() === item.product._id.toString()
        )
      );

      if (!hasEligible) {
        throw new ApiError(400, "No eligible products in cart for this coupon");
      }
    }

    cart.coupon = coupon._id;
    await cart.save();

    return coupon;
  }
}

module.exports = CartService;
