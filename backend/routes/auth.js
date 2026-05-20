const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

const sendAuthResponse = (res, statusCode, message, user) => {
  const token = createToken(user);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};

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
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, phone, secretKey } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !secretKey) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and admin secret are required",
      });
    }

    if (secretKey !== process.env.ADMIN_SECRET) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid secret key" });
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
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const isUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (!isUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const validPass = await bcrypt.compare(password, isUser.password);
    if (!validPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    return sendAuthResponse(res, 200, "Login successful", isUser);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
