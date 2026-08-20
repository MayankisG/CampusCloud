const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const adminDashboardRoutes = require('./src/routes/adminDashboardRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes');
const subjectEnrollmentRoutes = require('./src/routes/subjectEnrollmentRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/api/AdminDashboard', adminDashboardRoutes);
app.use('/api', announcementRoutes); // Handles /api/admin/announcement, /api/announcement, /api/all/announcement, /api/delete/Announcement/:id
app.use('/api/calendar', calendarRoutes);
app.use('/api/enrollments', subjectEnrollmentRoutes);
app.use('/api/attendance', attendanceRoutes); // Assuming attendance routes start with /api/attendance (check mapping)
app.use('/api/students', studentRoutes);
app.use('/api/faculty', teacherRoutes);
app.use('/api', adminRoutes); // Handles /api/uploadStudentDetails, etc.

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
