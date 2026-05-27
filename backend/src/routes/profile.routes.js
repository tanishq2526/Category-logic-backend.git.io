const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profile.controller");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/admin/profile", ProfileController.getAdmin);
router.put("/admin/profile", upload.single("profileImage"), ProfileController.updateAdmin);

module.exports = router;
