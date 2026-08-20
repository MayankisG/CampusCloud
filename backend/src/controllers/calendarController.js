const prisma = require('../config/prisma');

const getLatestCalendar = async (req, res) => {
  try {
    const calendar = await prisma.calendar.findFirst({
      orderBy: { lastUpdated: 'desc' }
    });

    if (!calendar) {
      return res.status(404).send('Not Found');
    }

    res.setHeader('Content-Disposition', `inline; filename="${calendar.fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(calendar.fileData);
  } catch (error) {
    res.status(500).send('Error fetching calendar');
  }
};

const uploadCalendar = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file || file.mimetype !== 'application/pdf') {
      return res.status(400).send('Invalid PDF file');
    }

    await prisma.calendar.create({
      data: {
        title: title || file.originalname,
        fileName: file.originalname,
        fileData: file.buffer,
        lastUpdated: new Date()
      }
    });

    res.status(200).send('Calendar updated successfully');
  } catch (error) {
    res.status(500).send('Error updating calendar');
  }
};

module.exports = {
  getLatestCalendar,
  uploadCalendar
};
