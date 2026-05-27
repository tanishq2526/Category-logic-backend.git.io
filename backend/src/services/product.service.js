const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");
const ApiError = require("../utils/ApiError");
const { calculateDiscountPrice } = require("../utils/discount");

class ProductService {
  static async createProduct(data, files) {
    const { subCategory, name, brand, price, discountPercent, status } = data;

    if (!subCategory) {
      throw new ApiError(400, "SubCategory is required");
    }
    if (!name) {
      throw new ApiError(400, "Product name is required");
    }
    if (!price) {
      throw new ApiError(400, "Price is required");
    }

    const isSubCategory = await SubCategory.findById(subCategory);
    if (!isSubCategory) {
      throw new ApiError(404, "SubCategory not found");
    }

    const finalDiscountPrice = calculateDiscountPrice(price, discountPercent);

    // Extract image paths
    const getImagePath = (field) => {
      if (files && files[field] && files[field][0] && files[field][0].filename) {
        return `/uploads/${files[field][0].filename}`;
      }
      return null;
    };

    const product = new Product({
      subCategory,
      name,
      brand,
      price,
      discountPercent: discountPercent || 0,
      discountPrice: finalDiscountPrice,
      status: status || "Active",
      image: getImagePath("image"),
      image1: getImagePath("image1"),
      image2: getImagePath("image2"),
      image3: getImagePath("image3"),
      image4: getImagePath("image4"),
    });

    await product.save();
    return product;
  }

  static async getAllProducts(filters) {
    const { search, limit, page, status, subCategory } = filters;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (subCategory) {
      query.subCategory = subCategory;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    const parsedLimit = parseInt(limit) || 0;
    const parsedPage = parseInt(page) || 1;
    const skip = parsedLimit > 0 ? (parsedPage - 1) * parsedLimit : 0;

    const total = await Product.countDocuments(query);

    let productsQuery = Product.find(query)
      .populate({
        path: "subCategory",
        populate: {
          path: "parentCategory",
        },
      })
      .sort({ createdAt: -1 });

    if (parsedLimit > 0) {
      productsQuery = productsQuery.skip(skip).limit(parsedLimit);
    }

    const products = await productsQuery;

    return {
      products,
      total,
    };
  }

  static async getPublicProducts() {
    return Product.find({ status: "Active" })
      .populate({
        path: "subCategory",
        populate: {
          path: "parentCategory",
        },
      })
      .sort({ createdAt: -1 });
  }

  static async getProductById(id) {
    const product = await Product.findById(id).populate({
      path: "subCategory",
      populate: {
        path: "parentCategory",
      },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return product;
  }

  static async updateProduct(id, data, files) {
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    const updatedData = { ...data };

    // Calculate discount if price or percent changes
    const price = updatedData.price !== undefined ? updatedData.price : existingProduct.price;
    const discountPercent = updatedData.discountPercent !== undefined ? updatedData.discountPercent : existingProduct.discountPercent;

    if (updatedData.price !== undefined || updatedData.discountPercent !== undefined) {
      updatedData.discountPrice = calculateDiscountPrice(price, discountPercent);
    }

    // Extract image paths if uploaded
    const getImagePath = (field) => {
      if (files && files[field] && files[field][0] && files[field][0].filename) {
        return `/uploads/${files[field][0].filename}`;
      }
      return null;
    };

    const imageFields = ["image", "image1", "image2", "image3", "image4"];
    imageFields.forEach((field) => {
      const newImage = getImagePath(field);
      if (newImage) {
        updatedData[field] = newImage;
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return updatedProduct;
  }

  static async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return product;
  }
}

module.exports = ProductService;
