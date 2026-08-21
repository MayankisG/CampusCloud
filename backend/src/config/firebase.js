import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    });
  } else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } else {
    console.warn('Firebase configuration not found. Firebase authentication will not work.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}

export const firebaseAuth = firebaseApp ? admin.auth() : null;
export default firebaseApp;