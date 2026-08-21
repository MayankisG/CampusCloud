# CampusCloud University Campus System - Node.js Backend

A complete Node.js/Express backend for the University Campus Management System, converted from the original Spring Boot application.

## Features

- **Authentication**: Firebase Authentication integration
- **User Management**: Students, Faculty, Admins
- **Academic Management**: Subjects, Enrollments, Attendance
- **Announcements**: Create, read, delete announcements
- **Calendar**: PDF calendar upload and retrieval
- **File Upload**: Profile images, CSV bulk upload
- **Dashboard**: Statistics for admin, students, and faculty

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: Firebase Admin SDK
- **File Upload**: Multer
- **CSV Parsing**: csv-parser
- **Security**: Helmet, CORS

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Sequelize configuration
│   │   └── firebase.js      # Firebase Admin SDK configuration
│   ├── models/
│   │   ├── index.js         # Model associations
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Faculty.js
│   │   ├── SubjectEnrollment.js
│   │   ├── Attendance.js
│   │   ├── Announcement.js
│   │   └── Calendar.js
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── AdminService.js
│   │   ├── AnnouncementService.js
│   │   ├── AttendanceService.js
│   │   ├── CalendarService.js
│   │   └── SubjectEnrollmentService.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── announcement.js
│   │   ├── attendance.js
│   │   ├── calendar.js
│   │   ├── students.js
│   │   ├── teachers.js
│   │   ├── enrollments.js
│   │   └── adminDashboard.js
│   └── server.js            # Main entry point
├── .env                     # Environment variables
└── package.json
```

## API Endpoints

### Authentication
- `POST /auth/login` - Login with Firebase ID token

### Admin
- `POST /api/uploadStudentDetails` - Bulk upload students (CSV)
- `POST /api/uploadStudent` - Create single student
- `POST /api/uploadFaculty` - Create single faculty
- `GET /api/student/:rollNo` - Get student by roll number
- `PUT /api/student/:rollNo` - Update student
- `DELETE /api/student/:rollNo` - Delete student
- `GET /api/faculty/:emailId` - Get faculty by univId
- `PUT /api/faculty/:emailId` - Update faculty
- `DELETE /api/faculty/:emailId` - Delete faculty

### Announcements
- `POST /api/admin/announcement` - Create announcement
- `GET /api/announcement` - Get current announcement
- `GET /api/all/announcement` - Get all announcements
- `DELETE /api/delete/Announcement/:id` - Delete announcement

### Attendance
- `POST /api/attendance/bulk` - Mark bulk attendance
- `GET /api/attendance/subject/:subjectId/date/:date` - Get attendance by subject and date
- `GET /api/attendance/faculty/:email/subjects` - Get subjects by faculty
- `GET /api/attendance/subject/:id/students` - Get subject with students
- `GET /api/attendance/stats/subject/:subjectId` - Get subject attendance stats
- `GET /api/attendance/student/:email` - Get all attendance for student
- `GET /api/attendance/student/:email/subjects` - Get subjects by student
- `GET /api/attendance/student/:email/subject/:subjectId` - Get attendance by student and subject

### Calendar
- `GET /api/calendar` - Get latest calendar (PDF)
- `POST /api/calendar` - Upload calendar (PDF)

### Students (Authenticated)
- `GET /api/students/by-email/:email` - Get student profile
- `GET /api/students/:email/subjects` - Get student subjects
- `GET /api/students/:email/attendance-summary` - Get attendance summary
- `GET /api/students/:email/attendance/:subjectId` - Get subject attendance
- `POST /api/students/upload-image` - Upload profile image
- `GET /api/students/profile-image/:email` - Get profile image

### Teachers (Authenticated)
- `GET /api/faculty/by-email/:email` - Get teacher profile
- `POST /api/faculty/upload-image` - Upload profile image
- `GET /api/faculty/profile-image/:email` - Get profile image
- `GET /api/faculty/students/all` - Get all students

### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `POST /api/enrollments/create-for-all` - Create enrollment for all students
- `GET /api/enrollments/faculty` - Get subjects by faculty (from token)
- `GET /api/enrollments/:subjectId` - Get enrollment by ID

### Admin Dashboard
- `GET /api/AdminDashboard/students/count` - Get student count
- `GET /api/AdminDashboard/faculty/count` - Get faculty count
- `GET /api/AdminDashboard/classes/count` - Get classes count

## Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env` and update with your configuration:
   ```bash
   cp .env.example .env
   # Edit .env with your database and Firebase credentials
   ```

3. **Set up MySQL database**:
   Create a database named `university` (or update DB_NAME in .env)

4. **Configure Firebase**:
   - Option 1: Place `firebase-service-account.json` in the backend root and set `FIREBASE_SERVICE_ACCOUNT_PATH`
   - Option 2: Set `FIREBASE_PROJECT_ID` for Application Default Credentials

5. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Database Schema

The application uses the following main tables:
- `users` - Firebase users with roles
- `students` - Student profiles
- `faculty` - Faculty profiles
- `subject_enrollments` - Subjects/Classes
- `subject_student_enrollment` - Many-to-many enrollment
- `attendance` - Attendance records
- `announcements` - System announcements
- `calendars` - Academic calendar PDFs

## Development

- The server runs on `http://localhost:5000` by default
- Database models auto-sync in development mode (`alter: true`)
- Check console for SQL queries (enabled in development)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Use environment variables for all secrets
6. Disable `alter: true` in production

## License

MIT