const { getAuth, getFirestore } = require('../config/firebase');
const { createUserProfile, getUserProfile } = require('../helpers/userHelpers');

const verifyUser = async (req, res) => {
  try {
    const { uid } = req.user;
    
    // Get or create user profile
    const userProfile = await createUserProfile(uid, req.user);
    
    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { uid } = req.user;
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const updates = req.body;
    
    // Update Firebase Auth profile
    const updateData = {};
    if (updates.displayName) updateData.displayName = updates.displayName;
    if (updates.phoneNumber) updateData.phoneNumber = updates.phoneNumber;
    
    if (Object.keys(updateData).length > 0) {
      await getAuth().updateUser(uid, updateData);
    }
    
    // Update Firestore profile
    const db = getFirestore();
    await db.collection('users').doc(uid).update({
      ...updates,
      updatedAt: new Date()
    });
    
    const updatedProfile = await getUserProfile(uid);
    
    res.json({
      success: true,
      user: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const setUserRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;
    
    // Only admin can set roles
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // Set custom claims
    await getAuth().setCustomUserClaims(uid, { role });
    
    // Update Firestore
    const db = getFirestore();
    await db.collection('users').doc(uid).update({
      role,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    console.error('Set user role error:', error);
    res.status(500).json({ error: 'Failed to set user role' });
  }
};

const refreshClaims = async (req, res) => {
  try {
    const { uid } = req.user;
    
    // Get updated user record
    const userRecord = await getAuth().getUser(uid);
    
    res.json({
      success: true,
      customClaims: userRecord.customClaims || {}
    });
  } catch (error) {
    console.error('Refresh claims error:', error);
    res.status(500).json({ error: 'Failed to refresh claims' });
  }
};

module.exports = {
  verifyUser,
  getCurrentUser,
  updateProfile,
  setUserRole,
  refreshClaims
};