import express from 'express';
import multer from 'multer';
import { Op } from 'sequelize';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import SubjectEnrollment from '../models/SubjectEnrollment.js';
import Attendance from '../models/Attendance.js';
import AuthService from '../services/AuthService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to verify auth token
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await AuthService.verifyTokenAndGetUser(token);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// GET /api/faculty/by-email/:email - Get teacher profile
router.get('/by-email/:email', verifyAuth, async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const teacher = await Faculty.findOne({ where: { email: req.params.email } });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    return res.json(teacher);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/faculty/upload-image - Upload teacher profile image
router.post('/upload-image', upload.single('image'), verifyAuth, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (req.user.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image file' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size must be less than 2MB' });
    }

    const teacher = await Faculty.findOne({ where: { email } });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    teacher.image = req.file.buffer;
    await teacher.save();

    return res.json({
      message: 'Image uploaded successfully',
      email,
      imageSize: teacher.image.length
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/faculty/profile-image/:email - Get teacher profile image
router.get('/profile-image/:email', verifyAuth, async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const teacher = await Faculty.findOne({ where: { email: req.params.email } });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (!teacher.image) {
      return res.status(404).json({ error: 'No profile image found' });
    }

    res.set('Content-Type', 'image/jpeg');
    return res.send(teacher.image);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/faculty/students/all - Get all students
router.get('/students/all', verifyAuth, async (req, res) => {
  try {
    const students = await Student.findAll();
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;