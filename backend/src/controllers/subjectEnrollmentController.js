const prisma = require('../config/prisma');
const { auth } = require('../config/firebase');

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.subjectEnrollment.findMany({
      include: {
        faculty: true,
      }
    });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json("Error fetching enrollments: " + error.message);
  }
};

const createEnrollmentForAllStudents = async (req, res) => {
  try {
    const { subjectName, subjectCode, emailId, credits } = req.body;

    if (!subjectName) return res.status(400).json("Subject name is required");
    if (!subjectCode) return res.status(400).json("Subject code is required");
    if (!emailId) return res.status(400).json("Faculty email ID is required");

    // Get all students
    const students = await prisma.student.findMany();
    const studentConnections = students.map(student => ({ email: student.email }));

    const enrollment = await prisma.subjectEnrollment.create({
      data: {
        subjectName,
        subjectCode,
        credits: credits || 3,
        faculty: {
          connect: { email: emailId }
        },
        enrolledStudents: {
          connect: studentConnections
        }
      },
      include: {
        faculty: true,
      }
    });

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(500).json("Error creating enrollment: " + error.message);
  }
};

const getSubjectsByFaculty = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("No token provided");

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);
    const facultyEmail = decodedToken.email;

    if (!facultyEmail) {
      return res.status(400).json("Token does not contain email");
    }

    const subjects = await prisma.subjectEnrollment.findMany({
      where: { facultyEmail: facultyEmail },
      include: {
        enrolledStudents: true
      }
    });

    res.status(200).json(subjects);
  } catch (error) {
    res.status(400).json("Error: " + error.message);
  }
};

const getEnrollmentById = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const enrollment = await prisma.subjectEnrollment.findUnique({
      where: { id: parseInt(subjectId) },
      include: {
        enrolledStudents: true,
        faculty: true
      }
    });

    if (!enrollment) {
      return res.status(404).json("Enrollment not found");
    }

    res.status(200).json(enrollment);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  getAllEnrollments,
  createEnrollmentForAllStudents,
  getSubjectsByFaculty,
  getEnrollmentById
};
