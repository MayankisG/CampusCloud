import express from 'express';
import SubjectEnrollmentService from '../services/SubjectEnrollmentService.js';
import { firebaseAuth } from '../config/firebase.js';

const router = express.Router();

// Middleware to extract email from Firebase token
const extractEmailFromToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header required');
  }

  const token = authHeader.replace('Bearer ', '');
  if (!firebaseAuth) {
    throw new Error('Firebase not initialized');
  }

  const decodedToken = await firebaseAuth.verifyIdToken(token);
  return decodedToken.email;
};

// GET /api/enrollments - Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await SubjectEnrollmentService.getAllEnrollments();
    return res.json(enrollments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/enrollments/create-for-all - Create enrollment for all students
router.post('/create-for-all', async (req, res) => {
  try {
    const { subjectName, subjectCode, credits, emailId } = req.body;

    if (!subjectName || !subjectName.trim()) {
      return res.status(400).json({ error: 'Subject name is required' });
    }
    if (!subjectCode || !subjectCode.trim()) {
      return res.status(400).json({ error: 'Subject code is required' });
    }
    if (!emailId || !emailId.trim()) {
      return res.status(400).json({ error: 'Faculty email ID is required' });
    }

    const enrollment = await SubjectEnrollmentService.createEnrollmentForAllStudents(req.body);
    return res.json(enrollment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/enrollments/faculty - Get subjects by faculty (from token)
router.get('/faculty', async (req, res) => {
  try {
    const facultyEmail = await extractEmailFromToken(req.headers.authorization);
    const subjects = await SubjectEnrollmentService.getSubjectsByFaculty(facultyEmail);
    return res.json(subjects);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/enrollments/:subjectId - Get enrollment by ID
router.get('/:subjectId', async (req, res) => {
  try {
    const enrollment = await SubjectEnrollmentService.getEnrollmentById(parseInt(req.params.subjectId));
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    return res.json(enrollment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;