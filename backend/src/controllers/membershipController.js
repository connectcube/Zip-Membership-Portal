const { getFirestore } = require('../config/firebase');
const { calculateMembershipExpiry, isMembershipActive } = require('../helpers/membershipHelpers');

const getMembershipStatus = async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();
    
    const membershipDoc = await db.collection('memberships').doc(uid).get();
    
    if (!membershipDoc.exists) {
      return res.json({
        success: true,
        membership: {
          status: 'inactive',
          type: null,
          expiresAt: null,
          isActive: false
        }
      });
    }
    
    const membership = membershipDoc.data();
    const isActive = isMembershipActive(membership);
    
    res.json({
      success: true,
      membership: {
        ...membership,
        isActive
      }
    });
  } catch (error) {
    console.error('Get membership status error:', error);
    res.status(500).json({ error: 'Failed to get membership status' });
  }
};

const getAllMemberships = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const db = getFirestore();
    
    let query = db.collection('memberships');
    
    if (status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();
    
    const memberships = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      memberships.push({
        uid: doc.id,
        ...data,
        isActive: isMembershipActive(data)
      });
    });
    
    res.json({
      success: true,
      memberships,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: memberships.length
      }
    });
  } catch (error) {
    console.error('Get all memberships error:', error);
    res.status(500).json({ error: 'Failed to get memberships' });
  }
};

const createMembership = async (req, res) => {
  try {
    const { uid } = req.user;
    const { type, duration, startDate } = req.body;
    
    const db = getFirestore();
    const start = startDate ? new Date(startDate) : new Date();
    const expiresAt = calculateMembershipExpiry(start, duration);
    
    const membershipData = {
      type,
      status: 'active',
      startDate: start,
      expiresAt,
      duration,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('memberships').doc(uid).set(membershipData);
    
    res.json({
      success: true,
      membership: {
        ...membershipData,
        isActive: true
      }
    });
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({ error: 'Failed to create membership' });
  }
};

const updateMembershipStatus = async (req, res) => {
  try {
    const { uid } = req.params;
    const { status } = req.body;
    
    const db = getFirestore();
    
    await db.collection('memberships').doc(uid).update({
      status,
      updatedAt: new Date()
    });
    
    const updatedDoc = await db.collection('memberships').doc(uid).get();
    const membership = updatedDoc.data();
    
    res.json({
      success: true,
      membership: {
        ...membership,
        isActive: isMembershipActive(membership)
      }
    });
  } catch (error) {
    console.error('Update membership status error:', error);
    res.status(500).json({ error: 'Failed to update membership status' });
  }
};

const extendMembership = async (req, res) => {
  try {
    const { uid } = req.params;
    const { months } = req.body;
    
    // Check permissions
    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const db = getFirestore();
    const membershipDoc = await db.collection('memberships').doc(uid).get();
    
    if (!membershipDoc.exists) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    
    const membership = membershipDoc.data();
    const currentExpiry = membership.expiresAt.toDate();
    const newExpiry = new Date(currentExpiry);
    newExpiry.setMonth(newExpiry.getMonth() + months);
    
    await db.collection('memberships').doc(uid).update({
      expiresAt: newExpiry,
      status: 'active',
      updatedAt: new Date()
    });
    
    const updatedDoc = await db.collection('memberships').doc(uid).get();
    const updatedMembership = updatedDoc.data();
    
    res.json({
      success: true,
      membership: {
        ...updatedMembership,
        isActive: isMembershipActive(updatedMembership)
      }
    });
  } catch (error) {
    console.error('Extend membership error:', error);
    res.status(500).json({ error: 'Failed to extend membership' });
  }
};

module.exports = {
  getMembershipStatus,
  getAllMemberships,
  createMembership,
  updateMembershipStatus,
  extendMembership
};