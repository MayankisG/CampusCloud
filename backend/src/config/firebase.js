const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '../../firebase-service-account.json');

let app;

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin initialized with service account.');
} else {
  console.warn('firebase-service-account.json not found! Falling back to application default credentials.');
  app = admin.initializeApp();
}

module.exports = {
  admin,
  auth: admin.auth()
};
