import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  firebaseUid: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'firebase_uid'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  univId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'univ_id'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

export default User;