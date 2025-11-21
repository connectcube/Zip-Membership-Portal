const { getAuth, getFirestore, Timestamp } = require('../config/firebase');

const createUserProfile = async (uid, userData) => {
  try {
    const db = getFirestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create new user profile with complete structure
      const profileData = {
        authRef: userRef,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        middleName: userData.middleName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        password: userData.password || userData.email,
        province: userData.province || '',
        town: userData.town || '',
        dateJoined: userData.dateJoined || new Date().toISOString().split('T')[0],
        createdAt: Timestamp.now(),
        documents: userData.documents || {},
        membershipInfo: userData.membershipInfo || {
          membershipType: 'pending',
          specialization: '',
          bio: '',
          membershipNumber: ''
        },
        professionalInfo: userData.professionalInfo || {
          qualification: '',
          institution: '',
          graduationYear: '',
          experience: '',
          currentEmployer: '',
          jobTitle: '',
          specialization: ''
        }
      };

      await userRef.set(profileData);
      return profileData;
    } else {
      return userDoc.data();
    }
  } catch (error) {
    console.error('Create user profile error:', error);
    throw error;
  }
};

const getUserProfile = async uid => {
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
        customClaims: authUser.customClaims || {},
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
    const userRef = db.collection('users').doc(uid);

    // Handle nested updates properly
    const updateData = { ...updates };
    
    // If updating nested objects, use dot notation
    if (updates.membershipInfo) {
      Object.keys(updates.membershipInfo).forEach(key => {
        updateData[`membershipInfo.${key}`] = updates.membershipInfo[key];
      });
      delete updateData.membershipInfo;
    }
    
    if (updates.professionalInfo) {
      Object.keys(updates.professionalInfo).forEach(key => {
        updateData[`professionalInfo.${key}`] = updates.professionalInfo[key];
      });
      delete updateData.professionalInfo;
    }
    
    if (updates.documents) {
      Object.keys(updates.documents).forEach(key => {
        updateData[`documents.${key}`] = updates.documents[key];
      });
      delete updateData.documents;
    }

    await userRef.update(updateData);
    return await getUserProfile(uid);
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

const deleteUserProfile = async uid => {
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

    // Search by firstName, lastName, or email
    const queries = [
      db.collection('users').where('firstName', '>=', searchTerm.toUpperCase()).where('firstName', '<=', searchTerm.toUpperCase() + '\uf8ff').limit(limit),
      db.collection('users').where('lastName', '>=', searchTerm.toUpperCase()).where('lastName', '<=', searchTerm.toUpperCase() + '\uf8ff').limit(limit),
      db.collection('users').where('email', '>=', searchTerm.toLowerCase()).where('email', '<=', searchTerm.toLowerCase() + '\uf8ff').limit(limit)
    ];

    const results = await Promise.all(queries.map(query => query.get()));
    const users = new Map();

    results.forEach(snapshot => {
      snapshot.forEach(doc => {
        users.set(doc.id, { id: doc.id, ...doc.data() });
      });
    });

    return Array.from(users.values()).slice(0, limit);
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};

// Generate membership number
const generateMembershipNumber = async (membershipType, province) => {
  try {
    const db = getFirestore();
    const year = new Date().getFullYear();
    const prefix = membershipType === 'full' ? 'MZIP' : 'AZIP';
    
    // Get count of existing members for this year
    const snapshot = await db.collection('users')
      .where('membershipInfo.membershipNumber', '>=', `${prefix}${year}`)
      .where('membershipInfo.membershipNumber', '<', `${prefix}${year + 1}`)
      .get();
    
    const count = snapshot.size + 1;
    return `${prefix}${year}${count.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Generate membership number error:', error);
    throw error;
  }
};

module.exports = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  searchUsers,
  generateMembershipNumber,
};
