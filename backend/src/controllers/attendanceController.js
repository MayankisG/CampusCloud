const prisma = require('../config/prisma');

const markBulkAttendance = async (req, res) => {
  try {
    const { subjectId, date, attendanceRecords } = req.body;
    // attendanceRecords: array of { studentEmail, present, remarks }
    
    const parsedDate = new Date(date);
    
    // Find subject to get facultyEmail
    const subject = await prisma.subjectEnrollment.findUnique({
      where: { id: parseInt(subjectId) }
    });
    
    if (!subject) throw new Error("Subject not found");

    const result = [];
    for (const record of attendanceRecords) {
      // Upsert attendance for student, subject, date
      const attendance = await prisma.attendance.findFirst({
        where: {
          studentEmail: record.studentEmail,
          subjectId: parseInt(subjectId),
          date: parsedDate
        }
      });
      
      let updated;
      if (attendance) {
        updated = await prisma.attendance.update({
          where: { id: attendance.id },
          data: { present: record.present, remarks: record.remarks }
        });
      } else {
        updated = await prisma.attendance.create({
          data: {
            studentEmail: record.studentEmail,
            subjectId: parseInt(subjectId),
            facultyEmail: subject.facultyEmail,
            date: parsedDate,
            present: record.present,
            remarks: record.remarks
          }
        });
      }
      result.push(updated);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAttendanceBySubjectAndDate = async (req, res) => {
  try {
    const { subjectId, date } = req.params;
    const parsedDate = new Date(date);

    const subject = await prisma.subjectEnrollment.findUnique({
      where: { id: parseInt(subjectId) },
      include: { enrolledStudents: true }
    });

    if (!subject) throw new Error("Subject not found");

    const dtos = [];
    for (const student of subject.enrolledStudents) {
      const existing = await prisma.attendance.findFirst({
        where: {
          studentEmail: student.email,
          subjectId: parseInt(subjectId),
          date: parsedDate
        }
      });

      dtos.push({
        student: student,
        facultyEmail: subject.facultyEmail,
        subject: subject,
        date: parsedDate,
        present: existing ? existing.present : false,
        remarks: existing ? existing.remarks : null
      });
    }

    res.status(200).json(dtos);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getSubjectsByFaculty = async (req, res) => {
  try {
    const { email } = req.params;
    const subjects = await prisma.subjectEnrollment.findMany({
      where: { facultyEmail: email }
    });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getSubjectWithStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await prisma.subjectEnrollment.findUnique({
      where: { id: parseInt(id) },
      include: { enrolledStudents: true }
    });
    
    if (!subject) throw new Error("Subject not found");
    res.status(200).json(subject);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getSubjectAttendanceStats = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    // total classes = count distinct dates for this subject
    const distinctDates = await prisma.attendance.findMany({
      where: { subjectId: parseInt(subjectId) },
      distinct: ['date'],
      select: { date: true }
    });
    
    const totalClasses = distinctDates.length;
    
    // present records
    const presentCount = await prisma.attendance.count({
      where: { subjectId: parseInt(subjectId), present: true }
    });
    
    res.status(200).json({
      subjectId,
      totalClasses,
      presentCount,
      // You can add more detailed stats here as needed
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAllAttendanceForStudent = async (req, res) => {
  try {
    const { email } = req.params;
    const attendances = await prisma.attendance.findMany({
      where: { studentEmail: email },
      include: { subject: true, faculty: true }
    });
    res.status(200).json(attendances);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getSubjectsByStudent = async (req, res) => {
  try {
    const { email } = req.params;
    const student = await prisma.student.findUnique({
      where: { email },
      include: { enrolledSubjects: true }
    });
    
    res.status(200).json(student ? student.enrolledSubjects : []);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAttendanceByStudentAndSubject = async (req, res) => {
  try {
    const { email, subjectId } = req.params;
    const attendances = await prisma.attendance.findMany({
      where: { studentEmail: email, subjectId: parseInt(subjectId) },
      include: { subject: true }
    });
    res.status(200).json(attendances);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  markBulkAttendance,
  getAttendanceBySubjectAndDate,
  getSubjectsByFaculty,
  getSubjectWithStudents,
  getSubjectAttendanceStats,
  getAllAttendanceForStudent,
  getSubjectsByStudent,
  getAttendanceByStudentAndSubject
};
