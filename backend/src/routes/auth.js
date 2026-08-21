import express from 'express';
import multer from 'multer';
import AuthService from '../services/AuthService.js';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ status: 'error', message: 'ID token is required' });
    }

    const user = await AuthService.verifyTokenAndGetUser(idToken);
    
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found in database' });
    }

    const response = {
      status: 'success',
      name: user.name,
      email: user.email,
      firebaseUid: user.firebaseUid,
      role: user.role,
      userUnivId: user.univId,
      idToken: idToken
    };

    // Determine redirect URL based on role
    const redirectUrl = {
      'admin': '/admin/dashboard',
      'student': '/student/dashboard',
      'faculty': '/teacher/dashboard'
    }[user.role.toLowerCase()] || '/';

    response.redirectUrl = redirectUrl;

    return res.json(response);
  } catch (error) {
    return res.status(401).json({ status: 'error', message: error.message });
  }
});

export default router;