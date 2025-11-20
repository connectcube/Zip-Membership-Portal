const express = require('express');
const { body, param } = require('express-validator');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// Get all users (admin only)
router.get('/', 
  verifyToken, 
  requireRole(['admin']), 
  userController.getAllUsers
);

// Get user by ID
router.get('/:uid',
  verifyToken,
  [param('uid').isLength({ min: 1 })],
  handleValidationErrors,
  userController.getUserById
);

// Update user (admin or self)
router.put('/:uid',
  verifyToken,
  [
    param('uid').isLength({ min: 1 }),
    body('displayName').optional().isLength({ min: 1 }).trim(),
    body('email').optional().isEmail(),
    body('phoneNumber').optional().isMobilePhone(),
    body('disabled').optional().isBoolean(),
  ],
  handleValidationErrors,
  userController.updateUser
);

// Delete user (admin only)
router.delete('/:uid',
  verifyToken,
  requireRole(['admin']),
  [param('uid').isLength({ min: 1 })],
  handleValidationErrors,
  userController.deleteUser
);

module.exports = router;