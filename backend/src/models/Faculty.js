import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Faculty = sequelize.define('Faculty', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  univId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'univ_id'
  },
  firebaseUid: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'firebase_uid'
  },
  department: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
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
  image: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'faculty',
  timestamps: true,
  underscored: true
});

export default Faculty;