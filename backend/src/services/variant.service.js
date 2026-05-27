const Variant = require("../models/Variant");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const { calculateDiscountPrice } = require("../utils/discount");

class VariantService {
  static async createVariant(data, file) {
    const { parentProduct, name, brand, price, discountPercent, status } = data;

    const isProduct = await Product.findById(parentProduct);
    if (!isProduct) {
      throw new ApiError(404, "Base product not found");
    }

    const image = file ? `/uploads/${file.filename}` : null;
    const finalDiscountPrice = calculateDiscountPrice(price, discountPercent);

    const variant = new Variant({
      parentProduct,
      image,
      name,
      brand,
      price,
      discountPercent: discountPercent || 0,
      discountPrice: finalDiscountPrice,
      status: status || "Active",
    });

    await variant.save();
    return variant;
  }

  static async getAllVariants(filters) {
    const { status, product } = filters;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }
    if (product && product !== "all") {
      query.parentProduct = product;
    }

    return Variant.find(query)
      .populate({
        path: "parentProduct",
        populate: {
          path: "subCategory",
          populate: { path: "parentCategory" },
        },
      })
      .sort({ createdAt: -1 });
  }

  static async updateVariant(id, data, file) {
    const { parentProduct, name, brand, price, discountPercent, status } = data;

    const existingVariant = await Variant.findById(id);
    if (!existingVariant) {
      throw new ApiError(404, "Variant product not found");
    }

    const updatedData = {
      name,
      brand,
      price,
      discountPercent,
      status,
    };

    if (file) {
      updatedData.image = `/uploads/${file.filename}`;
    }

    if (parentProduct) {
      const isProduct = await Product.findById(parentProduct);
      if (!isProduct) {
        throw new ApiError(404, "Base product not found");
      }
      updatedData.parentProduct = parentProduct;
    }

    // Recompute discount if price or percent changes
    const finalPrice = price !== undefined ? price : existingVariant.price;
    const finalPercent = discountPercent !== undefined ? discountPercent : existingVariant.discountPercent;

    if (price !== undefined || discountPercent !== undefined) {
      updatedData.discountPrice = calculateDiscountPrice(finalPrice, finalPercent);
    }

    const updatedVariant = await Variant.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return updatedVariant;
  }

  static async deleteVariant(id) {
    const variant = await Variant.findByIdAndDelete(id);
    if (!variant) {
      throw new ApiError(404, "Variant product not found");
    }
    return variant;
  }
}

module.exports = VariantService;
