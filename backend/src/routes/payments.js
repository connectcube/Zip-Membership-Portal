const express = require('express');
const { body } = require('express-validator');
const { verifyToken } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const paymentController = require('../controllers/paymentController');

const router = express.Router();



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