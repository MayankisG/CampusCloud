# 🎓 University Campus Management System
### Full-Stack Role-Based Campus Operations Platform using Node.js + React

![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange)
![Render](https://img.shields.io/badge/Backend%20Hosting-Render-purple)
![Netlify](https://img.shields.io/badge/Frontend%20Hosting-Netlify-green)
![Railway](https://img.shields.io/badge/Database-Railway-red)
![Status](https://img.shields.io/badge/Status-Active-success)

A **full-stack university management platform** that centralizes academic operations including **student management, faculty operations, course handling, attendance tracking, and announcements**, secured through role-based access control.

The system demonstrates full-stack development, REST API design, authentication, database management, and scalable backend architecture using **Node.js, Express, React, MySQL, Sequelize, and Firebase Authentication**.

---

## 📖 Overview

The **University Campus Management System** simplifies campus administration by providing a centralized platform for:

- Administrators
- Faculty Members
- Students

Each role has dedicated functionality, creating a structured academic workflow with controlled access to university operations.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- Firebase Authentication integration
- Secure authentication flow
- Role-based access control
- Protected backend APIs
- Firebase Admin SDK integration
- HTTP security headers using Helmet
- CORS configuration

### 🛠 Admin Module
Administrators can manage university-wide operations:

- Faculty enrollment and management
- Student enrollment and management
- Course/subject management
- Course enrollment management
- Assigning faculty to courses
- Publishing and managing announcements
- Bulk student upload using CSV
- Admin dashboard statistics

### 👨‍🏫 Faculty Module
Faculty members can:

- View assigned courses
- Mark student attendance
- Manage attendance records
- View students
- Manage faculty profile
- Upload profile images

### 🎓 Student Module
Students can:

- View enrolled courses
- Track attendance
- View attendance summaries
- View announcements
- Manage student profile
- Upload profile images

### 📅 Academic Calendar
- Academic calendar PDF upload
- Latest calendar retrieval
- Calendar access through REST APIs

---

## 🏗 System Architecture

```text
                         ┌──────────────────────┐
                         │       Users          │
                         │ Admin / Faculty /    │
                         │       Student        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │   Vite + Axios       │
                         │      Netlify         │
                         └──────────┬───────────┘
                                    │
                                    ├──────────────► Firebase Auth
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Node.js + Express     │
                         │      REST APIs        │
                         │       Render          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Sequelize ORM         │
                         │          │            │
                         │          ▼            │
                         │ Railway MySQL         │
                         └──────────────────────┘
```

---

## 🧰 Tech Stack

### Backend
- Node.js 18+
- Express.js
- Sequelize ORM
- MySQL
- REST APIs
- Firebase Admin SDK
- JWT / authentication middleware
- Multer for file uploads
- csv-parser for CSV processing
- Helmet for security
- CORS
- Morgan for request logging
- Hosted on Render

### Frontend
- React.js
- Vite
- Axios
- React Router
- Firebase Authentication
- Chart.js
- Styled Components
- React Toastify
- CSS
- Hosted on Netlify

### Database
- MySQL
- Sequelize ORM
- Railway MySQL Cloud Database

### Authentication
- Firebase Authentication
- Firebase Admin SDK

---

## 🌐 Live Links

🔗 **Live Application**  
https://mayank-singh-rawat.netlify.app/

🎥 **Demo Video**  
https://www.youtube.com/watch?v=pYJvBpXoFwQ

---

## ⚠️ Deployment Note

The backend is hosted on the **Render free tier**, which may experience cold-start delays.

The first request can take some time while the backend service initializes. If the application does not load immediately, wait for the backend to start and refresh the page.

For a faster overview of the application's functionality, watching the demo video is recommended.

---

## 🔄 Application Workflow

1. Users authenticate through Firebase Authentication.
2. The frontend obtains the authenticated user's identity/token.
3. Requests are sent from React to the Node.js/Express REST APIs.
4. Backend routes validate requests and apply role-based access rules.
5. Services handle business logic for students, faculty, attendance, enrollments, announcements, and calendar operations.
6. Sequelize communicates with the Railway MySQL database.
7. The backend returns data through REST APIs.
8. React updates the dashboard and UI according to the user's role.

---

## 📂 Project Structure

```text
UniversityCampusManagementSystem/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── firebase.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Student.js
│   │   │   ├── Faculty.js
│   │   │   ├── SubjectEnrollment.js
│   │   │   ├── Attendance.js
│   │   │   ├── Announcement.js
│   │   │   ├── Calendar.js
│   │   │   └── index.js
│   │   │
│   │   ├── services/
│   │   │   ├── AuthService.js
│   │   │   ├── UserService.js
│   │   │   ├── AdminService.js
│   │   │   ├── AttendanceService.js
│   │   │   ├── AnnouncementService.js
│   │   │   ├── CalendarService.js
│   │   │   └── SubjectEnrollmentService.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   ├── students.js
│   │   │   ├── teachers.js
│   │   │   ├── attendance.js
│   │   │   ├── announcements.js
│   │   │   ├── calendar.js
│   │   │   ├── enrollments.js
│   │   │   └── adminDashboard.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- Git
- MySQL or access to a MySQL database
- Firebase project for authentication

---

## 🔧 Backend Setup

```bash
# Clone repository
git clone <repository-url>

# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure database, Firebase, and frontend URL
# Edit .env with your credentials

# Start development server
npm run dev
```

For production:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/health
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure frontend environment variables
# Edit .env as required

# Start development server
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

## 🗄 Database Configuration

The backend uses **MySQL with Sequelize ORM**.

Configure the following values in the backend `.env` file:

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

For production, the project can use the Railway MySQL database.

---

## 🔑 Firebase Configuration

Firebase Authentication is used for user authentication.

The backend uses the **Firebase Admin SDK** to validate and work with authenticated users.

Configure the required Firebase environment variables in:

```text
backend/.env
```

Do not commit Firebase credentials or other secrets to GitHub.

---

## 🔌 Main API Modules

The Node.js backend exposes REST APIs for:

| Module | Purpose |
|---|---|
| Authentication | Firebase-based authentication |
| Admin | Student and faculty management |
| Students | Student profiles and academic information |
| Faculty | Faculty profiles and student access |
| Attendance | Attendance marking and tracking |
| Enrollments | Course/subject enrollment |
| Announcements | University announcements |
| Calendar | Academic calendar management |
| Dashboard | Admin statistics |

---

## 📊 Database Models

The main Sequelize models include:

- `User`
- `Student`
- `Faculty`
- `SubjectEnrollment`
- `Attendance`
- `Announcement`
- `Calendar`

These models represent the core entities and relationships of the university management system.

---

## 🔒 Security

The backend includes:

- Firebase authentication
- Role-based authorization
- Helmet security middleware
- CORS configuration
- Input validation
- Password hashing where applicable
- Environment-based configuration
- Protected API routes

---

## 🚀 Deployment

### Frontend

The React/Vite frontend is deployed on:

**Netlify**

### Backend

The Node.js/Express backend is deployed on:

**Render**

### Database

The MySQL database is hosted on:

**Railway**

### Authentication

Authentication is provided by:

**Firebase Authentication**

---

## 🎯 Project Highlights

This project demonstrates practical knowledge of:

- Full-stack web development
- REST API design
- Node.js and Express
- React.js
- Authentication and authorization
- Role-based access control
- MySQL database design
- Sequelize ORM
- CRUD operations
- File uploads
- CSV processing
- Attendance management
- API integration
- Cloud deployment
- Frontend-backend architecture

---

## 🔮 Future Improvements

- Add automated testing for backend APIs
- Introduce API documentation with Swagger/OpenAPI
- Add pagination and advanced search
- Improve database migrations
- Add centralized logging and monitoring
- Introduce Redis caching
- Add notifications for attendance and announcements
- Improve production deployment with CI/CD

---

## 📜 License

This project is intended for educational and portfolio purposes.

---

## 👨‍💻 Author

**Mayank Singh Rawat**

Built as a full-stack university campus management project demonstrating modern web development and backend engineering.
