const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/bulk', attendanceController.markBulkAttendance);
router.get('/subject/:subjectId/date/:date', attendanceController.getAttendanceBySubjectAndDate);
router.get('/faculty/:email/subjects', attendanceController.getSubjectsByFaculty);
router.get('/subject/:id/students', attendanceController.getSubjectWithStudents);
router.get('/stats/subject/:subjectId', attendanceController.getSubjectAttendanceStats);
router.get('/student/:email', attendanceController.getAllAttendanceForStudent);
router.get('/student/:email/subjects', attendanceController.getSubjectsByStudent);
router.get('/student/:email/subject/:subjectId', attendanceController.getAttendanceByStudentAndSubject);

module.exports = router;
