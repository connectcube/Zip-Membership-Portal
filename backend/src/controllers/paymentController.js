const axios = require('axios');
const crypto = require('crypto');
const { getFirestore } = require('../config/firebase');
const { generatePaymentReference } = require('../helpers/paymentHelpers');
const { createMembership } = require('../helpers/membershipHelpers');

const initializePayment = async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    const { amount, membershipType, duration, currency = 'ZMW' } = req.body;
    
    const reference = generatePaymentReference();
    const db = getFirestore();
    
    // Store payment intent
    await db.collection('payments').doc(reference).set({
      uid,
      email,
      amount: parseFloat(amount),
      currency,
      membershipType,
      duration,
      reference,
      status: 'pending',
      createdAt: new Date()
    });
    
    res.json({
      success: true,
      data: {
        reference,
        amount: parseFloat(amount),
        currency,
        publicKey: process.env.LENCO_PUBLIC_KEY,
        email,
        customerName: name || email.split('@')[0]
      }
    });
  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const { uid } = req.user;
    
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
    const db = getFirestore();
    
    // Update payment record
    await db.collection('payments').doc(reference).update({
      lencoReference: paymentData.lencoReference,
      status: paymentData.status,
      completedAt: paymentData.completedAt ? new Date(paymentData.completedAt) : null,
      fee: paymentData.fee,
      paymentMethod: paymentData.type,
      updatedAt: new Date()
    });
    
    // If payment successful, create/update membership
    if (paymentData.status === 'successful') {
      const paymentDoc = await db.collection('payments').doc(reference).get();
      const payment = paymentDoc.data();
      
      if (payment.uid === uid) {
        await createMembership(uid, {
          type: payment.membershipType,
          duration: payment.duration,
          paymentReference: reference
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        status: paymentData.status,
        reference: paymentData.reference,
        amount: paymentData.amount,
        currency: paymentData.currency
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
    
    const { event, data } = req.body;
    
    if (event === 'collection.successful') {
      const db = getFirestore();
      const reference = data.reference;
      
      // Update payment status
      await db.collection('payments').doc(reference).update({
        status: 'successful',
        lencoReference: data.lencoReference,
        completedAt: new Date(data.completedAt),
        fee: data.fee,
        paymentMethod: data.type,
        updatedAt: new Date()
      });
      
      // Get payment details and create membership
      const paymentDoc = await db.collection('payments').doc(reference).get();
      if (paymentDoc.exists) {
        const payment = paymentDoc.data();
        
        await createMembership(payment.uid, {
          type: payment.membershipType,
          duration: payment.duration,
          paymentReference: reference
        });
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const { uid } = req.user;
    const { page = 1, limit = 10 } = req.query;
    
    const db = getFirestore();
    const snapshot = await db.collection('payments')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();
    
    const payments = [];
    snapshot.forEach(doc => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: payments.length
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
  getPaymentHistory
};