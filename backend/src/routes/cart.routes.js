const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller");
const { verifyToken } = require("../middleware/auth");

// Secure all cart actions
router.use(verifyToken);

router.get("/", CartController.get);
router.post("/add", CartController.add);
router.put("/update/:productId", CartController.update);
router.delete("/remove/:productId", CartController.remove);
router.post("/apply-coupon", CartController.applyCoupon);

module.exports = router;
