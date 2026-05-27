const Coupon = require("../models/Coupon");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

class CouponService {
  static normalizeCoupon(coupon) {
    if (!coupon) return null;
    const obj = coupon.toObject ? coupon.toObject() : coupon;

    return {
      ...obj,
      couponCode: obj.code,
      discount: obj.discountPercent,
      products: obj.applicableProducts,
      expires: obj.expiryDate,
    };
  }

  static async createCoupon(data) {
    const { couponCode, discount, usages, expires, status, type, products } = data;

    if (!couponCode) {
      throw new ApiError(400, "Coupon code is required");
    }

    if (!discount || discount <= 0 || discount > 100) {
      throw new ApiError(400, "Valid discount percentage (1-100) is required");
    }

    const existingCoupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
    });

    if (existingCoupon) {
      throw new ApiError(400, "Coupon code already exists");
    }

    if (type === "product" && (!products || products.length === 0)) {
      throw new ApiError(400, "Select at least one product for product coupon");
    }

    const coupon = new Coupon({
      code: couponCode.toUpperCase(),
      discountPercent: discount,
      usages: usages || 0,
      expiryDate: expires,
      status: status || "active",
      type: type || "cart",
      applicableProducts: type === "product" ? products : [],
    });

    await coupon.save();
    return this.normalizeCoupon(coupon);
  }

  static async getAllCoupons() {
    const coupons = await Coupon.find()
      .populate("applicableProducts", "name price")
      .sort({ createdAt: -1 });

    return coupons.map((c) => this.normalizeCoupon(c));
  }

  static async getCouponById(id) {
    const coupon = await Coupon.findById(id).populate(
      "applicableProducts",
      "name price"
    );

    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    return this.normalizeCoupon(coupon);
  }

  static async updateCoupon(id, data) {
    const { couponCode, discount, usages, expires, status, type, products } = data;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }

    if (couponCode && couponCode.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
      });
      if (existingCoupon) {
        throw new ApiError(400, "Coupon code already exists");
      }
      coupon.code = couponCode.toUpperCase();
    }

    if (type === "product" && (!products || products.length === 0)) {
      throw new ApiError(400, "Select at least one product for product coupon");
    }

    if (discount !== undefined) {
      if (discount <= 0 || discount > 100) {
        throw new ApiError(400, "Valid discount percentage (1-100) is required");
      }
      coupon.discountPercent = discount;
    }

    if (usages !== undefined) coupon.usages = usages;
    if (expires !== undefined) coupon.expiryDate = expires;
    if (status !== undefined) coupon.status = status;
    if (type !== undefined) {
      coupon.type = type;
      coupon.applicableProducts = type === "product" ? products : [];
    }

    await coupon.save();
    return this.normalizeCoupon(coupon);
  }

  static async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }
    return coupon;
  }

  static async searchProducts(search, limit) {
    const query = {};

    if (search && search.trim()) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // FIX IMAGE SELECTION BUG: Product model has individual image properties (image image1 image2...) rather than "images".
    const products = await Product.find(query)
      .select("name price image image1 image2 image3 image4")
      .limit(limit)
      .sort({ createdAt: -1 });

    return products;
  }

  static async applyCouponDirect(couponCode, cartTotal, productId) {
    if (!couponCode) {
      throw new ApiError(400, "Coupon code is required");
    }

    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
    });

    if (!coupon) {
      throw new ApiError(404, "Invalid coupon code");
    }

    if (coupon.status !== "active") {
      throw new ApiError(400, "Coupon is inactive");
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      throw new ApiError(400, "Coupon has expired");
    }

    if (coupon.usages <= 0) {
      throw new ApiError(400, "Coupon usage limit exceeded");
    }

    if (coupon.type === "product") {
      if (!productId) {
        throw new ApiError(400, "Product ID is required for this product coupon");
      }

      const allowed = coupon.applicableProducts.some(
        (p) => p.toString() === productId.toString()
      );

      if (!allowed) {
        throw new ApiError(400, "Coupon is not applicable to this product");
      }
    }

    const discountAmount = Number(((cartTotal * coupon.discountPercent) / 100).toFixed(2));
    const finalAmount = Number((cartTotal - discountAmount).toFixed(2));

    // Reduce usages
    coupon.usages -= 1;
    await coupon.save();

    return {
      originalAmount: cartTotal,
      discountPercent: coupon.discountPercent,
      discountAmount,
      finalAmount,
      couponType: coupon.type,
    };
  }
}

module.exports = CouponService;
