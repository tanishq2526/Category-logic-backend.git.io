const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Parent category is required"],
    },
    name: {
      type: String,
      required: [true, "SubCategory name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
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

subCategorySchema.index({ parentCategory: 1 });
subCategorySchema.index({ slug: 1 });
subCategorySchema.index({ status: 1 });

module.exports = mongoose.model("SubCategory", subCategorySchema);
