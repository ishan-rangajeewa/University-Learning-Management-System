# UniLms

A full-stack Learning Management System built with a layered Spring Boot backend and a React + Redux Toolkit frontend. Supports Admin, Lecturer, and Student roles with JWT authentication, course management, enrollment, file-upload assignment submissions, and grading.

## Tech Stack

**Backend**
- Java 19, Spring Boot
- Spring Security with JWT authentication
- Spring Data JPA + MySQL
- Layered architecture: Domain, Application, Infrastructure, Presentation
- Spring Mail (Gmail SMTP) for OTP-based password reset

**Frontend**
- React 19 + Vite
- Redux Toolkit (RTK Query) for state and API calls
- React Router DOM
- Tailwind CSS

## Features

- **Authentication & Accounts**
  - JWT-based login and registration
  - Role-based access control (Admin, Lecturer, Student)
  - Default admin account auto-created on first startup
  - Change password (logged in)
  - Forgot password via emailed OTP
- **Courses**
  - Lecturers create and manage courses
  - Course materials (file upload)
- **Enrollment**
  - Students self-enroll and unenroll
  - Admins/Lecturers manage enrollment directly (bulk enroll, unenroll)
- **Assignments & Grading**
  - Lecturers create assignments
  - Students submit work via file upload
  - Lecturers grade submissions with marks and feedback

## Project Structure

```
UniLms/
├── backend/          Spring Boot API
└── lms-frontend/      React frontend
```

## Getting Started

### Prerequisites

- Java 19+
- Node.js 18+
- MySQL 8+
- Maven (or use the included `mvnw` wrapper)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the example config and fill in your own values:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

3. Edit `application.properties` with your own:
   - MySQL username/password
   - A generated JWT secret (`openssl rand -base64 64`)
   - Gmail SMTP credentials (a Gmail **App Password**, not your normal password — requires 2-Step Verification enabled on the Google account)
   - Default admin credentials (created automatically on first run)

4. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   The API starts on `http://localhost:8080`. A default admin account is created automatically on first startup using the credentials in `application.properties`.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd lms-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Run the frontend:
   ```bash
   npm run dev
   ```
   The app starts on `http://localhost:5173` (default Vite port).

## Roles

| Role | Capabilities |
|---|---|
| **Admin** | Manage lecturer accounts, manage enrollment for any course, full access |
| **Lecturer** | Create/manage own courses, materials, and assignments; manage enrollment; grade submissions |
| **Student** | Browse and enroll in courses, view materials, submit assignments |

## Security Notes

- `application.properties` is gitignored and never committed — use `application.properties.example` as a template.
- Passwords are hashed with BCrypt.
- JWT is required for all endpoints except login, register, forgot-password, and reset-password.
- Password reset OTPs are single-use, expire after 5 minutes, and are stored in memory (not persisted to the database).

## License

This project was built as a portfolio/learning project.
