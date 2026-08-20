const express = require('express');
const router = express.Router();
const subjectEnrollmentController = require('../controllers/subjectEnrollmentController');
const { verifyToken } = require('../middleware/auth'); // Optionally protect routes

router.get('/', subjectEnrollmentController.getAllEnrollments);
router.post('/create-for-all', subjectEnrollmentController.createEnrollmentForAllStudents);
router.get('/faculty', subjectEnrollmentController.getSubjectsByFaculty);
router.get('/:subjectId', subjectEnrollmentController.getEnrollmentById);

module.exports = router;
