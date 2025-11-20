const { getAuth, getFirestore } = require('../config/firebase');
const { getUserProfile } = require('../helpers/userHelpers');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const db = getFirestore();
    
    let query = db.collection('users');
    
    if (search) {
      query = query.where('displayName', '>=', search)
                   .where('displayName', '<=', search + '\uf8ff');
    }
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Check if user can access this profile
    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    
    // Check permissions
    if (req.user.uid !== uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update Firebase Auth
    const authUpdates = {};
    if (updates.displayName) authUpdates.displayName = updates.displayName;
    if (updates.email) authUpdates.email = updates.email;
    if (updates.phoneNumber) authUpdates.phoneNumber = updates.phoneNumber;
    if (updates.disabled !== undefined) authUpdates.disabled = updates.disabled;
    
    if (Object.keys(authUpdates).length > 0) {
      await getAuth().updateUser(uid, authUpdates);
    }
    
    // Update Firestore
    const db = getFirestore();
    await db.collection('users').doc(uid).update({
      ...updates,
      updatedAt: new Date()
    });
    
    const updatedUser = await getUserProfile(uid);
    
    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Delete from Firebase Auth
    await getAuth().deleteUser(uid);
    
    // Delete from Firestore
    const db = getFirestore();
    await db.collection('users').doc(uid).delete();
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};