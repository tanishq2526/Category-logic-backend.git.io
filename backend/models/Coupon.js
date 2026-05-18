const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["cart", "product"],
      required: true,
    },
    discountPercent: {
      type: Number,
      required: true,
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
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
