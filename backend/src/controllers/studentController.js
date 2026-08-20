const prisma = require('../config/prisma');
const { auth } = require('../config/firebase');

const getStudentProfile = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Auth Check
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) return res.status(404).json("Student not found");

    res.status(200).json(student);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

const getStudentSubjects = async (req, res) => {
  try {
    const { email } = req.params;
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        enrolledSubjects: {
          include: { faculty: true }
        }
      }
    });

    res.status(200).json(student ? student.enrolledSubjects : []);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const { email } = req.params;
    const { startDate, endDate } = req.query;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    let start = new Date();
    start.setMonth(start.getMonth() - 6);
    if (startDate) start = new Date(startDate);

    let end = new Date();
    if (endDate) end = new Date(endDate);

    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        enrolledSubjects: {
          include: { faculty: true }
        }
      }
    });

    if (!student) return res.status(404).json("Student not found");
    const subjects = student.enrolledSubjects;

    const attendanceSummary = [];
    let totalPercSum = 0;

    for (const subject of subjects) {
      const records = await prisma.attendance.findMany({
        where: {
          studentEmail: email,
          subjectId: subject.id,
          date: { gte: start, lte: end }
        }
      });

      const uniqueDates = new Set(records.map(r => r.date.getTime()));
      const totalClasses = uniqueDates.size;
      const presentCount = records.filter(r => r.present).length;
      
      const percentage = totalClasses > 0 ? (presentCount * 100 / totalClasses) : 0;
      
      attendanceSummary.push({
        subjectName: `${subject.subjectName}(${subject.credits})`,
        subjectCode: subject.subjectCode,
        faculty: subject.faculty ? subject.faculty.name : '',
        totalLectures: totalClasses,
        totalPresent: presentCount,
        percentage: Math.round(percentage * 100) / 100
      });
      totalPercSum += percentage;
    }

    const overallPercentage = subjects.length > 0 ? totalPercSum / subjects.length : 0;

    res.status(200).json({
      startDate: start,
      endDate: end,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      subjects: attendanceSummary
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getSubjectAttendance = async (req, res) => {
  try {
    const { email, subjectId } = req.params;
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    const records = await prisma.attendance.findMany({
      where: {
        studentEmail: email,
        subjectId: parseInt(subjectId)
      }
    });

    res.status(200).json(records);
  } catch (error) {
    res.status(401).json(error.message);
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    if (!file) return res.status(400).json("Please select an image file");
    if (!file.mimetype.startsWith('image/')) return res.status(400).json("Only image files are allowed");
    if (file.size > 2 * 1024 * 1024) return res.status(400).json("Image size must be less than 2MB");

    await prisma.student.update({
      where: { email },
      data: { stuImage: file.buffer }
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      email: email,
      imageSize: file.size
    });
  } catch (error) {
    res.status(500).json("Error uploading image: " + error.message);
  }
};

const getProfileImage = async (req, res) => {
  try {
    const { email } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Access denied");
    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.email !== email) return res.status(403).json("Access denied");

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student || !student.stuImage) {
      return res.status(404).json("No profile image found");
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(student.stuImage);
  } catch (error) {
    res.status(500).json("Error retrieving image: " + error.message);
  }
};

module.exports = {
  getStudentProfile,
  getStudentSubjects,
  getAttendanceSummary,
  getSubjectAttendance,
  uploadProfileImage,
  getProfileImage
};
