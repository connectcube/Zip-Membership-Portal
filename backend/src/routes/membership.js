const express = require('express');
const { body, param } = require('express-validator');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const membershipController = require('../controllers/membershipController');

const router = express.Router();

// Get user's membership status
router.get('/status', verifyToken, membershipController.getMembershipStatus);

// Get all memberships (admin only)
router.get('/', 
  verifyToken, 
  requireRole(['admin']), 
  membershipController.getAllMemberships
);

// Create/Update membership
router.post('/',
  verifyToken,
  [
    body('type').isIn(['basic', 'premium', 'enterprise']),
    body('duration').isInt({ min: 1, max: 12 }),
    body('startDate').optional().isISO8601(),
  ],
  handleValidationErrors,
  membershipController.createMembership
);

// Update membership status (admin only)
router.put('/:uid/status',
  verifyToken,
  requireRole(['admin']),
  [
    param('uid').isLength({ min: 1 }),
    body('status').isIn(['active', 'inactive', 'suspended', 'expired']),
  ],
  handleValidationErrors,
  membershipController.updateMembershipStatus
);

// Extend membership
router.post('/:uid/extend',
  verifyToken,
  [
    param('uid').isLength({ min: 1 }),
    body('months').isInt({ min: 1, max: 12 }),
  ],
  handleValidationErrors,
  membershipController.extendMembership
);

module.exports = router;