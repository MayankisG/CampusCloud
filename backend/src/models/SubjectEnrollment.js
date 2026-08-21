import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SubjectEnrollment = sequelize.define('SubjectEnrollment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  subjectName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'subject_name'
  },
  subjectCode: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'subject_code'
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'subject_enrollments',
  timestamps: true,
  underscored: true
});

export default SubjectEnrollment;