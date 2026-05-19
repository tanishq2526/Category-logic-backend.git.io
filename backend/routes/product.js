// const express = require("express");
// const router = express.Router();

// const Category = require("../models/Category");
// const SubCategory = require("../models/SubCategory");
// const Product = require("../models/Product");
// const upload = require("../middleware/upload");

// // Configure Multer to accept 5 distinct files
// const cpUpload = upload.fields([
//   { name: "image", maxCount: 1 },
//   { name: "image1", maxCount: 1 },
//   { name: "image2", maxCount: 1 },
//   { name: "image3", maxCount: 1 },
//   { name: "image4", maxCount: 1 },
// ]);

// // Create Product
// router.post("/create", cpUpload, async (req, res) => {
//   try {
//     const {
//       subCategory,
//       name,
//       brand,
//       price,
//       discountPrice,
//       discountPercent,
//       status,
//     } = req.body;
//     let finalDiscountPrice = discountPrice;

//     if (discountPercent && price) {
//       finalDiscountPrice = price - (price * discountPercent) / 100;
//     }

//     const isSubCategory = await SubCategory.findById(subCategory);
//     if (!isSubCategory) {
//       return res
//         .status(404)
//         .json({ success: false, message: "SubCategory not found" });
//     }

//     // Extract image paths if uploaded
//     const getImagePath = (field) =>
//       req.files && req.files[field]
//         ? `/uploads/${req.files[field].filename}`
//         : null;

//     const product = new Product({
//       subCategory,
//       name,
//       brand,
//       price,
//       discountPercent,
//       status,
//       discountPrice: finalDiscountPrice,
//       image: getImagePath("image"),
//       image1: getImagePath("image1"),
//       image2: getImagePath("image2"),
//       image3: getImagePath("image3"),
//       image4: getImagePath("image4"),
//     });

//     await product.save();
//     res.status(201).json({
//       success: true,
//       message: "Product created successfully:)",
//       data: product,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Display products
// router.get("/all", async (req, res) => {
//   try {
//     const { search, limit, page, status, subCategory } = req.query;
//     const query = {};

//     if (status) query.status = status;
//     if (subCategory) query.subCategory = subCategory;
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { brand: { $regex: search, $options: "i" } },
//       ];
//     }

//     const parsedLimit = parseInt(limit, 10) || 0;
//     const parsedPage = parseInt(page, 10) || 1;
//     const skip = parsedLimit > 0 ? (parsedPage - 1) * parsedLimit : 0;

//     const total = await Product.countDocuments(query);

//     let productsQuery = Product.find(query).populate({
//       path: "subCategory",
//       populate: { path: "parentCategory" },
//     });

//     if (parsedLimit > 0) {
//       productsQuery = productsQuery.skip(skip).limit(parsedLimit);
//     }

//     const products = await productsQuery;

//     res.status(200).json({
//       success: true,
//       message: "Displaying products",
//       data: products,
//       total,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Public route — no auth needed
// router.get("/public/all", async (req, res) => {
//   try {
//     const products = await Product.find({ status: "Active" }).populate({
//       path: "subCategory",
//       populate: { path: "parentCategory" },
//     });
//     res.status(200).json({ success: true, data: products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// router.get("/public/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate({
//       path: "subCategory",
//       populate: { path: "parentCategory" },
//     });
//     res.status(200).json({ success: true, data: product });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Update product
// router.put("/update/:id", cpUpload, async (req, res) => {
//   try {
//     const ID = req.params.id;
//     const updatedData = { ...req.body };

//     if (updatedData.discountPercent && updatedData.price) {
//       updatedData.discountPrice =
//         updatedData.price -
//         (updatedData.price * updatedData.discountPercent) / 100;
//     }

//     // If a new file is provided, overwrite the string value from req.body with the new file path
//     const fields = ["image", "image1", "image2", "image3", "image4"];
//     fields.forEach((field) => {
//       if (req.files && req.files[field]) {
//         updatedData[field] = `/uploads/${req.files[field].filename}`;
//       }
//     });

//     const makeUpdate = await Product.findByIdAndUpdate(ID, updatedData, {
//       new: true,
//     });
//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully :)",
//       data: makeUpdate,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Delete Product
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const ID = req.params.id;
//     const deleteProduct = await Product.findByIdAndDelete(ID);
//     if (!deleteProduct) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "Product Deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");
const upload = require("../middleware/upload");

// ======================================================
// MULTER CONFIG
// ======================================================

const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

// ======================================================
// HELPER FUNCTION
// ======================================================

const getImagePath = (files, field) => {
  if (files && files[field] && files[field][0] && files[field][0].filename) {
    return `/uploads/${files[field][0].filename}`;
  }

  return null;
};

// ======================================================
// CREATE PRODUCT
// ======================================================

router.post("/create", cpUpload, async (req, res) => {
  try {
    const {
      subCategory,
      name,
      brand,
      price,
      discountPrice,
      discountPercent,
      status,
    } = req.body;

    // ------------------------------
    // VALIDATION
    // ------------------------------

    if (!subCategory) {
      return res.status(400).json({
        success: false,
        message: "SubCategory is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!price) {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    // ------------------------------
    // CHECK SUBCATEGORY
    // ------------------------------

    const isSubCategory = await SubCategory.findById(subCategory);

    if (!isSubCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    // ------------------------------
    // DISCOUNT CALCULATION
    // ------------------------------

    let finalDiscountPrice = discountPrice || 0;

    if (discountPercent && price) {
      finalDiscountPrice =
        Number(price) - (Number(price) * Number(discountPercent)) / 100;
    }

    // ------------------------------
    // CREATE PRODUCT
    // ------------------------------

    const product = new Product({
      subCategory,
      name,
      brand,
      price,
      discountPrice: finalDiscountPrice,
      discountPercent,
      status,

      image: getImagePath(req.files, "image"),
      image1: getImagePath(req.files, "image1"),
      image2: getImagePath(req.files, "image2"),
      image3: getImagePath(req.files, "image3"),
      image4: getImagePath(req.files, "image4"),
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// GET ALL PRODUCTS (ADMIN)
// ======================================================

router.get("/all", async (req, res) => {
  try {
    const { search, limit, page, status, subCategory } = req.query;

    const query = {};

    // ------------------------------
    // FILTERS
    // ------------------------------

    if (status) {
      query.status = status;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    // ------------------------------
    // SEARCH
    // ------------------------------

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // ------------------------------
    // PAGINATION
    // ------------------------------

    const parsedLimit = parseInt(limit) || 0;
    const parsedPage = parseInt(page) || 1;

    const skip = parsedLimit > 0 ? (parsedPage - 1) * parsedLimit : 0;

    // ------------------------------
    // TOTAL COUNT
    // ------------------------------

    const total = await Product.countDocuments(query);

    // ------------------------------
    // FETCH PRODUCTS
    // ------------------------------

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

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      total,
      data: products,
    });
  } catch (error) {
    console.log("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// PUBLIC PRODUCTS
// ======================================================

router.get("/public/all", async (req, res) => {
  try {
    const products = await Product.find({
      status: "Active",
    })
      .populate({
        path: "subCategory",
        populate: {
          path: "parentCategory",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log("PUBLIC PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// GET SINGLE PRODUCT
// ======================================================

router.get("/public/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "subCategory",
      populate: {
        path: "parentCategory",
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log("GET SINGLE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// UPDATE PRODUCT
// ======================================================

router.put("/update/:id", cpUpload, async (req, res) => {
  try {
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedData = {
      ...req.body,
    };

    // ------------------------------
    // DISCOUNT CALCULATION
    // ------------------------------

    if (updatedData.discountPercent && updatedData.price) {
      updatedData.discountPrice =
        Number(updatedData.price) -
        (Number(updatedData.price) * Number(updatedData.discountPercent)) / 100;
    }

    // ------------------------------
    // IMAGE UPDATE
    // ------------------------------

    const imageFields = ["image", "image1", "image2", "image3", "image4"];

    imageFields.forEach((field) => {
      const newImage = getImagePath(req.files, field);

      if (newImage) {
        updatedData[field] = newImage;
      }
    });

    // ------------------------------
    // UPDATE PRODUCT
    // ------------------------------

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// DELETE PRODUCT
// ======================================================

router.delete("/delete/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("DELETE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;