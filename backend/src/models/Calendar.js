import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Calendar = sequelize.define('Calendar', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'file_name'
  },
  fileData: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
    field: 'file_data'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_updated'
  }
}, {
  tableName: 'calendars',
  timestamps: true,
  underscored: true
});

export default Calendar;