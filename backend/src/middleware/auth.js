const { auth } = require('../config/firebase');
const prisma = require('../config/prisma');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    req.user = user;
    req.firebaseUid = uid;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const verifyTokenAndCheckAccess = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Example: verify if the requested resource matches the user's email/id
    // This will typically be handled in the controller by comparing req.user
    req.user = user;
    req.firebaseUid = uid;
    next();
  } catch (error) {
    console.error('Access verification failed:', error);
    return res.status(401).json({ message: 'Unauthorized: ' + error.message });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndCheckAccess
};
