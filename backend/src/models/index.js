import User from './User.js';
import Student from './Student.js';
import Faculty from './Faculty.js';
import SubjectEnrollment from './SubjectEnrollment.js';
import Attendance from './Attendance.js';
import Announcement from './Announcement.js';
import Calendar from './Calendar.js';

// User associations
User.hasOne(Student, { foreignKey: 'firebaseUid', sourceKey: 'firebaseUid', as: 'studentProfile' });
User.hasOne(Faculty, { foreignKey: 'firebaseUid', sourceKey: 'firebaseUid', as: 'facultyProfile' });

// Student associations
Student.belongsTo(User, { foreignKey: 'firebaseUid', targetKey: 'firebaseUid', as: 'user' });
Student.belongsToMany(SubjectEnrollment, { 
  through: 'subject_student_enrollment', 
  foreignKey: 'student_email', 
  otherKey: 'subject_id',
  as: 'enrolledSubjects'
});

// Faculty associations
Faculty.belongsTo(User, { foreignKey: 'firebaseUid', targetKey: 'firebaseUid', as: 'user' });
Faculty.hasMany(SubjectEnrollment, { foreignKey: 'faculty_email', sourceKey: 'email', as: 'taughtSubjects' });
Faculty.hasMany(Attendance, { foreignKey: 'faculty_email', sourceKey: 'email', as: 'markedAttendances' });

// SubjectEnrollment associations
SubjectEnrollment.belongsTo(Faculty, { foreignKey: 'faculty_email', targetKey: 'email', as: 'faculty' });
SubjectEnrollment.belongsToMany(Student, { 
  through: 'subject_student_enrollment', 
  foreignKey: 'subject_id', 
  otherKey: 'student_email',
  as: 'enrolledStudents'
});
SubjectEnrollment.hasMany(Attendance, { foreignKey: 'subject_id', as: 'attendances' });

// Attendance associations
Attendance.belongsTo(Student, { foreignKey: 'student_email', targetKey: 'email', as: 'student' });
Attendance.belongsTo(Faculty, { foreignKey: 'faculty_email', targetKey: 'email', as: 'faculty' });
Attendance.belongsTo(SubjectEnrollment, { foreignKey: 'subject_id', as: 'subject' });

// Announcement - no associations needed

// Calendar - no associations needed

export {
  User,
  Student,
  Faculty,
  SubjectEnrollment,
  Attendance,
  Announcement,
  Calendar
};