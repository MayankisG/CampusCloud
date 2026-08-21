import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  course: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  branch: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enrollmentCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'enrollment_code'
  },
  enrollmentCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'enrollment_completed'
  },
  rollNo: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'roll_no'
  },
  firebaseUid: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'firebase_uid'
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  contactNo: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'contact_no'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bloodGroup: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'blood_group'
  },
  parentContactNo: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'parent_contact_no'
  },
  parentName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'parent_name'
  },
  parentOccupation: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'parent_occupation'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  univId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'univ_id'
  },
  stuImage: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
    field: 'stu_image'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  underscored: true
});

export default Student;