const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/coupon.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/apply", verifyToken, CouponController.apply);

// Administrative coupon management
router.use(verifyToken, isAdmin);

router.post("/create", CouponController.create);
router.get("/", CouponController.getAll);
router.get("/products/search", CouponController.search);
router.get("/:id", CouponController.getSingle);
router.put("/update/:id", CouponController.update);
router.delete("/delete/:id", CouponController.delete);

module.exports = router;
