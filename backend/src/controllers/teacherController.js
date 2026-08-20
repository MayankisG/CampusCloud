const prisma = require('../config/prisma');
const { auth } = require('../config/firebase');

const getTeacherProfile = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Auth Check
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    const teacher = await prisma.faculty.findUnique({ where: { email } });
    if (!teacher) return res.status(404).json("Teacher not found");

    res.status(200).json(teacher);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    if (!file) return res.status(400).json("Please select an image file");
    if (!file.mimetype.startsWith('image/')) return res.status(400).json("Only image files are allowed");
    if (file.size > 2 * 1024 * 1024) return res.status(400).json("Image size must be less than 2MB");

    await prisma.faculty.update({
      where: { email },
      data: { image: file.buffer }
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      email: email,
      imageSize: file.size
    });
  } catch (error) {
    res.status(500).json("Error uploading image: " + error.message);
  }
};

const getProfileImage = async (req, res) => {
  try {
    const { email } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    const teacher = await prisma.faculty.findUnique({ where: { email } });
    if (!teacher || !teacher.image) {
      return res.status(404).json("No profile image found");
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(teacher.image);
  } catch (error) {
    res.status(500).json("Error retrieving image: " + error.message);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    await auth.verifyIdToken(token); // Just verify it's a valid token

    const students = await prisma.student.findMany();
    res.status(200).json(students || []);
  } catch (error) {
    res.status(200).json([]);
  }
};

module.exports = {
  getTeacherProfile,
  uploadProfileImage,
  getProfileImage,
  getAllStudents
};
