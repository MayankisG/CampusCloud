import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { User, Student, Faculty, SubjectEnrollment, Attendance, Announcement, Calendar } from './models/index.js';

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import announcementRoutes from './routes/announcement.js';
import attendanceRoutes from './routes/attendance.js';
import calendarRoutes from './routes/calendar.js';
import studentsRoutes from './routes/students.js';
import teachersRoutes from './routes/teachers.js';
import enrollmentsRoutes from './routes/enrollments.js';
import adminDashboardRoutes from './routes/adminDashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/faculty', teachersRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/AdminDashboard', adminDashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database sync and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models (in development, use alter: true to update schema)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;