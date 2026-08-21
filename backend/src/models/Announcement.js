import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'announcements',
  timestamps: true,
  underscored: true
});

export default Announcement;