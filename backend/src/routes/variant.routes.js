const express = require("express");
const router = express.Router();
const VariantController = require("../controllers/variant.controller");
const upload = require("../middleware/upload");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/create", verifyToken, isAdmin, upload.single("image"), VariantController.create);
router.get("/all", verifyToken, isAdmin, VariantController.getAll);
router.put("/update/:id", verifyToken, isAdmin, upload.single("image"), VariantController.update);
router.delete("/delete/:id", verifyToken, isAdmin, VariantController.delete);

module.exports = router;
