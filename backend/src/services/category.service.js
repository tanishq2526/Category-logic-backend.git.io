const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const ApiError = require("../utils/ApiError");

class CategoryService {
  static async createCategory(data) {
    const { name, slug, status } = data;

    if (!name || !slug) {
      throw new ApiError(400, "Category name and slug are required");
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug: slug.toLowerCase() }],
    });
    if (existingCategory) {
      throw new ApiError(400, "Category name or slug already exists");
    }

    const category = new Category({
      name,
      slug: slug.toLowerCase(),
      status: status || "Active",
    });

    await category.save();
    return category;
  }

  static async getAllCategories() {
    return Category.find().sort({ createdAt: -1 });
  }

  static async getPublicCategories() {
    // FIX MATCHING CASE BUG: schema enum is "Active" and "Inactive". We query using "Active" (capitalized).
    return Category.find({ status: "Active" }).sort({ name: 1 });
  }

  static async updateCategory(id, updatedFields) {
    if (updatedFields.slug) {
      updatedFields.slug = updatedFields.slug.toLowerCase();
    }

    const category = await Category.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Cascade status inactivation to subcategories
    if (category.status === "Inactive") {
      await SubCategory.updateMany(
        { parentCategory: id },
        { status: "Inactive" }
      );
    }

    return category;
  }

  static async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  }
}

module.exports = CategoryService;
