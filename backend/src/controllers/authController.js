const { auth } = require('../config/firebase');
const prisma = require('../config/prisma');

const login = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ status: 'error', message: 'idToken is required' });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid }
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found in database' });
    }

    let redirectUrl = '';
    switch (user.role.toLowerCase()) {
      case 'admin':
        redirectUrl = '/admin/dashboard';
        break;
      case 'student':
        redirectUrl = '/student/dashboard';
        break;
      case 'faculty':
        redirectUrl = '/teacher/dashboard';
        break;
      default:
        return res.status(400).json({ status: 'error', message: 'Unknown user role' });
    }

    return res.status(200).json({
      status: 'success',
      name: user.name,
      email: user.email,
      firebaseUid: user.firebaseUid,
      role: user.role,
      userUnivId: user.univId,
      idToken: idToken,
      redirectUrl: redirectUrl
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({
      status: 'error',
      message: error.message || 'Authentication failed'
    });
  }
};

module.exports = {
  login
};
