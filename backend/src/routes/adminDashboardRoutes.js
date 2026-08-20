const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { verifyTokenAndCheckAccess } = require('../middleware/auth'); // Optionally use this

router.get('/students/count', adminDashboardController.getStudentCount);
router.get('/faculty/count', adminDashboardController.getTeacherCount);
router.get('/classes/count', adminDashboardController.getClassesCount);

module.exports = router;
