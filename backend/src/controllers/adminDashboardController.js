const prisma = require('../config/prisma');

const getStudentCount = async (req, res) => {
  try {
    const count = await prisma.student.count();
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherCount = async (req, res) => {
  try {
    const count = await prisma.faculty.count();
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClassesCount = async (req, res) => {
  try {
    const count = await prisma.subjectEnrollment.count();
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentCount,
  getTeacherCount,
  getClassesCount
};
