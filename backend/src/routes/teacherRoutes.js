const express = require('express');
const router = express.Router();
const multer = require('multer');
const teacherController = require('../controllers/teacherController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/by-email/:email', teacherController.getTeacherProfile);
router.post('/upload-image', upload.single('image'), teacherController.uploadProfileImage);
router.get('/profile-image/:email', teacherController.getProfileImage);
router.get('/students/all', teacherController.getAllStudents);

module.exports = router;
