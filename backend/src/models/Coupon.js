const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["cart", "product"],
      required: [true, "Coupon type is required"],
    },
    discountPercent: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    usages: {
      type: Number,
      required: true,
      default: 0,
    },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ status: 1 });

module.exports = mongoose.model("Coupon", couponSchema);
