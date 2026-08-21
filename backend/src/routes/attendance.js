import express from 'express';
import AttendanceService from '../services/AttendanceService.js';
import SubjectEnrollment from '../models/SubjectEnrollment.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

const router = express.Router();

// POST /api/attendance/bulk - Mark bulk attendance
router.post('/bulk', async (req, res) => {
  try {
    const result = await AttendanceService.markBulkAttendance(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/attendance/subject/:subjectId/date/:date - Get attendance by subject and date
router.get('/subject/:subjectId/date/:date', async (req, res) => {
  try {
    const subjectId = parseInt(req.params.subjectId);
    const date = new Date(req.params.date);
    
    const result = await AttendanceService.getAttendanceBySubjectAndDate(subjectId, date);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/attendance/faculty/:email/subjects - Get subjects by faculty
router.get('/faculty/:email/subjects', async (req, res) => {
  try {
    const result = await AttendanceService.getSubjectsByFaculty(req.params.email);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/attendance/subject/:id/students - Get subject with students
router.get('/subject/:id/students', async (req, res) => {
  try {
    const result = await AttendanceService.getSubjectWithStudents(parseInt(req.params.id));
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/attendance/stats/subject/:subjectId - Get subject attendance stats
router.get('/stats/subject/:subjectId', async (req, res) => {
  try {
    const result = await AttendanceService.getSubjectAttendanceStats(parseInt(req.params.subjectId));
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/attendance/student/:email - Get all attendance for student
router.get('/student/:email', async (req, res) => {
  try {
    const result = await AttendanceService.getAllAttendanceForStudent(req.params.email);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/attendance/student/:email/subjects - Get subjects by student
router.get('/student/:email/subjects', async (req, res) => {
  try {
    const result = await AttendanceService.getSubjectsByStudent(req.params.email);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/attendance/student/:email/subject/:subjectId - Get attendance by student and subject
router.get('/student/:email/subject/:subjectId', async (req, res) => {
  try {
    const result = await AttendanceService.getAttendanceByStudentAndSubject(
      req.params.email,
      parseInt(req.params.subjectId)
    );
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;