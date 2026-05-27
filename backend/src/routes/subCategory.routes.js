const express = require("express");
const router = express.Router();
const SubCategoryController = require("../controllers/subCategory.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public endpoints (no token required)
router.get("/public/all", SubCategoryController.getPublicAll);

// Secured administrative endpoints
router.post("/create", verifyToken, isAdmin, SubCategoryController.create);
router.get("/all", verifyToken, isAdmin, SubCategoryController.getAll);
router.put("/update/:id", verifyToken, isAdmin, SubCategoryController.update);
router.delete("/delete/:id", verifyToken, isAdmin, SubCategoryController.delete);

module.exports = router;
