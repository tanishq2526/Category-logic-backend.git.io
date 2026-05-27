/*
 * Handover note: Authentication API.
 * Handles user registration, admin registration with ADMIN_SECRET, login, JWT creation,
 * and logout. Login responses feed localStorage on the React side.
 */
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";

const router = express.Router();

// ─── Rate Limiter ────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/**
 * Sets an httpOnly cookie with the JWT and returns a JSON response.
 * Cookie expiry matches the token expiry (7 days).
 */
const sendAuthResponse = (res, statusCode, message, user) => {
  const token = createToken(user);

  // ✅ FIX: Token is now written to a secure httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true, // not accessible via JS
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return res.status(statusCode).json({
    success: true,
    message,
    token, // also returned in body for clients using Authorization header
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim() || "",
      role: "user",
    });

    await newUser.save();

    return sendAuthResponse(res, 201, "User registered successfully", newUser);
  } catch (error) {
    console.error("Register error:", error); // ✅ FIX: log the real error
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// @route   POST /api/auth/register-admin
// @desc    Register a new admin (requires ADMIN_SECRET)
// @access  Private (secret key protected)
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, phone, secretKey } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !secretKey) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and admin secret are required",
      });
    }

    // ✅ Secret key checked BEFORE any DB work to fail fast
    if (secretKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid secret key",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim() || "",
      role: "admin",
    });

    await newUser.save();

    return sendAuthResponse(res, 201, "Admin registered successfully", newUser);
  } catch (error) {
    console.error("Register-admin error:", error); // ✅ FIX: log the real error
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or admin
// @access  Public
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ FIX: renamed from misleading "isUser" to "user"
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return sendAuthResponse(res, 200, "Login successful", user);
  } catch (error) {
    console.error("Login error:", error); // ✅ FIX: log the real error
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// @route   POST /api/auth/logout
// @desc    Clear the auth cookie
// @access  Public
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

export default router;
