const User = require("../models/User");
const ApiError = require("../utils/ApiError");

class UserService {
  // Determine user status based on purchase frequency
  static determineUserStatus(lastLogin, totalOrders) {
    if (!lastLogin) return "deactive";
    
    const lastLoginDate = new Date(lastLogin);
    const daysSinceLastLogin = Math.floor((new Date() - lastLoginDate) / (1000 * 60 * 60 * 24));
    
    // Hot: frequent purchases (last login within 7 days OR 10+ orders)
    if (daysSinceLastLogin <= 7 || totalOrders >= 10) {
      return "hot";
    }
    
    // Cold: moderate purchases (last login within 30 days OR 3-9 orders)
    if (daysSinceLastLogin <= 30 || (totalOrders >= 3 && totalOrders < 10)) {
      return "cold";
    }
    
    // Deactive: very low/no recent purchases
    return "deactive";
  }

  static async getAllUsers(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    // Build filter query
    let query = {};

    if (filters.search) {
      query.$or = [
        { _id: new RegExp(filters.search, "i") },
        { name: new RegExp(filters.search, "i") },
        { email: new RegExp(filters.search, "i") },
        { phone: new RegExp(filters.search, "i") },
      ];
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.minSpend) {
      query.totalSpend = { $gte: parseFloat(filters.minSpend) };
    }

    if (filters.minOrders) {
      query.totalOrders = { $gte: parseInt(filters.minOrders) };
    }

    if (filters.signupDate) {
      const startDate = new Date(filters.signupDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Exclude admin users
    query.role = "user";

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    // Enhance user data with status
    const enhancedUsers = users.map((user) => ({
      ...user,
      status: user.status || UserService.determineUserStatus(user.lastLogin, user.totalOrders || 0),
      totalOrders: user.totalOrders || 0,
      lastLogin: user.lastLogin || null,
    }));

    return {
      data: enhancedUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserById(userId) {
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      ...user,
      status: user.status || UserService.determineUserStatus(user.lastLogin, user.totalOrders || 0),
      totalOrders: user.totalOrders || 0,
      lastLogin: user.lastLogin || null,
    };
  }

  static async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  static async blockUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true, updatedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  static async unblockUser(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false, updatedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  static async addTagToUser(userId, tag) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.tags) {
      user.tags = [];
    }

    if (!user.tags.includes(tag)) {
      user.tags.push(tag);
      await user.save();
    }

    return user;
  }

  static async removeTagFromUser(userId, tag) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.tags && user.tags.includes(tag)) {
      user.tags = user.tags.filter((t) => t !== tag);
      await user.save();
    }

    return user;
  }

  static async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return { message: "User deleted successfully" };
  }

  static async bulkUpdateStatus(userIds, newStatus) {
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { status: newStatus, updatedAt: new Date() }
    );

    return result;
  }

  static async bulkAddTag(userIds, tag) {
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $addToSet: { tags: tag }, updatedAt: new Date() }
    );

    return result;
  }

  static async bulkDeleteUsers(userIds) {
    const result = await User.deleteMany({ _id: { $in: userIds } });

    return result;
  }

  static async getUserStats() {
    const total = await User.countDocuments({ role: "user" });
    
    // For now, we'll calculate based on available data
    // In production, this should query actual order/purchase data
    const hotUsers = await User.countDocuments({
      role: "user",
      $or: [
        { lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        { totalOrders: { $gte: 10 } },
      ],
    });

    const coldUsers = await User.countDocuments({
      role: "user",
      lastLogin: { 
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      totalOrders: { $lt: 10 },
    });

    const deactiveUsers = total - hotUsers - coldUsers;

    return {
      total,
      hot: hotUsers,
      cold: coldUsers,
      deactive: Math.max(0, deactiveUsers),
    };
  }
}

module.exports = UserService;
