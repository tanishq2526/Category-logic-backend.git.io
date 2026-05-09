const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");

// Create Product 
router.post('/create', async (req,res) =>{
    try{
        const { subCategory, name, brand, price, discountPrice, discountPercent, status } = req.body;
        const isSubCategory = await SubCategory.findById(subCategory);
        if(!isSubCategory){
            return res.status(404).json({
                success: false,
                message: "SubCategory not found"
            });
        }
        const product = new Product({
            subCategory,
            name,
            brand,
            price,
            discountPrice,
            discountPercent,
            status,
        });

        await product.save()
        res.status(201).json({
            success: true,
            message: "Product created successfully:)",
            data : product,
        })
    }catch ( error ){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

// Display products
router.get("/all", async(req, res) => {
    try{
         const products = await Product.find().populate({
        path : 'subCategory',
        populate: {
            path: 'parentCategory'
        }
    })

    res.status(200).json({
        success: true,
        message: "Displaying all products",
        data: products,
    })
    }catch(error){
        res.status(500).json({
            success : false,
            message: error.message,
        })
    };
   
}); 

// Update product
router.put('/update/:id', async(req, res) => {
    try{
        const ID = req.params.id;
        const updatedProduct = req.body;
        const makeUpdate = await Product.findByIdAndUpdate(ID, updatedProduct, {new: true})
        res.status(200).json({
            success: true,
            message: "Product updated successfully :)",
            data: makeUpdate,
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    };
}); 

// Delete Product
router.delete("/delete/:id", async(req,res) => {
try {
      const ID = req.params.id;
      const deleteProduct = await Product.findByIdAndDelete(ID);
      if (!deleteProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Product Deleted successfully",
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }

})

module.exports = router;