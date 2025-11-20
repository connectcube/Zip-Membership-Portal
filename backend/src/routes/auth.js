const express = require('express');
const { body } = require('express-validator');
const { verifyToken, optionalAuth } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

// Verify token endpoint
router.post('/verify', verifyToken, authController.verifyUser);

// Get current user profile
router.get('/me', verifyToken, authController.getCurrentUser);

// Update user profile
router.put('/profile', 
  verifyToken,
  [
    body('displayName').optional().isLength({ min: 1 }).trim(),
    body('phoneNumber').optional().isMobilePhone(),
  ],
  handleValidationErrors,
  authController.updateProfile
);

// Set user role (admin only)
router.put('/role/:uid',
  verifyToken,
  [
    body('role').isIn(['user', 'admin', 'moderator']),
  ],
  handleValidationErrors,
  authController.setUserRole
);

// Refresh custom claims
router.post('/refresh-claims', verifyToken, authController.refreshClaims);

module.exports = router;