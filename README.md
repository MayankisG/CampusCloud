# 🎓 University Campus Management System
### Full-Stack Role-Based Campus Operations Platform

![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Firebase](https://img.shields.io/badge/Auth-Firebase-orange)
![Render](https://img.shields.io/badge/Backend%20Hosting-Render-purple)
![Netlify](https://img.shields.io/badge/Frontend%20Hosting-Netlify-green)
![Railway](https://img.shields.io/badge/Database-Railway-red)
![Status](https://img.shields.io/badge/Status-Active-success)

A **full-stack university management platform** that centralizes academic operations including **student management, faculty operations, course handling, attendance tracking, and announcements**, all secured through role-based access control.

The system is designed for real-world deployment and demonstrates full-stack development, API integration, authentication, and scalable system design.

---

## 📖 Overview

The **University Campus Management System** simplifies campus administration by providing a centralized system accessible to:

- Administrators
- Faculty Members
- Students

Each role has dedicated functionalities ensuring structured academic workflow and secure access.

---

## Deployment Note

The backend is hosted on **Render free tier**, which may experience **cold start delays**.

 First request may take **2–3 minutes** to initialize.  
If the application does not load immediately, please refresh after backend startup.

For a faster overview, watching the demo video is recommended.
🎥 Demo Video
https://www.youtube.com/watch?v=pYJvBpXoFwQ

## Key Features

### Authentication & Security
- Firebase Authentication integration
- Secure login system
- Role-based access control
- Protected API access

---

## 👥 Role-Based Modules

### 🛠 Admin Module
Administrative control over university operations:

- Faculty enrollment and management
- Student enrollment and management
- Course creation and configuration
- Course enrollment management
- Assigning faculty to courses
- Publishing announcements

---
### Faculty Module
Faculty members manage academic activities:

- Mark student attendance
- View assigned courses
- Manage attendance records
- Faculty profile management

---

### 🎓 Student Module
Students access academic information:

- Course enrollment
- Attendance tracking
- Announcement viewing
- Student profile management

---

## 🏗 System Architecture
User
│
▼
React Frontend (Netlify)
│
├── Authentication → Firebase Auth
│
▼
Spring Boot Backend APIs (Render)
│
▼
MySQL Database 

---
---

## 🧰 Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- REST APIs
- Maven
- Hosted on Render

### Frontend
- React.js
- Vite
- Axios
- Tailwind CSS / CSS
- Hosted on Netlify

### Database
- Railway MySQL Cloud Database

### Authentication
- Firebase Authentication

---

## 🌐 Live Links

🔗 **Live Application**  
https://mayank-singh-rawat.netlify.app/

🎥 **Demo Video**  
https://www.youtube.com/watch?v=pYJvBpXoFwQ

*(Recommended due to backend cold start delay.)*

---

## ⚙️ Application Workflow

1. Users log in via Firebase Authentication.
2. Role-based access determines allowed operations.
3. Admin manages courses, users, and announcements.
4. Faculty manages attendance and courses.
5. Students track courses and attendance.
6. All modules communicate via REST APIs.

---

## ⚡ Getting Started (Local Setup)

### Prerequisites
Ensure the following are installed:

- Java 21+
- Node.js & npm
- Maven
- Git

---

## 🔧 Backend Setup

```bash
# Clone repository
git clone <repository-url>

# Navigate to backend folder
cd backend

# Build project
mvn clean install

# Run backend
mvn spring-boot:run

## Frontend Setup
Open another terminal window and run:
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
