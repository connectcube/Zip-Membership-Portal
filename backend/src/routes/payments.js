const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Initialize payment
router.post('/initialize',
  verifyToken,
  [
    body('amount').isFloat({ min: 0.01 }),
    body('membershipType').isIn(['basic', 'premium', 'enterprise']),
    body('duration').isInt({ min: 1, max: 12 }),
    body('currency').optional().isLength({ min: 3, max: 3 })
  ],
  handleValidationErrors,
  paymentController.initializePayment
);

// Verify payment
router.get('/verify/:reference',
  verifyToken,
  paymentController.verifyPayment
);

// Webhook endpoint (no auth required)
router.post('/webhook',
  paymentController.handleWebhook
);



module.exports = router;