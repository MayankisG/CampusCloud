import Attendance from '../models/Attendance.js';
import SubjectEnrollment from '../models/SubjectEnrollment.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

class AttendanceService {
  async markBulkAttendance(request) {
    const { facultyEmail, subjectId, date, studentAttendances } = request;

    const faculty = await Faculty.findOne({ where: { email: facultyEmail } });
    if (!faculty) {
      throw new Error('Faculty not found');
    }

    const subject = await SubjectEnrollment.findByPk(subjectId, {
      include: [{ model: Faculty, as: 'faculty' }]
    });
    if (!subject) {
      throw new Error('Subject not found');
    }

    if (subject.faculty.email !== faculty.email) {
      throw new Error('Faculty doesn\'t teach this subject');
    }

    const attendanceDate = date ? new Date(date) : new Date();
    const results = [];

    for (const sa of studentAttendances) {
      const student = await Student.findOne({ where: { email: sa.studentEmail } });
      if (!student) {
        throw new Error(`Student not found: ${sa.studentEmail}`);
      }

      // Check if student is enrolled in this subject
      const enrolledStudents = await subject.getEnrolledStudents({
        where: { email: sa.studentEmail }
      });
      if (enrolledStudents.length === 0) {
        throw new Error(`Student not enrolled: ${student.email}`);
      }

      // Find or create attendance record
      let attendance = await Attendance.findOne({
        where: {
          student_email: student.email,
          subject_id: subject.id,
          date: attendanceDate
        }
      });

      if (!attendance) {
        attendance = await Attendance.create({
          student_email: student.email,
          faculty_email: faculty.email,
          subject_id: subject.id,
          date: attendanceDate,
          present: sa.present,
          remarks: sa.remarks
        });
      } else {
        attendance.present = sa.present;
        attendance.remarks = sa.remarks;
        await attendance.save();
      }

      results.push(this.toDTO(attendance));
    }

    return results;
  }

  async getAttendanceBySubjectAndDate(subjectId, date) {
    const attendances = await Attendance.findAll({
      where: {
        subject_id: subjectId,
        date: date
      },
      include: [
        { model: Student, as: 'student' },
        { model: Faculty, as: 'faculty' },
        { model: SubjectEnrollment, as: 'subject' }
      ]
    });

    return attendances.map(a => this.toDTO(a));
  }

  async getSubjectsByFaculty(facultyEmail) {
    const subjects = await SubjectEnrollment.findAll({
      where: { faculty_email: facultyEmail },
      include: [{ model: Faculty, as: 'faculty' }]
    });

    return subjects.map(s => this.toSubjectDTO(s));
  }

  async getSubjectWithStudents(subjectId) {
    const subject = await SubjectEnrollment.findByPk(subjectId, {
      include: [
        { model: Faculty, as: 'faculty' },
        { model: Student, as: 'enrolledStudents', through: { attributes: [] } }
      ]
    });

    if (!subject) {
      throw new Error('Subject not found');
    }

    return this.toSubjectWithStudentsDTO(subject);
  }

  async getSubjectAttendanceStats(subjectId) {
    const classDates = await Attendance.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('date')), 'date']],
      where: { subject_id: subjectId },
      raw: true
    });

    const attendances = await Attendance.findAll({
      where: { subject_id: subjectId }
    });

    const presentCount = attendances.filter(a => a.present).length;
    const totalClasses = classDates.length;
    const totalStudents = await SubjectEnrollment.findByPk(subjectId, {
      include: [{ model: Student, as: 'enrolledStudents', through: { attributes: [] } }]
    }).then(s => s ? s.enrolledStudents.length : 0);

    const percentage = totalClasses > 0 && totalStudents > 0
      ? Math.round((presentCount * 100.0 / (totalClasses * totalStudents)) * 100) / 100.0
      : 0;

    return {
      totalClasses,
      totalPresent: presentCount,
      attendancePercentage: percentage
    };
  }

  async findAttendance(studentEmail, subjectId, date) {
    return await Attendance.findOne({
      where: {
        student_email: studentEmail,
        subject_id: subjectId,
        date: date
      }
    });
  }

  async getAllAttendanceForStudent(email) {
    const attendances = await Attendance.findAll({
      where: { student_email: email },
      include: [
        { model: SubjectEnrollment, as: 'subject' },
        { model: Faculty, as: 'faculty' }
      ],
      order: [['date', 'DESC']]
    });

    return attendances.map(a => this.toDTO(a));
  }

  async getSubjectsByStudent(email) {
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return [];
    }

    const subjects = await student.getEnrolledSubjects({
      include: [{ model: Faculty, as: 'faculty' }]
    });

    return subjects.map(s => this.toSubjectDTO(s));
  }

  async getAttendanceByStudentAndSubject(email, subjectId) {
    const attendances = await Attendance.findAll({
      where: {
        student_email: email,
        subject_id: subjectId
      },
      include: [
        { model: SubjectEnrollment, as: 'subject' },
        { model: Faculty, as: 'faculty' }
      ],
      order: [['date', 'DESC']]
    });

    return attendances.map(a => this.toDTO(a));
  }

  toDTO(attendance) {
    return {
      id: attendance.id,
      studentEmail: attendance.student_email,
      facultyEmail: attendance.faculty_email,
      subjectId: attendance.subject_id,
      date: attendance.date,
      present: attendance.present,
      remarks: attendance.remarks,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt
    };
  }

  toSubjectDTO(subject) {
    return {
      id: subject.id,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      credits: subject.credits,
      facultyEmail: subject.faculty?.email
    };
  }

  toSubjectWithStudentsDTO(subject) {
    return {
      id: subject.id,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      credits: subject.credits,
      faculty: subject.faculty ? {
        id: subject.faculty.id,
        name: subject.faculty.name,
        email: subject.faculty.email,
        department: subject.faculty.department
      } : null,
      enrolledStudents: subject.enrolledStudents?.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        rollNo: s.rollNo,
        branch: s.branch,
        year: s.year
      })) || []
    };
  }
}

export default new AttendanceService();