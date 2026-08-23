# 🏥 PulseCare - Healthcare Management Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Structure-orange?style=for-the-badge&logo=html5">
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?style=for-the-badge&logo=css3">
  <img src="https://img.shields.io/badge/JavaScript-Functionality-yellow?style=for-the-badge&logo=javascript">
  <img src="https://img.shields.io/badge/LocalStorage-Data-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/Responsive-Design-success?style=for-the-badge">
</p>

---

# 📌 Project Overview

**PulseCare - Healthcare Management Dashboard** is a responsive healthcare administration dashboard developed as part of the **iNeuBytes Web Development Internship (Task 3)**.

The application provides a centralized interface for managing healthcare operations such as doctors, patients, appointments, departments, reports, and dashboard statistics.

The project focuses on creating a clean and professional administrative interface while implementing dynamic functionality using **HTML, CSS, and JavaScript**.

---

# 🎯 Objectives

- Build a complete healthcare management dashboard.
- Develop a professional administrative interface.
- Implement CRUD operations using JavaScript.
- Manage doctors, patients, appointments, and departments.
- Implement search and filtering functionality.
- Create dynamic dashboard statistics.
- Practice DOM manipulation and event handling.
- Implement Local Storage for persistent data management.
- Develop responsive healthcare management pages.
- Improve JavaScript programming and frontend development skills.
- Strengthen Git and GitHub workflow.

---

# ✨ Features

## 📊 Dashboard

- Healthcare management dashboard
- Total doctors statistics
- Total patients statistics
- Total appointments statistics
- Department statistics
- Appointment status statistics
- Quick navigation
- Recent healthcare information
- Responsive sidebar navigation

---

## 👨‍⚕️ Doctor Management

- View doctor records
- Add new doctors
- Edit doctor information
- Delete doctors
- Search doctors
- Filter doctors
- Manage doctor details
- Manage doctor department
- Manage consultation information
- Doctor status management

---

## 👤 Patient Management

- View patient records
- Add new patients
- Edit patient information
- Delete patients
- Search patients
- Manage patient details
- Patient information display
- Patient record management

---

## 📅 Appointment Management

- View appointments
- Create new appointments
- Edit appointments
- Delete appointments
- Search appointments
- Filter appointments
- Appointment date and time management
- Appointment status management
- Consultation fee management
- Appointment reason
- Appointment notes
- Appointment history

### Appointment Status

Appointments can have different statuses:

```text
Pending
Confirmed
Completed
Cancelled
🏥 Department Management
View departments
Add departments
Edit departments
Delete departments
Search departments
Department status management
Department statistics
Doctor count by department
Patient count by department
📈 Reports & Statistics
Healthcare statistics
Doctor statistics
Patient statistics
Appointment statistics
Department statistics
Dashboard analytics
Data-based summaries
🔍 Search & Filtering

The dashboard provides dynamic search and filtering functionality for healthcare records.

Supported operations include:

Doctor search
Patient search
Appointment search
Department search
Status filtering
Department filtering
Date filtering
💾 Local Storage

The application uses the browser's Local Storage API to maintain application data.

Local Storage is used for:

Doctor records
Patient records
Appointment records
Department records

This allows data to remain available after refreshing the browser.

🛠️ Technologies Used
Technology	Purpose
HTML5	Page Structure
CSS3	Styling
JavaScript ES6	Dynamic Functionality
DOM API	Dynamic UI Manipulation
Local Storage	Data Persistence
Git	Version Control
GitHub	Repository Hosting
Visual Studio Code	Development Environment
📂 Project Structure
Task 3/
│
├── assets/
│   └── favicon.png
│
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── doctors.js
│   ├── patients.js
│   ├── appointments.js
│   ├── departments.js
│   ├── reports.js
│   ├── storage.js
│   └── ...
│
├── index.html
├── doctors.html
├── patients.html
├── appointments.html
├── departments.html
├── reports.html
└── README.md
🏗️ Application Modules

The application is divided into several major modules:

                    PulseCare
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      Dashboard     Management    Reports
                       │
          ┌────────────┼─────────────┐
          │            │             │
          ▼            ▼             ▼
       Doctors      Patients    Appointments
          │            │             │
          └────────────┼─────────────┘
                       │
                       ▼
                  Departments
🔄 Project Workflow
Dashboard
    │
    ▼
Select Management Module
    │
    ├── Doctors
    │      │
    │      ├── Add
    │      ├── Edit
    │      ├── Search
    │      └── Delete
    │
    ├── Patients
    │      │
    │      ├── Add
    │      ├── Edit
    │      ├── Search
    │      └── Delete
    │
    ├── Appointments
    │      │
    │      ├── Add
    │      ├── Edit
    │      ├── Search
    │      ├── Filter
    │      └── Delete
    │
    └── Departments
           │
           ├── Add
           ├── Edit
           ├── Search
           └── Delete
📱 Responsive Design

The application is designed to provide a consistent experience across different screen sizes.

Supported devices include:

💻 Desktop
💻 Laptop
📱 Tablet
📱 Mobile Devices

Responsive CSS techniques are used to adapt the layout and navigation according to screen size.

🧪 Testing

The application was tested across its major modules.

Dashboard Testing
Dashboard loads correctly
Statistics are displayed
Navigation works correctly
Dashboard data updates dynamically
Doctor Testing
Add doctor
Edit doctor
Delete doctor
Search doctor
Filter doctor
Validate doctor information
Patient Testing
Add patient
Edit patient
Delete patient
Search patient
Validate patient information
Appointment Testing
Create appointment
Edit appointment
Delete appointment
Search appointments
Filter appointments
Update appointment status
Validate appointment information
Department Testing
Add department
Edit department
Delete department
Search departments
Manage department status
Display department statistics
UI Testing
Navigation testing
Modal testing
Form validation
Search functionality
Filter functionality
Responsive layout testing
Browser refresh testing
Local Storage persistence testing
📸 Project Screenshots
📊 Dashboard

(Add Dashboard Screenshot Here)

👨‍⚕️ Doctor Management

(Add Doctor Management Screenshot Here)

👤 Patient Management

(Add Patient Management Screenshot Here)

📅 Appointment Management

(Add Appointment Management Screenshot Here)

🏥 Department Management

(Add Department Management Screenshot Here)

📈 Reports

(Add Reports Screenshot Here)

🚀 How to Run the Project
1. Clone the repository
git clone https://github.com/yeshwanthsurya2806/GANDU_INBT017895_iNeuBytes.git
2. Navigate to the Task 3 directory
Task 3
3. Open the main HTML file
index.html
4. Run the project

Open index.html using a browser or use Visual Studio Code Live Server for a better development experience.

No backend installation is required for this task.

📚 Learning Outcomes

Through this project, I gained practical experience in:

JavaScript DOM manipulation
JavaScript CRUD operations
Local Storage API
Dynamic table generation
Search and filtering
Form handling
Form validation
Event handling
Dashboard development
Healthcare management UI design
Responsive web design
Data management
Modular JavaScript organization
Git and GitHub workflow
Debugging and problem solving
🔮 Future Improvements

The following features could be added in future versions:

Backend integration
MySQL / SQLite database
Secure authentication
Role-based access control
Doctor dashboard
Patient dashboard
Appointment notifications
Email notifications
Online appointment booking
Advanced healthcare reports
Cloud database integration
API integration
Online consultation
Payment integration
👨‍💻 Author

G. Yeshwanth Surya

B.Tech Computer Science and Engineering (IoT)

Vellore Institute of Technology, Vellore

GitHub:

https://github.com/yeshwanthsurya2806

LinkedIn:

(Add your LinkedIn Profile Link)

🌐 Live Demo

GitHub Pages:

(Add your GitHub Pages URL after deployment)

📜 Internship Information

Organization: iNeuBytes

Program: Virtual iNeuBytes Internship Program (VIIP)

Domain: Web Development

Task: Task 3 – Healthcare Management Dashboard

⭐ If you like this project, consider giving it a Star on GitHub!
