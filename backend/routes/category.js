const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Create category
router.post("/create", async (req, res) => {
  try {
    const { name, slug, status } = req.body;

    const category = new Category({
      name,
      slug,
      status,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created Successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all categories
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      message: "Data loaded successfully",
      data : categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/public/all", async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// update category
router.put("/update/:id", async (req, res) => {
    try{
        const ID = req.params.id
        const updatedField = req.body;
        const makeUpdate = await Category.findByIdAndUpdate(ID, updatedField, {new : true})
        res.status(200).json({
          success: true,
          message: "Data updated successfully",
          data: makeUpdate,
        });
    } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
    }

});

// Delete category
router.delete("/delete/:id", async (req, res) => {
    try {
      const ID = req.params.id;
      const deleteCategory = await Category.findByIdAndDelete(ID);
      if (!deleteCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Data Deleted successfully",
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }

});

module.exports = router;
