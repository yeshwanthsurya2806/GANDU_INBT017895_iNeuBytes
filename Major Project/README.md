# 🏥 PulseCare - Full-Stack Healthcare Management System

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Structure-orange?style=for-the-badge&logo=html5">
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?style=for-the-badge&logo=css3">
  <img src="https://img.shields.io/badge/JavaScript-Functionality-yellow?style=for-the-badge&logo=javascript">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express">
  <img src="https://img.shields.io/badge/SQLite-Database-blue?style=for-the-badge&logo=sqlite">
  <img src="https://img.shields.io/badge/REST%20API-Backend-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/Responsive-Design-success?style=for-the-badge">
</p>

---

# 📌 Project Overview

**PulseCare - Full-Stack Healthcare Management System** is a complete healthcare management web application designed to manage doctors, patients, appointments, departments, authentication, dashboards, notifications, and healthcare records.

The project evolved from the earlier frontend-based healthcare management applications and introduces a complete **backend architecture with REST APIs, authentication, role-based access control, and SQLite database integration**.

The system provides separate functionality for different user roles and allows healthcare operations to be managed through a centralized and responsive web interface.

---

# 🎯 Objectives

- Build a complete full-stack healthcare management system.
- Develop a responsive and professional healthcare interface.
- Implement frontend and backend integration.
- Build RESTful APIs using Node.js and Express.js.
- Implement SQLite database management.
- Implement secure user authentication.
- Implement role-based access control.
- Manage doctors, patients, appointments, and departments.
- Implement appointment scheduling and status management.
- Implement dynamic dashboard statistics.
- Implement healthcare reports.
- Implement notification functionality.
- Practice database-driven application development.
- Strengthen JavaScript and backend development skills.
- Learn complete Git & GitHub project workflow.

---

# ✨ Features

- 🏥 Healthcare Management Dashboard
- 🔐 User Authentication
- 👑 Admin Management
- 👨‍⚕️ Doctor Management
- 👤 Patient Management
- 📅 Appointment Management
- 🏢 Department Management
- 📊 Reports & Statistics
- 🔔 Notifications
- 🔍 Search Functionality
- 🎯 Filtering Functionality
- ➕ Add Records
- ✏️ Edit Records
- 🗑️ Delete Records
- 📋 Appointment Status Management
- 💰 Consultation Fee Management
- 📝 Appointment Reason & Notes
- 🗄️ SQLite Database
- 🔗 REST API Integration
- 🛡️ Role-Based Access Control
- 📱 Responsive Design
- 🎨 Modern Healthcare UI

---

# 🔐 Authentication & Authorization

PulseCare implements user authentication and role-based authorization.

The system supports different user roles:

- 👑 Administrator
- 👨‍⚕️ Doctor
- 👤 Patient

Authentication is handled through the backend, while protected API routes verify the user's authentication and role before allowing access to restricted operations.

---

# 👑 Admin Dashboard

The administrator has access to the complete healthcare management system.

### Admin Features

- Dashboard
- Doctor Management
- Patient Management
- Appointment Management
- Department Management
- Reports
- Notifications
- Healthcare Statistics
- Search & Filtering
- CRUD Operations

---

# 👨‍⚕️ Doctor Management

Administrators can manage doctor records through the Doctor Management module.

### Features

- View doctors
- Add new doctors
- Edit doctor information
- Delete doctors
- Search doctors
- Filter doctors
- Manage department
- Manage qualification
- Manage experience
- Manage consultation fee
- Manage doctor status

---

# 👤 Patient Management

The Patient Management module allows healthcare records to be managed through the application.

### Features

- View patients
- Add patients
- Edit patient information
- Delete patients
- Search patients
- Manage patient details
- Manage patient contact information
- Manage patient records

---

# 📅 Appointment Management

The Appointment Management module provides complete appointment scheduling and management functionality.

### Features

- View appointments
- Create appointments
- Edit appointments
- Delete appointments
- Search appointments
- Filter appointments
- Manage appointment date
- Manage appointment time
- Manage appointment status
- Manage consultation fee
- Add appointment reason
- Add appointment notes
- View appointment information

### Appointment Status

Appointments can have the following statuses:

- Pending
- Confirmed
- Completed
- Cancelled

---

# 🏢 Department Management

The Department Management module allows administrators to manage healthcare departments.

### Features

- View departments
- Add departments
- Edit departments
- Delete departments
- Search departments
- Manage department status
- View department statistics
- View doctor count by department
- View patient count by department

---

# 📊 Reports & Statistics

PulseCare provides healthcare statistics and reporting functionality.

### Statistics Include

- Total doctors
- Total patients
- Total appointments
- Pending appointments
- Confirmed appointments
- Completed appointments
- Department statistics
- Doctor statistics
- Patient statistics
- Appointment statistics

---

# 🔔 Notifications

The system includes notification functionality for healthcare-related activities.

Notifications can be retrieved through backend APIs and displayed to authenticated users.

---

# 🗄️ Database

PulseCare uses **SQLite** as its database.

The database stores application information including:

- Users
- Doctors
- Patients
- Departments
- Appointments
- Notifications
- Authentication-related data

The database schema is maintained in:

```text
database/
└── schema.sql
```

The application uses the SQLite database through the backend database configuration.

---

# 🔗 Backend API

The backend is developed using **Node.js and Express.js**.

The application provides REST API endpoints for:

- Authentication
- Admin operations
- Doctor operations
- Patient operations
- Appointment management
- Department management
- Notifications

The API layer connects the frontend application with the SQLite database.

---

# 🛡️ Role-Based Access Control

The backend implements role-based authorization to restrict access to protected resources.

Different roles have different permissions.

```text
                    PulseCare
                       │
                 Authentication
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
        Admin        Doctor       Patient
          │            │            │
          ▼            ▼            ▼
       Full         Doctor       Patient
    Management     Features      Features
```

---

# 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Frontend Structure |
| CSS3 | Styling & Responsive Design |
| JavaScript ES6 | Frontend Functionality |
| Node.js | Backend Runtime |
| Express.js | Backend Framework |
| REST API | Frontend-Backend Communication |
| SQLite | Database |
| better-sqlite3 | SQLite Database Integration |
| bcrypt | Password Hashing |
| Git | Version Control |
| GitHub | Repository Hosting |
| Visual Studio Code | Development Environment |

---

# 📂 Project Structure

```text
Major Project/
│
├── backend/
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── initDatabase.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── doctor.js
│   │   ├── notifications.js
│   │   └── patient.js
│   │
│   ├── seed.js
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   │
│   ├── assets/
│   │   └── favicon.png
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   ├── departments.js
│   │   ├── doctors.js
│   │   ├── main.js
│   │   ├── patient-dashboard.js
│   │   ├── patients.js
│   │   ├── reports.js
│   │   └── storage.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── doctor-dashboard.html
│   ├── patient-dashboard.html
│   ├── doctors.html
│   ├── patients.html
│   ├── appointments.html
│   ├── departments.html
│   └── reports.html
│
├── package.json
├── package-lock.json
└── README.md
```

---

# 🔄 Application Workflow

```text
                         PulseCare
                            │
                            ▼
                       Login Page
                            │
                            ▼
                    Authentication API
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
              Admin       Doctor      Patient
                │           │           │
                ▼           ▼           ▼
           Dashboard    Dashboard    Dashboard
                │
      ┌─────────┼─────────┬────────────┐
      │         │         │            │
      ▼         ▼         ▼            ▼
   Doctors   Patients  Appointments Departments
      │         │         │            │
      └─────────┴─────────┴────────────┘
                            │
                            ▼
                       REST APIs
                            │
                            ▼
                       SQLite DB
```

---

# 🔄 Frontend & Backend Architecture

```text
User
  │
  ▼
Frontend
HTML + CSS + JavaScript
  │
  ▼
Fetch API
  │
  ▼
Express.js REST API
  │
  ▼
Authentication Middleware
  │
  ▼
Route Controllers
  │
  ▼
SQLite Database
```

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile Devices

The interface uses responsive CSS techniques to provide a consistent user experience across different screen sizes.

---

# 🧪 Testing

The application was tested across its major modules.

### Authentication Testing

- Login functionality
- Authentication validation
- Role-based access
- Protected route validation
- Invalid login handling
- Session/cookie handling

### Doctor Testing

- Add doctor
- Edit doctor
- Delete doctor
- Search doctor
- Filter doctor
- Doctor status management
- Database persistence

### Patient Testing

- Add patient
- Edit patient
- Delete patient
- Search patient
- Patient information management
- Database persistence

### Appointment Testing

- Create appointment
- Edit appointment
- Delete appointment
- Search appointments
- Filter appointments
- Update appointment status
- Appointment date and time management
- Consultation fee management
- Database persistence

### Department Testing

- Add department
- Edit department
- Delete department
- Search departments
- Manage department status
- Department statistics
- Database persistence

### Backend Testing

- API request validation
- Authentication middleware
- Role authorization
- Database operations
- Error handling
- CRUD API operations

---

# 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/yeshwanthsurya2806/GANDU_INBT017895_iNeuBytes.git
```

### 2. Navigate to the Major Project

```bash
cd "Major Project"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Initialize the database

```bash
node backend/config/initDatabase.js
```

### 5. Start the application

```bash
node backend/server.js
```

### 6. Open the application

Open the URL provided by the server in your browser.

```text
http://localhost:5000
```

---

# 📌 Important Notes

- The SQLite database is used for persistent application data.
- Dependencies are installed using `npm install`.
- Authentication is handled through the backend.
- Protected APIs require appropriate authentication and authorization.
- Database files generated during development are excluded from Git using `.gitignore`.

---

# 📚 Learning Outcomes

Through this project, I learned:

- Full-Stack Web Development
- Frontend & Backend Integration
- REST API Development
- Node.js
- Express.js
- SQLite Database Management
- SQL Queries
- Database Schema Design
- CRUD Operations
- Authentication
- Role-Based Access Control
- Password Hashing
- JavaScript DOM Manipulation
- Fetch API
- Form Validation
- Search & Filtering
- Dashboard Development
- Responsive Web Design
- Error Handling
- Debugging
- Git & GitHub Workflow

---

# 🔮 Future Improvements

- Advanced role-based permissions
- Email notifications
- SMS notifications
- Appointment reminders
- Doctor availability calendar
- Online consultation
- Video consultation
- Payment gateway
- Prescription management
- Medical history management
- Advanced analytics
- Cloud deployment
- Cloud database
- Automated backups
- Mobile application
- Dark mode

---

# 👨‍💻 Author

**G. Yeshwanth Surya**

B.Tech Computer Science and Engineering (IoT)

Vellore Institute of Technology, Vellore

**GitHub:**

https://github.com/yeshwanthsurya2806

**LinkedIn:**

https://www.linkedin.com/in/yeshwanthsurya/

---

# 🌐 Live Demo

**Application:**

*(Add deployed application URL here)*

**GitHub Repository:**

https://github.com/yeshwanthsurya2806/GANDU_INBT017895_iNeuBytes

---

# 📜 Internship Information

**Organization:** iNeuBytes

**Program:** Virtual iNeuBytes Internship Program (VIIP)

**Project:** PulseCare - Full-Stack Healthcare Management System

**Domain:** Web Development

**Project Type:** Major Project

---

## ⭐ If you like this project, consider giving it a Star on GitHub!
