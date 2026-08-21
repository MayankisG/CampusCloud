import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  present: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'attendance',
  timestamps: true,
  underscored: true
});

export default Attendance;