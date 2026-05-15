const express = require("express");
const router = express.Router();

const Coupon = require("../models/Coupon");
const Product = require("../models/Product");

//
// CREATE COUPON
//
router.post("/create", async (req, res) => {
  try {
    const { couponCode, discount, usages, expires, status, type, products } =
      req.body;

    // Validation
    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!discount || discount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid discount is required",
      });
    }

    // Duplicate check
    const existingCoupon = await Coupon.findOne({
      couponCode: couponCode.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    // Product applicable validation
    if (type === "product" && (!products || products.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Select at least one product for product coupon",
      });
    }

    const coupon = new Coupon({
      couponCode: couponCode.toUpperCase(),
      discount,
      usages,
      expires,
      status,
      type,
      products: type === "product" ? products : [],
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//
// GET ALL COUPONS
//
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("products", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//
// GET SINGLE COUPON
//
router.get("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate(
      "products",
      "name price",
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//
// UPDATE COUPON
//
router.put("/update/:id", async (req, res) => {
  try {
    const { couponCode, discount, usages, expires, status, type, products } =
      req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Duplicate coupon check
    const existingCoupon = await Coupon.findOne({
      couponCode: couponCode.toUpperCase(),
      _id: { $ne: req.params.id },
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    // Product coupon validation
    if (type === "product" && (!products || products.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Select at least one product",
      });
    }

    coupon.couponCode = couponCode.toUpperCase();
    coupon.discount = discount;
    coupon.usages = usages;
    coupon.expires = expires;
    coupon.status = status;
    coupon.type = type;

    coupon.products = type === "product" ? products : [];

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//
// DELETE COUPON
//
router.delete("/delete/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//
// SEARCH PRODUCTS FOR PRODUCT COUPON
// only 10 products initially
//
router.get("/products/search", async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = Number(req.query.limit) || 10;

    const query = {};

    if (search.trim()) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const products = await Product.find(query)
      .select("name price images")
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//
// APPLY COUPON
//
router.post("/apply", async (req, res) => {
  try {
    const { couponCode, cartTotal, productId } = req.body;

    const coupon = await Coupon.findOne({
      couponCode: couponCode.toUpperCase(),
    });

    // Coupon not found
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // Inactive coupon
    if (coupon.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Coupon is inactive",
      });
    }

    // Expired coupon
    if (coupon.expires && new Date(coupon.expires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }

    // Usage limit finished
    if (coupon.usages <= 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded",
      });
    }

    // Product applicable validation
    if (coupon.type === "product") {
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID required for this coupon",
        });
      }

      const allowed = coupon.products.some((p) => p.toString() === productId);

      if (!allowed) {
        return res.status(400).json({
          success: false,
          message: "Coupon not applicable on this product",
        });
      }
    }

    // Discount calculation
    const discountAmount = (cartTotal * coupon.discount) / 100;

    const finalAmount = cartTotal - discountAmount;

    // Reduce usages
    coupon.usages -= 1;

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",

      data: {
        originalAmount: cartTotal,
        discountPercent: coupon.discount,
        discountAmount,
        finalAmount,
        couponType: coupon.type,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
