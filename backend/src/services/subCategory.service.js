const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");

class SubCategoryService {
  static async createSubCategory(data) {
    const { parentCategory, name, slug, status } = data;

    if (!parentCategory || !name || !slug) {
      throw new ApiError(400, "Parent category, name, and slug are required");
    }

    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) {
      throw new ApiError(404, "Parent category not found");
    }

    if (parentExists.status === "Inactive" && status === "Active") {
      throw new ApiError(400, "Cannot activate subcategory because its parent category is inactive.");
    }

    const existingSubCategory = await SubCategory.findOne({
      $or: [{ name }, { slug: slug.toLowerCase() }],
    });
    if (existingSubCategory) {
      throw new ApiError(400, "Subcategory name or slug already exists");
    }

    const finalStatus = parentExists.status === "Inactive" ? "Inactive" : status || "Active";

    const subCategory = new SubCategory({
      parentCategory,
      name,
      slug: slug.toLowerCase(),
      status: finalStatus,
    });

    await subCategory.save();
    return subCategory.populate("parentCategory");
  }

  static async getAllSubCategories() {
    return SubCategory.find().populate("parentCategory").sort({ createdAt: -1 });
  }

  static async getPublicSubCategories() {
    // FIX MATCHING CASE BUG: schema enum is "Active" and "Inactive". We query using "Active" (capitalized).
    return SubCategory.find({ status: "Active" }).populate("parentCategory").sort({ name: 1 });
  }

  static async updateSubCategory(id, updatedFields) {
    const existingSubCategory = await SubCategory.findById(id);
    if (!existingSubCategory) {
      throw new ApiError(404, "SubCategory not found");
    }

    const parentId = updatedFields.parentCategory || existingSubCategory.parentCategory;
    const parentExists = await Category.findById(parentId);
    if (!parentExists) {
      throw new ApiError(404, "Parent category not found");
    }

    if (parentExists.status === "Inactive") {
      if (updatedFields.status === "Active") {
        throw new ApiError(400, "Cannot activate subcategory because its parent category is inactive.");
      }
      updatedFields.status = "Inactive";
    }

    if (updatedFields.slug) {
      updatedFields.slug = updatedFields.slug.toLowerCase();
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    }).populate("parentCategory");

    return updatedSubCategory;
  }

  static async deleteSubCategory(id) {
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
      throw new ApiError(404, "SubCategory not found");
    }
    return subCategory;
  }
}

module.exports = SubCategoryService;
