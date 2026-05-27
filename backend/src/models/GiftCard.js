const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
  {
    receiverName: {
      type: String,
      required: [true, "Receiver name is required"],
      trim: true,
    },

    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Gift card code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    giftCardValue: {
      type: Number,
      required: [true, "Gift card value is required"],
      min: [0, "Gift card value cannot be negative"],
    },

    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

giftCardSchema.index({ code: 1 });
giftCardSchema.index({ status: 1 });

module.exports = mongoose.model("GiftCard", giftCardSchema);
