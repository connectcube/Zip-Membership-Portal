const calculateMembershipExpiry = (startDate, durationMonths) => {
  const expiryDate = new Date(startDate);
  expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
  return expiryDate;
};

const createMembership = async (uid, membershipData) => {
  const { getFirestore } = require('../config/firebase');
  const db = getFirestore();
  
  const { type, duration, paymentReference } = membershipData;
  const startDate = new Date();
  const expiresAt = calculateMembershipExpiry(startDate, duration);
  
  const membership = {
    type,
    status: 'active',
    startDate,
    expiresAt,
    duration,
    paymentReference,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await db.collection('memberships').doc(uid).set(membership);
  return membership;
};

const isMembershipActive = (membership) => {
  if (!membership || membership.status !== 'active') {
    return false;
  }
  
  const now = new Date();
  const expiryDate = membership.expiresAt.toDate ? membership.expiresAt.toDate() : new Date(membership.expiresAt);
  
  return now < expiryDate;
};

const getMembershipDaysRemaining = (membership) => {
  if (!membership || !isMembershipActive(membership)) {
    return 0;
  }
  
  const now = new Date();
  const expiryDate = membership.expiresAt.toDate ? membership.expiresAt.toDate() : new Date(membership.expiresAt);
  const diffTime = expiryDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

const getMembershipType = (type) => {
  const types = {
    basic: {
      name: 'Basic',
      features: ['Access to basic content', 'Community forum'],
      price: 9.99
    },
    premium: {
      name: 'Premium',
      features: ['All basic features', 'Premium content', 'Priority support'],
      price: 19.99
    },
    enterprise: {
      name: 'Enterprise',
      features: ['All premium features', 'Custom integrations', 'Dedicated support'],
      price: 49.99
    }
  };
  
  return types[type] || types.basic;
};

const canAccessFeature = (membership, feature) => {
  if (!membership || !isMembershipActive(membership)) {
    return false;
  }
  
  const membershipType = getMembershipType(membership.type);
  return membershipType.features.includes(feature);
};

const getMembershipStats = (memberships) => {
  const stats = {
    total: memberships.length,
    active: 0,
    expired: 0,
    byType: {
      basic: 0,
      premium: 0,
      enterprise: 0
    }
  };
  
  memberships.forEach(membership => {
    if (isMembershipActive(membership)) {
      stats.active++;
    } else {
      stats.expired++;
    }
    
    if (membership.type && stats.byType.hasOwnProperty(membership.type)) {
      stats.byType[membership.type]++;
    }
  });
  
  return stats;
};

const generateMembershipId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `MEM-${timestamp}-${randomStr}`.toUpperCase();
};

module.exports = {
  calculateMembershipExpiry,
  createMembership,
  isMembershipActive,
  getMembershipDaysRemaining,
  getMembershipType,
  canAccessFeature,
  getMembershipStats,
  generateMembershipId
};