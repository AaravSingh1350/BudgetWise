import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDhSHNa3w8uLJ6hkIYlfEWKDgjWE7ZrluE",
  authDomain: "budgetwise-f7166.firebaseapp.com",
  projectId: "budgetwise-f7166",
  storageBucket: "budgetwise-f7166.appspot.com",
  messagingSenderId: "223510455912",
  appId: "1:223510455912:web:65ddea621d99b1de5f7ddd",
  measurementId: "G-93Z033471L"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
