import express from 'express';
import multer from 'multer';
import CalendarService from '../services/CalendarService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/calendar - Get latest calendar
router.get('/', async (req, res) => {
  try {
    const calendar = await CalendarService.getLatestCalendar();
    if (!calendar) {
      return res.status(404).json({ error: 'No calendar found' });
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${calendar.fileName}"`
    });
    return res.send(calendar.fileData);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching calendar' });
  }
});

// POST /api/calendar - Upload calendar
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid PDF file' });
    }

    const { title } = req.body;
    await CalendarService.saveCalendar(req.file, title);
    return res.json({ message: 'Calendar updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating calendar' });
  }
});

export default router;