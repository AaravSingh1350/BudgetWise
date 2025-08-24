import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "budgetwise-f7166",
  "appId": "1:223510455912:web:65ddea621d99b1de5f7ddd",
  "storageBucket": "budgetwise-f7166.appspot.com",
  "apiKey": "AIzaSyDhSHNa3w8uLJ6hkIYlfEWKDgjWE7ZrluE",
  "authDomain": "budgetwise-f7166.firebaseapp.com",
  "messagingSenderId": "223510455912",
  "measurementId": "G-11V6221W4G"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
