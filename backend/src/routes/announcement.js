import express from 'express';
import AnnouncementService from '../services/AnnouncementService.js';

const router = express.Router();

// POST /api/admin/announcement - Create announcement
router.post('/admin/announcement', async (req, res) => {
  try {
    const announcement = await AnnouncementService.sendAnnouncement(req.body);
    return res.status(201).json(announcement);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/announcement - Get current announcement
router.get('/announcement', async (req, res) => {
  try {
    const announcement = await AnnouncementService.getCurrentAnnouncement();
    if (!announcement) {
      return res.status(404).json({ error: 'No announcement found' });
    }
    return res.json(announcement);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/all/announcement - Get all announcements
router.get('/all/announcement', async (req, res) => {
  try {
    const announcements = await AnnouncementService.getAllAnnouncements();
    return res.json(announcements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/delete/Announcement/:id - Delete announcement
router.delete('/delete/Announcement/:id', async (req, res) => {
  try {
    await AnnouncementService.deleteAnnouncement(req.params.id);
    return res.json({ message: 'Announcement deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;