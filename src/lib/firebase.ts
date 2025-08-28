// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIOmHZgAq5rZKkFgPBZS9lCNs7ziYOPc4",
  authDomain: "zip-membership.firebaseapp.com",
  projectId: "zip-membership",
  storageBucket: "zip-membership.firebasestorage.app",
  messagingSenderId: "986797474750",
  appId: "1:986797474750:web:0e46c586397af44f9c2fef",
  measurementId: "G-W8C7MTVEYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireDataBase = getFirestore(app);
const fireStorage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, fireDataBase, fireStorage, analytics };