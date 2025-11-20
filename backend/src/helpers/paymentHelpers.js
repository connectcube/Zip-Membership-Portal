const generatePaymentReference = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `zip-${timestamp}-${randomStr}`;
};

const getMembershipPricing = () => {
  return {
    basic: {
      monthly: 9.99,
      quarterly: 27.99,
      yearly: 99.99
    },
    premium: {
      monthly: 19.99,
      quarterly: 54.99,
      yearly: 199.99
    },
    enterprise: {
      monthly: 49.99,
      quarterly: 134.99,
      yearly: 499.99
    }
  };
};

const calculateAmount = (membershipType, duration) => {
  const pricing = getMembershipPricing();
  const typePricing = pricing[membershipType];
  
  if (!typePricing) {
    throw new Error('Invalid membership type');
  }
  
  if (duration === 1) return typePricing.monthly;
  if (duration === 3) return typePricing.quarterly;
  if (duration === 12) return typePricing.yearly;
  
  // For other durations, calculate based on monthly rate
  return typePricing.monthly * duration;
};

const validatePaymentAmount = (membershipType, duration, amount) => {
  const expectedAmount = calculateAmount(membershipType, duration);
  return Math.abs(expectedAmount - amount) < 0.01; // Allow for small floating point differences
};

const getPaymentStatus = (lencoStatus) => {
  const statusMap = {
    'successful': 'completed',
    'failed': 'failed',
    'pending': 'pending',
    'cancelled': 'cancelled'
  };
  
  return statusMap[lencoStatus] || 'unknown';
};

const formatPaymentForResponse = (payment) => {
  return {
    id: payment.reference,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    membershipType: payment.membershipType,
    duration: payment.duration,
    paymentMethod: payment.paymentMethod,
    createdAt: payment.createdAt,
    completedAt: payment.completedAt
  };
};

module.exports = {
  generatePaymentReference,
  getMembershipPricing,
  calculateAmount,
  validatePaymentAmount,
  getPaymentStatus,
  formatPaymentForResponse
};