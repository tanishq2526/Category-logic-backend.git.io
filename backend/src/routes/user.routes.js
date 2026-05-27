const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Protect all routes with auth middleware and admin check
router.use(verifyToken);
router.use(isAdmin);

// Get user stats
router.get("/stats", UserController.getUserStats);

// Get all users with pagination and filters
router.get("/", UserController.getAllUsers);

// Get user by ID
router.get("/:id", UserController.getUserById);

// Update user
router.put("/:id", UserController.updateUser);

// Block user
router.patch("/:id/block", UserController.blockUser);

// Unblock user
router.patch("/:id/unblock", UserController.unblockUser);

// Add tag to user
router.post("/:id/tags", UserController.addTag);

// Remove tag from user
router.delete("/:id/tags", UserController.removeTag);

// Delete user
router.delete("/:id", UserController.deleteUser);

// Bulk operations
router.post("/bulk/status", UserController.bulkUpdateStatus);
router.post("/bulk/tags", UserController.bulkAddTag);
router.post("/bulk/delete", UserController.bulkDeleteUsers);

module.exports = router;
