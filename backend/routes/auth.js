const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, role, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid secret key" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });
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
    const jwtToken = jwt.sign(
      { id: isUser._id, role: isUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: jwtToken,
      user: {
        id: isUser._id,
        name: isUser.name,
        email: isUser.email,
        role: isUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router