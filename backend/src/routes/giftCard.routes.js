const express = require("express");
const router = express.Router();
const GiftCardController = require("../controllers/giftCard.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.use(verifyToken, isAdmin);

router.post("/create", GiftCardController.create);
router.get("/list", GiftCardController.getAll);
router.get("/single/:id", GiftCardController.getSingle);
router.put("/update/:id", GiftCardController.update);
router.delete("/delete/:id", GiftCardController.delete);

module.exports = router;
