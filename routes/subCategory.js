const express = require("express");
const router = express.Router();

const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");

// Create SubCategory
router.post("/create", async(req,res) => {
    try{
        const { parentCategory, name, slug, status } = req.body;
        const parentExists = await Category.findById(parentCategory)
        if(!parentExists){
            return res.status(404).json({
                success: false,
                message: "Parent category not found"
            })
        }
        const subCategory = new SubCategory ({
            parentCategory,
            name,
            slug,
            status,
        });
        await subCategory.save()
        res.status(201).json({
            success: true,
            message: "Subcategory created successfully :)",
            data: subCategory
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
})

// Display SubCategory
router.get("/all", async(req,res) => {
    try{

    }catch(error){

    }
})

// Update SubCategory
router.put("/update/:id", async(req,res) => {
    try{

    }catch(error){

    }
})

// Delete SubCategory
router.delete("/delete/:id", async(req,res) => {
    try{

    }catch(error){

    }
})

module.exports = router;