const express = require('express');
const router = express.Router();

router.get('/admin/profile', (req, res) => {
  const adminProfile = req.user && req.user.role === 'admin'
    ? {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    : null;

  if (!adminProfile) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated as admin'
    });
  }

  res.json({
    success: true,
    profile: adminProfile
  });
});

module.exports = router;
