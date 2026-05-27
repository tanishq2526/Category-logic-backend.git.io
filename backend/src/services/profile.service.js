const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

class ProfileService {
  static async getAdminProfile(adminId) {
    const admin = await User.findById(adminId).select("-password");

    if (!admin || admin.role !== "admin") {
      throw new ApiError(401, "Not authenticated as admin");
    }

    return admin;
  }

  static async updateAdminProfile(adminId, data, file) {
    const admin = await User.findById(adminId);

    if (!admin || admin.role !== "admin") {
      throw new ApiError(401, "Not authenticated as admin");
    }

    const {
      name,
      email,
      phone,
      currentPassword,
      newPassword,
      confirmPassword,
    } = data;

    if (!name || !name.trim()) {
      throw new ApiError(400, "Name is required");
    }

    if (!email || !email.trim()) {
      throw new ApiError(400, "Email is required");
    }

    // Check email uniqueness if email has changed
    const targetEmail = email.trim().toLowerCase();
    if (targetEmail !== admin.email) {
      const existingUser = await User.findOne({ email: targetEmail });
      if (existingUser) {
        throw new ApiError(400, "Email is already in use by another user");
      }
    }

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        throw new ApiError(400, "Current password is required to change password");
      }

      // We compare currentPassword with the admin's hashed password in the DB
      const validPass = await bcrypt.compare(currentPassword, admin.password);
      if (!validPass) {
        throw new ApiError(400, "Current password is incorrect");
      }

      if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and password confirmation do not match");
      }

      if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long");
      }

      // Assign raw password (will be automatically hashed by UserSchema pre-save hook)
      admin.password = newPassword;
    }

    admin.name = name.trim();
    admin.email = targetEmail;
    admin.phone = phone ? phone.trim() : "";

    if (file) {
      admin.profileImage = `/uploads/${file.filename}`;
    }

    await admin.save();

    const profile = admin.toObject();
    delete profile.password;

    return profile;
  }
}

module.exports = ProfileService;
