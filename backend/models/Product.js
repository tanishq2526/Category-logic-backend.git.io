const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    image: {
      type: String,
      default: null, // Main Hero Image
    },
    image1: {
      type: String,
      default: null, // Carousel 1
    },
    image2: {
      type: String,
      default: null, // Carousel 2
    },
    image3: {
      type: String,
      default: null, // Carousel 3
    },
    image4: {
      type: String,
      default: null, // Carousel 4
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    discountPercent: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Products", ProductSchema);
