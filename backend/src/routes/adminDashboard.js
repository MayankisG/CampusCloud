import express from 'express';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import SubjectEnrollment from '../models/SubjectEnrollment.js';

const router = express.Router();

// GET /api/AdminDashboard/students/count - Get student count
router.get('/students/count', async (req, res) => {
  try {
    const count = await Student.count();
    return res.json(count);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/AdminDashboard/faculty/count - Get faculty count
router.get('/faculty/count', async (req, res) => {
  try {
    const count = await Faculty.count();
    return res.json(count);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/AdminDashboard/classes/count - Get classes count
router.get('/classes/count', async (req, res) => {
  try {
    const count = await SubjectEnrollment.count();
    return res.json(count);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;