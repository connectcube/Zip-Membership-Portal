const { getAuth, getFirestore } = require('../config/firebase');

const createUserProfile = async (uid, userData) => {
  try {
    const db = getFirestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      // Create new user profile
      const profileData = {
        uid,
        email: userData.email,
        displayName: userData.name || userData.email?.split('@')[0],
        emailVerified: userData.emailVerified || false,
        photoURL: userData.picture || null,
        role: userData.role || 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };
      
      await userRef.set(profileData);
      return profileData;
    } else {
      // Update last login
      await userRef.update({
        lastLoginAt: new Date(),
        updatedAt: new Date()
      });
      
      return userDoc.data();
    }
  } catch (error) {
    console.error('Create user profile error:', error);
    throw error;
  }
};

const getUserProfile = async (uid) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const userData = userDoc.data();
    
    // Get Firebase Auth data for latest info
    try {
      const authUser = await getAuth().getUser(uid);
      return {
        ...userData,
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        disabled: authUser.disabled,
        customClaims: authUser.customClaims || {}
      };
    } catch (authError) {
      // Return Firestore data if Auth fails
      return userData;
    }
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

const updateUserProfile = async (uid, updates) => {
  try {
    const db = getFirestore();
    
    await db.collection('users').doc(uid).update({
      ...updates,
      updatedAt: new Date()
    });
    
    return await getUserProfile(uid);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

const deleteUserProfile = async (uid) => {
  try {
    const db = getFirestore();
    
    // Delete user document
    await db.collection('users').doc(uid).delete();
    
    // Delete related data
    const batch = db.batch();
    
    // Delete membership
    const membershipRef = db.collection('memberships').doc(uid);
    batch.delete(membershipRef);
    
    // Delete user's documents, events, etc.
    const userDocsQuery = await db.collection('documents').where('userId', '==', uid).get();
    userDocsQuery.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    return true;
  } catch (error) {
    console.error('Delete user profile error:', error);
    throw error;
  }
};

const searchUsers = async (searchTerm, limit = 10) => {
  try {
    const db = getFirestore();
    
    const snapshot = await db.collection('users')
      .where('displayName', '>=', searchTerm)
      .where('displayName', '<=', searchTerm + '\uf8ff')
      .limit(limit)
      .get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

module.exports = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  searchUsers
};