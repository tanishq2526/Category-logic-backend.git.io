const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Subcategory reference is required"],
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
      required: [true, "Product name is required"],
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
  { timestamps: true }
);

ProductSchema.index({ subCategory: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ name: "text", brand: "text" }); // Text search index for product search routing

module.exports = mongoose.model("Products", ProductSchema);
