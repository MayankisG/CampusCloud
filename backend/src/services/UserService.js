import { firebaseAuth } from '../config/firebase.js';
import User from '../models/User.js';

class UserService {
  async createUser(email, password, name, role, univId) {
    try {
      if (!firebaseAuth) {
        throw new Error('Firebase not initialized');
      }

      // Check if user already exists in Firebase
      try {
        const existingFirebaseUser = await firebaseAuth.getUserByEmail(email);
        await firebaseAuth.deleteUser(existingFirebaseUser.uid);
        await User.destroy({ where: { email } });
      } catch (error) {
        // User doesn't exist in Firebase, which is fine
        if (error.code !== 'auth/user-not-found') {
          console.log('Firebase user check:', error.message);
        }
      }

      // Create user in Firebase
      const userRecord = await firebaseAuth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: true
      });

      // Create user in database
      const user = await User.create({
        firebaseUid: userRecord.uid,
        email,
        name,
        role,
        univId
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}

export default new UserService();