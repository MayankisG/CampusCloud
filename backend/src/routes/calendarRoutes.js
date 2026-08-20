const express = require('express');
const router = express.Router();
const multer = require('multer');
const calendarController = require('../controllers/calendarController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', calendarController.getLatestCalendar);
router.post('/', upload.single('file'), calendarController.uploadCalendar);

module.exports = router;
