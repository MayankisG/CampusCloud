import express from 'express';
import multer from 'multer';
import { Op } from 'sequelize';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import SubjectEnrollment from '../models/SubjectEnrollment.js';
import Faculty from '../models/Faculty.js';
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

// GET /api/students/by-email/:email - Get student profile
router.get('/by-email/:email', verifyAuth, async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await Student.findOne({ where: { email: req.params.email } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    return res.json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:email/subjects - Get student subjects
router.get('/:email/subjects', verifyAuth, async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await Student.findOne({ where: { email: req.params.email } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const subjects = await student.getEnrolledSubjects({
      include: [{ model: Faculty, as: 'faculty' }]
    });

    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:email/attendance-summary - Get attendance summary
router.get('/:email/attendance-summary', verifyAuth, async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const student = await Student.findOne({ where: { email: req.params.email } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const subjects = await student.getEnrolledSubjects({
      include: [{ model: Faculty, as: 'faculty' }]
    });

    const attendanceSummary = [];
    for (const subject of subjects) {
      const records = await Attendance.findAll({
        where: {
          student_email: req.params.email,
          subject_id: subject.id,
          date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      const totalClasses = [...new Set(records.map(r => r.date.toISOString().split('T')[0]))].length;
      const presentCount = records.filter(r => r.present).length;
      const percentage = totalClasses > 0 ? Math.round((presentCount * 100.0 / totalClasses) * 100) / 100.0 : 0.0;

      attendanceSummary.push({
        subjectName: `${subject.subjectName}(${subject.credits})`,
        subjectCode: subject.subjectCode,
        faculty: subject.faculty?.name,
        totalLectures: totalClasses,
        totalPresent: presentCount,
        percentage
      });
    }

    const overallPercentage = attendanceSummary.length > 0
      ? Math.round(attendanceSummary.reduce((sum, s) => sum + s.percentage, 0) / attendanceSummary.length * 100) / 100.0
      : 0.0;

    return res.json({
      startDate,
      endDate,
      overallPercentage,
      subjects: attendanceSummary
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:email/attendance/:subjectId - Get subject attendance for student
router.get('/:email/attendance/:subjectId', verifyAuth, async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const subject = await SubjectEnrollment.findByPk(req.params.subjectId, {
      include: [{ model: Student, as: 'enrolledStudents', through: { attributes: [] } }]
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const isEnrolled = subject.enrolledStudents.some(s => s.email.toLowerCase() === req.params.email.toLowerCase());
    if (!isEnrolled) {
      return res.status(403).json({ error: 'Student is not enrolled in this subject' });
    }

    const records = await Attendance.findAll({
      where: {
        student_email: req.params.email,
        subject_id: req.params.subjectId
      },
      order: [['date', 'DESC']]
    });

    return res.json(records);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/students/upload-image - Upload student profile image
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

    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.stuImage = req.file.buffer;
    await student.save();

    return res.json({
      message: 'Image uploaded successfully',
      email,
      imageSize: student.stuImage.length
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/students/profile-image/:email - Get student profile image
router.get('/profile-image/:email', verifyAuth, async (req, res) => {
  try {
    if (req.user.email.toLowerCase() !== req.params.email.toLowerCase()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await Student.findOne({ where: { email: req.params.email } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!student.stuImage) {
      return res.status(404).json({ error: 'No profile image found' });
    }

    res.set('Content-Type', 'image/jpeg');
    return res.send(student.stuImage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;