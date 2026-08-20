const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/uploadStudentDetails', upload.single('file'), adminController.uploadDetailsOfStudentsBulk);
router.post('/uploadStudent', adminController.uploadStudentDetail);
router.post('/uploadFaculty', adminController.uploadFacultyDetail);

router.get('/student/:rollNo', adminController.getStudentByRollNo);
router.put('/student/:rollNo', adminController.updateStudent);
router.delete('/student/:rollNo', adminController.deleteStudent);

router.get('/faculty/:emailId', adminController.getFacultyByUnivId);
router.put('/faculty/:emailId', adminController.updateFaculty);
router.delete('/faculty/:emailId', adminController.deleteFaculty);

module.exports = router;
