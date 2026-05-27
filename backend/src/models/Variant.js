const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema(
  {
    parentProduct: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Parent product reference is required"],
      ref: "Products",
    },

    image: {
      type: String,
      default: null,
    },

    image1: {
      type: String,
      default: null,
    },

    image2: {
      type: String,
      default: null,
    },

    image3: {
      type: String,
      default: null,
    },

    image4: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      required: [true, "Variant name is required"],
      trim: true,
    },

    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

VariantSchema.index({ parentProduct: 1 });
VariantSchema.index({ status: 1 });

module.exports = mongoose.model("Variants", VariantSchema);
