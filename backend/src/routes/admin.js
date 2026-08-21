import express from 'express';
import multer from 'multer';
import AdminService from '../services/AdminService.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/uploadStudentDetails - Bulk upload students from CSV
router.post('/uploadStudentDetails', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const count = await AdminService.uploadDetailsOfStudentsBulk(req.file);
    return res.json({ count, message: `${count} students uploaded successfully` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/uploadStudent - Upload single student
router.post('/uploadStudent', async (req, res) => {
  try {
    const studentData = req.body;
    
    if (!studentData.name || !studentData.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const student = await AdminService.uploadStudentDetail(studentData);
    return res.status(201).json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/uploadFaculty - Upload single faculty
router.post('/uploadFaculty', async (req, res) => {
  try {
    const facultyData = req.body;
    const faculty = await AdminService.uploadFacultyDetail(facultyData);
    return res.status(201).json(faculty);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/student/:rollNo - Get student by roll number
router.get('/student/:rollNo', async (req, res) => {
  try {
    const student = await AdminService.getStudentByRollNo(req.params.rollNo);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    return res.json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/student/:rollNo - Update student
router.put('/student/:rollNo', async (req, res) => {
  try {
    const student = await AdminService.updateStudent(req.params.rollNo, req.body);
    return res.json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/student/:rollNo - Delete student
router.delete('/student/:rollNo', async (req, res) => {
  try {
    const result = await AdminService.deleteStudent(req.params.rollNo);
    if (!result) {
      return res.status(404).json({ error: 'Student not found' });
    }
    return res.json({ message: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/faculty/:emailId - Get faculty by univId
router.get('/faculty/:emailId', async (req, res) => {
  try {
    const faculty = await AdminService.getFacultyByUnivId(req.params.emailId);
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    return res.json(faculty);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/faculty/:emailId - Update faculty
router.put('/faculty/:emailId', async (req, res) => {
  try {
    const faculty = await AdminService.updateFaculty(req.params.emailId, req.body);
    return res.json(faculty);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/faculty/:emailId - Delete faculty
router.delete('/faculty/:emailId', async (req, res) => {
  try {
    const result = await AdminService.deleteFaculty(req.params.emailId);
    if (!result) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    return res.json({ message: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;