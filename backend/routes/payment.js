import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import razorpay from "../config/razorpay.js";

const router = express.Router();

// A simple asyncHandler to catch errors and pass them to next(err)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @route   POST /api/payment/test-setup
// @desc    Setup dummy user and order for testing
// @access  Public
router.post(
  "/test-setup",
  asyncHandler(async (req, res, next) => {
    // 1. Get or create a test user
    let user = await User.findOne({ email: "test@razorpay.com" });
    if (!user) {
      user = await User.create({
        name: "Test User",
        email: "test@razorpay.com",
        password: "password123", // Will be hashed if User model has pre-save hook
      });
    }

    // 2. Create a test order
    const order = await Order.create({
      user: user._id,
      orderItems: [
        {
          name: "Test Product",
          qty: 1,
          image: "test.jpg",
          price: 500,
          product: new mongoose.Types.ObjectId(),
        },
      ],
      shippingAddress: {
        address: "123 Test St",
        city: "Test City",
        postalCode: "123456",
        country: "Test Country",
      },
      paymentMethod: "Razorpay",
      itemsPrice: 500,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 500,
    });

    // 3. Generate token and set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ orderId: order._id });
  })
);

// @route   POST /api/payment/create-order
// @desc    Create Razorpay Order
// @access  Private
router.post(
  "/create-order",
  protect,
  asyncHandler(async (req, res, next) => {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify it belongs to req.user
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to access this order" });
    }

    // Check paymentStatus is "pending"
    // Note: If using `isPaid` boolean, adjust to order.isPaid === false.
    // The prompt explicitly states paymentStatus ("pending"|"paid"|"failed")
    if (order.paymentStatus && order.paymentStatus !== "pending") {
       // Also check isPaid just in case order model uses both
       if(order.paymentStatus === "paid" || order.isPaid) {
          return res.status(400).json({ message: "Order is already paid" });
       }
    }

    // Amount should be in paise for INR
    const options = {
      amount: Math.round(order.totalPrice * 100), // prompt said order.totalAmount, but order.js uses totalPrice. I'll use totalPrice as per standard or try both.
      currency: "INR",
      receipt: order._id.toString(),
    };

    // If order model uses totalAmount:
    if (order.totalAmount) {
      options.amount = Math.round(order.totalAmount * 100);
    }

    const razorpayOrder = await razorpay.orders.create(options);

    // Save razorpayOrderId on the order document
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  })
);

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment
// @access  Private
router.post(
  "/verify",
  protect,
  asyncHandler(async (req, res, next) => {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Missing required payment details" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      order.paymentStatus = "paid";
      // ensure we also set standard fields if they exist
      order.isPaid = true;
      order.paidAt = Date.now();
      
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      order.orderStatus = "Processing"; 
      
      await order.save();

      res.status(200).json({
        message: "Payment verified successfully",
        orderId: order._id,
      });
    } else {
      order.paymentStatus = "failed";
      await order.save();
      
      res.status(400).json({ message: "Payment signature verification failed" });
    }
  })
);

// @route   POST /api/payment/webhook
// @desc    Razorpay Webhook handler
// @access  Public
router.post(
  "/webhook",
  asyncHandler(async (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not defined");
      return res.status(200).send("OK");
    }

    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).send("Signature missing");
    }

    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).send("Invalid signature");
    }

    // Process event
    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;
    
    // Find order by razorpayOrderId. 
    // Razorpay webhook payload for payment returns order_id inside the payment entity.
    const razorpayOrderId = paymentEntity.order_id;

    if (!razorpayOrderId) {
       return res.status(200).send("OK");
    }

    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(200).send("OK");
    }

    if (event === "payment.captured") {
      order.paymentStatus = "paid";
      order.isPaid = true;
      order.paidAt = Date.now();
      order.razorpayPaymentId = paymentEntity.id;
      order.orderStatus = "Processing";
      await order.save();
    } else if (event === "payment.failed") {
      order.paymentStatus = "failed";
      await order.save();
    }

    res.status(200).send("OK");
  })
);

export default router;
