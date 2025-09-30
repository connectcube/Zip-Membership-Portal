// firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAIOmHZgAq5rZKkFgPBZS9lCNs7ziYOPc4',
  authDomain: 'zip-membership.firebaseapp.com',
  projectId: 'zip-membership',
  storageBucket: 'zip-membership.firebasestorage.app',
  messagingSenderId: '986797474750',
  appId: '1:986797474750:web:0e46c586397af44f9c2fef',
  measurementId: 'G-W8C7MTVEYN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

// 🔹 Persist auth across refreshes/tabs
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error('Auth persistence error:', err);
});

const fireDataBase = getFirestore(app);
const fireStorage = getStorage(app);

export { auth, fireDataBase, fireStorage, analytics };
