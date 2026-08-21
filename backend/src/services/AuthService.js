import { firebaseAuth } from '../config/firebase.js';
import User from '../models/User.js';

class AuthService {
  async verifyTokenAndGetUser(idToken) {
    try {
      if (!firebaseAuth) {
        throw new Error('Firebase not initialized');
      }
      
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      
      const user = await User.findOne({ where: { firebaseUid: uid } });
      return user || null;
    } catch (error) {
      throw new Error('Invalid Firebase ID token');
    }
  }

  async verifyTokenAndCheckAccess(idToken, requestedFirebaseUid) {
    try {
      if (!firebaseAuth) {
        throw new Error('Firebase not initialized');
      }
      
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const tokenFirebaseUid = decodedToken.uid;

      const user = await User.findOne({ where: { firebaseUid: tokenFirebaseUid } });
      if (!user) {
        throw new Error('User not found in database');
      }

      if (user.firebaseUid !== requestedFirebaseUid) {
        throw new Error('Access denied: You can only access your own data');
      }

      return user;
    } catch (error) {
      throw new Error(`Access verification failed: ${error.message}`);
    }
  }
}

export default new AuthService();