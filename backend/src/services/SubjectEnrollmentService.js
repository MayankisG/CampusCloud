import SubjectEnrollment from '../models/SubjectEnrollment.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

class SubjectEnrollmentService {
  async createEnrollmentForAllStudents(request) {
    const { subjectName, subjectCode, credits, emailId } = request;

    const faculty = await Faculty.findOne({ where: { email: emailId } });
    if (!faculty) {
      throw new Error(`Faculty not found with ID: ${emailId}`);
    }

    const enrollment = await SubjectEnrollment.create({
      subjectName,
      subjectCode,
      credits,
      faculty_email: faculty.email
    });

    const students = await Student.findAll();
    if (students.length === 0) {
      throw new Error('No students available for enrollment');
    }

    await enrollment.addEnrolledStudents(students);

    return enrollment;
  }

  async getAllEnrollments() {
    return await SubjectEnrollment.findAll({
      include: [
        { model: Faculty, as: 'faculty' },
        { model: Student, as: 'enrolledStudents', through: { attributes: [] } }
      ]
    });
  }

  async getSubjectsByFaculty(facultyEmail) {
    return await SubjectEnrollment.findAll({
      where: { faculty_email: facultyEmail },
      include: [{ model: Faculty, as: 'faculty' }]
    });
  }

  async getEnrollmentById(subjectId) {
    return await SubjectEnrollment.findByPk(subjectId, {
      include: [
        { model: Faculty, as: 'faculty' },
        { model: Student, as: 'enrolledStudents', through: { attributes: [] } }
      ]
    });
  }
}

export default new SubjectEnrollmentService();