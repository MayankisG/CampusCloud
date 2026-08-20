const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentController = require('../controllers/studentController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/by-email/:email', studentController.getStudentProfile);
router.get('/:email/subjects', studentController.getStudentSubjects);
router.get('/:email/attendance-summary', studentController.getAttendanceSummary);
router.get('/:email/attendance/:subjectId', studentController.getSubjectAttendance);
router.post('/upload-image', upload.single('image'), studentController.uploadProfileImage);
router.get('/profile-image/:email', studentController.getProfileImage);

module.exports = router;
