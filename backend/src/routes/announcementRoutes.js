const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

router.post('/admin/announcement', announcementController.sendAnnouncement);
router.get('/announcement', announcementController.getAnnouncement);
router.get('/all/announcement', announcementController.getAllAnnouncement);
router.delete('/delete/Announcement/:id', announcementController.deleteAnnouncement);

module.exports = router;
