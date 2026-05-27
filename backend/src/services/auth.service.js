const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");

class AuthService {
  static async registerUser(payload) {
    const { name, email, password } = payload;

    // Check if email already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email is already registered");
    }

    // Create user. Role is strictly hardcoded to "user" to prevent Privilege Escalation.
    const user = new User({
      name,
      email,
      password,
      role: "user",
    });

    await user.save();
    return user;
  }

  static async registerAdmin(payload) {
    const { name, email, password, secretKey } = payload;

    // Validate admin secret key
    if (!config.admin.secret || secretKey !== config.admin.secret) {
      throw new ApiError(403, "Invalid administrative secret key");
    }

    // Check if email already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email is already registered");
    }

    const admin = new User({
      name,
      email,
      password,
      role: "admin",
    });

    await admin.save();
    return admin;
  }

  static async login(email, password) {
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid password credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpirationMinutes }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = AuthService;
