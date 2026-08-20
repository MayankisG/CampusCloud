const prisma = require('../config/prisma');

const sendAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    const newAnnouncement = await prisma.announcement.create({
      data: { message }
    });
    res.status(200).json(newAnnouncement);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAnnouncement = async (req, res) => {
  try {
    // get the latest announcement
    const announcement = await prisma.announcement.findFirst({
      orderBy: { id: 'desc' }
    });
    
    if (announcement) {
      res.status(200).json(announcement);
    } else {
      res.status(404).json("No announcement found");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllAnnouncement = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { id: 'desc' }
    });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json("Announcement deleted");
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = {
  sendAnnouncement,
  getAnnouncement,
  getAllAnnouncement,
  deleteAnnouncement
};
