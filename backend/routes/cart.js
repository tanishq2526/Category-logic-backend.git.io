const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const verifyToken = require("../middleware/auth");

// Get cart
router.get("/", verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: "items.product",
        populate: {
          path: "subCategory",
          populate: { path: "parentCategory" },
        },
      })
      .populate("coupon");

    if (!cart) {
      return res
        .status(200)
        .json({ success: true, data: { items: [], total: 0 } });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add to cart
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Added to cart", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update quantity
router.put("/update/:productId", verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId,
    );

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.productId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove item
router.delete("/remove/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId,
    );
    await cart.save();
    res.status(200).json({ success: true, message: "Item removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply coupon
router.post("/apply-coupon", verifyToken, async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      status: "active",
    });

    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Invalid coupon" });
    if (new Date() > coupon.expiryDate)
      return res
        .status(400)
        .json({ success: false, message: "Coupon expired" });

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (coupon.type === "product") {
      const hasEligible = cart.items.some((item) =>
        coupon.applicableProducts.includes(item.product._id.toString()),
      );
      if (!hasEligible)
        return res
          .status(400)
          .json({ success: false, message: "No eligible products in cart" });
    }

    cart.coupon = coupon._id;
    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Coupon applied", data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
