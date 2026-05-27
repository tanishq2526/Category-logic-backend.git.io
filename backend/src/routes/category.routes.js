const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public endpoints (no token required)
router.get("/public/all", CategoryController.getPublicAll);

// Secured administrative endpoints
router.post("/create", verifyToken, isAdmin, CategoryController.create);
router.get("/all", verifyToken, isAdmin, CategoryController.getAll);
router.put("/update/:id", verifyToken, isAdmin, CategoryController.update);
router.delete("/delete/:id", verifyToken, isAdmin, CategoryController.delete);

module.exports = router;
