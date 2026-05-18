const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Variant = require("../models/Variant");
const upload = require("../middleware/upload");

// Create variant product
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { parentProduct, name, brand, price, discountPercent, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const isProduct = await Product.findById(parentProduct);

    if (!isProduct) {
      return res.status(404).json({ success: false, message: "Base product not found" });
    }

    const variant = new Variant({
      parentProduct,
      image,
      name,
      brand,
      price,
      discountPercent,
      discountPrice:
        discountPercent && price
          ? Number(price) - (Number(price) * Number(discountPercent)) / 100
          : undefined,
      status: status || "Active",
    });

    await variant.save();
    res.status(201).json({ success: true, message: "Variant product created successfully", data: variant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all variants
router.get("/all", async (req, res) => {
  try {
    const { status, product } = req.query;
    const query = {};

    if (status && status !== "all") query.status = status;
    if (product && product !== "all") query.parentProduct = product;

    const variants = await Variant.find(query)
      .populate({
        path: "parentProduct",
        populate: {
          path: "subCategory",
          populate: { path: "parentCategory" },
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: "Variant products loaded", data: variants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update variant product
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { parentProduct, name, brand, price, discountPercent, status } = req.body;
    const updatedData = {
      parentProduct,
      name,
      brand,
      price,
      discountPercent,
      status,
      discountPrice:
        discountPercent && price
          ? Number(price) - (Number(price) * Number(discountPercent)) / 100
          : undefined,
    };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    if (parentProduct) {
      const isProduct = await Product.findById(parentProduct);
      if (!isProduct) {
        return res.status(404).json({ success: false, message: "Base product not found" });
      }
    }

    const variant = await Variant.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant product not found" });
    }

    res.status(200).json({ success: true, message: "Variant product updated successfully", data: variant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete variant product
router.delete("/delete/:id", async (req, res) => {
  try {
    const variant = await Variant.findByIdAndDelete(req.params.id);
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant product not found" });
    }

    res.status(200).json({ success: true, message: "Variant product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
