import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import UserService from './UserService.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

class AdminService {
  generateRollNo(year, branch, id) {
    return `${year}${branch}${id}`;
  }

  generatePassword(dob) {
    return dob ? dob.toString() : 'password123';
  }

  generateUnivId(name, contactNo) {
    const lastDigit = contactNo % 10;
    const secondLastDigit = Math.floor(contactNo / 10) % 10;
    const thirdLastDigit = Math.floor(contactNo / 100) % 10;

    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0];

    return this.reverse(firstName) + thirdLastDigit + secondLastDigit + lastDigit + Math.floor(Math.random() * 100) + '@stu.edu';
  }

  generateUnivIdFaculty(name, contactNo) {
    const lastDigit = contactNo % 10;
    const secondLastDigit = Math.floor(contactNo / 10) % 10;
    const thirdLastDigit = Math.floor(contactNo / 100) % 10;

    const nameParts = name.split(/\s+/);
    const firstName = nameParts.length > 1 ? nameParts[1] : nameParts[0];

    return this.reverse(firstName) + thirdLastDigit + secondLastDigit + lastDigit + Math.floor(Math.random() * 100) + '@univ.edu';
  }

  reverse(str) {
    return str.split('').reverse().join('');
  }

  async parseCsv(file) {
    return new Promise((resolve, reject) => {
      const students = [];
      const stream = Readable.from(file.buffer);
      
      stream
        .pipe(csv())
        .on('data', (row) => {
          students.push({
            name: row.name,
            course: row.course,
            branch: row.branch,
            semester: parseInt(row.semester) || 0,
            year: parseInt(row.year) || 0,
            enrollmentCode: row.enrollmentCode,
            enrollmentCompleted: row.enrollmentCompleted === 'true',
            rollNo: row.rollNo,
            dob: row.dob ? new Date(row.dob) : null,
            contactNo: parseInt(row.contactNo) || null,
            address: row.address,
            gender: row.gender,
            nationality: row.nationality,
            bloodGroup: row.bloodGroup,
            parentContactNo: parseInt(row.parentContactNo) || null,
            parentName: row.parentName,
            parentOccupation: row.parentOccupation,
            email: row.emailId,
            univId: this.generateUnivId(row.name, parseInt(row.contactNo) || 1234567890)
          });
        })
        .on('end', () => {
          resolve(students);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async uploadDetailsOfStudentsBulk(file) {
    const studentsData = await this.parseCsv(file);
    const savedStudents = await Student.bulkCreate(studentsData);

    for (const student of savedStudents) {
      const rollNo = this.generateRollNo(student.year || 1, student.branch || 'GEN', student.id);
      const password = this.generatePassword(student.dob);
      student.password = password;
      student.rollNo = rollNo;
      student.univId = this.generateUnivId(student.name, student.contactNo || 1234567890);

      const user = await UserService.createUser(
        student.email,
        student.password,
        student.name,
        'student',
        student.univId
      );
      student.firebaseUid = user.firebaseUid;
      await student.save();
    }

    return savedStudents.length;
  }

  async uploadStudentDetail(studentData) {
    // Check if email already exists
    const existingStudent = await Student.findOne({ where: { email: studentData.email } });
    if (existingStudent) {
      throw new Error('Email already exists');
    }

    // Set default password if not provided
    if (!studentData.password) {
      studentData.password = studentData.dob ? studentData.dob.toString() : 'password123';
    }

    // Create student
    const savedStudent = await Student.create(studentData);

    // Generate rollNo if not provided
    if (!savedStudent.rollNo) {
      const rollNo = this.generateRollNo(
        savedStudent.year || 1,
        savedStudent.branch || 'GEN',
        savedStudent.id
      );
      savedStudent.rollNo = rollNo;
    }

    // Generate univId if not provided
    if (!savedStudent.univId) {
      savedStudent.univId = this.generateUnivId(
        savedStudent.name,
        savedStudent.contactNo || 1234567890
      );
    }

    // Create Firebase user
    try {
      const user = await UserService.createUser(
        savedStudent.email,
        savedStudent.password,
        savedStudent.name,
        'student',
        savedStudent.univId
      );
      savedStudent.firebaseUid = user.firebaseUid;
      await savedStudent.save();
    } catch (error) {
      console.error('Error creating Firebase user:', error);
    }

    return savedStudent;
  }

  async uploadFacultyDetail(facultyData) {
    // Check if email already exists
    const existingFaculty = await Faculty.findOne({ where: { email: facultyData.email } });
    if (existingFaculty) {
      throw new Error('Email already exists');
    }

    // Set default password if not provided
    if (!facultyData.password) {
      facultyData.password = facultyData.dob ? facultyData.dob.toString() : 'password123';
    }

    // Create faculty
    const savedFaculty = await Faculty.create(facultyData);

    // Generate univId if not provided
    if (!savedFaculty.univId) {
      savedFaculty.univId = this.generateUnivIdFaculty(
        savedFaculty.name,
        savedFaculty.contactNo || 1234567890
      );
      await savedFaculty.save();
    }

    // Create Firebase user
    try {
      const user = await UserService.createUser(
        savedFaculty.email,
        savedFaculty.password,
        savedFaculty.name,
        'faculty',
        savedFaculty.univId
      );
      savedFaculty.firebaseUid = user.firebaseUid;
      await savedFaculty.save();
    } catch (error) {
      console.error('Error creating Firebase user:', error);
    }

    return savedFaculty;
  }

  async getStudentByRollNo(rollNo) {
    return await Student.findOne({ where: { rollNo } });
  }

  async updateStudent(rollNo, studentData) {
    const student = await Student.findOne({ where: { rollNo } });
    if (!student) {
      throw new Error('Student not found');
    }
    return await student.update(studentData);
  }

  async deleteStudent(rollNo) {
    const student = await Student.findOne({ where: { rollNo } });
    if (!student) {
      return false;
    }
    await student.destroy();
    return true;
  }

  async getFacultyByUnivId(univId) {
    return await Faculty.findOne({ where: { univId } });
  }

  async updateFaculty(univId, facultyData) {
    const faculty = await Faculty.findOne({ where: { univId } });
    if (!faculty) {
      throw new Error('Faculty not found');
    }
    return await faculty.update(facultyData);
  }

  async deleteFaculty(univId) {
    const faculty = await Faculty.findOne({ where: { univId } });
    if (!faculty) {
      return false;
    }
    await faculty.destroy();
    return true;
  }
}

export default new AdminService();