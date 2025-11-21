const axios = require('axios');
const crypto = require('crypto');
const { generatePaymentReference } = require('../helpers/paymentHelpers');



const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.LENCO_BASE_URL 
      : process.env.LENCO_SANDBOX_URL;
    
    const response = await axios.get(
      `${baseUrl}/access/v2/collections/status/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LENCO_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const paymentData = response.data.data;
    
    res.json({
      success: true,
      data: {
        status: paymentData.status,
        reference: paymentData.reference,
        lencoReference: paymentData.lencoReference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        fee: paymentData.fee,
        paymentMethod: paymentData.type,
        completedAt: paymentData.completedAt
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-lenco-signature'];
    const payload = JSON.stringify(req.body);
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.LENCO_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Webhook verified - frontend will handle Firebase updates
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};



module.exports = {
  verifyPayment,
  handleWebhook
};