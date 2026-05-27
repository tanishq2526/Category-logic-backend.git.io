const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller");
const upload = require("../middleware/upload");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Configure Multer to accept 5 distinct files
const cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

// Public endpoints (no token required)
router.get("/public/all", ProductController.getPublicAll);
router.get("/public/:id", ProductController.getSingle);

// Secured administrative endpoints
router.post("/create", verifyToken, isAdmin, cpUpload, ProductController.create);
router.get("/all", verifyToken, isAdmin, ProductController.getAll);
router.put("/update/:id", verifyToken, isAdmin, cpUpload, ProductController.update);
router.delete("/delete/:id", verifyToken, isAdmin, ProductController.delete);

module.exports = router;
