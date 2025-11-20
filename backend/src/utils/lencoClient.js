const axios = require('axios');

class LencoClient {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.LENCO_BASE_URL 
      : process.env.LENCO_SANDBOX_URL;
    this.secretKey = process.env.LENCO_SECRET_KEY;
    this.publicKey = process.env.LENCO_PUBLIC_KEY;
  }

  async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/access/v2/collections/status/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Lenco API error:', error.response?.data || error.message);
      throw new Error('Payment verification failed');
    }
  }

  getPublicKey() {
    return this.publicKey;
  }

  getWidgetUrl() {
    return process.env.NODE_ENV === 'production'
      ? 'https://pay.lenco.co/js/v1/inline.js'
      : 'https://pay.sandbox.lenco.co/js/v1/inline.js';
  }
}

module.exports = new LencoClient();