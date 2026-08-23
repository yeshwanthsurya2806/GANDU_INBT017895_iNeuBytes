-- =========================================================
-- PULSECARE HEALTHCARE MANAGEMENT SYSTEM
-- DATABASE SCHEMA
-- =========================================================

PRAGMA foreign_keys = ON;

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    role TEXT NOT NULL
        CHECK (role IN ('patient', 'doctor', 'admin')),

    phone TEXT,

    profile_picture TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- DEPARTMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    description TEXT,

    status TEXT NOT NULL DEFAULT 'Active'
        CHECK (status IN ('Active', 'Inactive')),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- PATIENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL UNIQUE,

    date_of_birth TEXT,

    gender TEXT,

    blood_group TEXT,

    address TEXT,

    emergency_contact TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- DOCTORS
-- =========================================================

CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL UNIQUE,

    department_id INTEGER,

    qualification TEXT,

    experience INTEGER DEFAULT 0,

    consultation_fee REAL DEFAULT 0,

    specialization TEXT,

    status TEXT NOT NULL DEFAULT 'Active'
        CHECK (status IN ('Active', 'Inactive')),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE SET NULL
);


-- =========================================================
-- APPOINTMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    patient_id INTEGER NOT NULL,

    doctor_id INTEGER NOT NULL,

    appointment_date TEXT NOT NULL,

    appointment_time TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (
            status IN (
                'Pending',
                'Confirmed',
                'Completed',
                'Cancelled'
            )
        ),

    reason TEXT NOT NULL,

    consultation_fee REAL DEFAULT 0,

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE,

    FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
);


-- =========================================================
-- MEDICAL RECORDS
-- =========================================================

CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    patient_id INTEGER NOT NULL,

    doctor_id INTEGER NOT NULL,

    appointment_id INTEGER,

    diagnosis TEXT,

    prescription TEXT,

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE,

    FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE,

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(id)
        ON DELETE SET NULL
);


-- =========================================================
-- NOTIFICATIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER NOT NULL,

    title TEXT NOT NULL,

    message TEXT NOT NULL,

    type TEXT DEFAULT 'general',

    is_read INTEGER DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_role
ON users(role);

CREATE INDEX IF NOT EXISTS idx_appointments_patient
ON appointments(patient_id);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor
ON appointments(doctor_id);

CREATE INDEX IF NOT EXISTS idx_appointments_date
ON appointments(appointment_date);

CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(user_id);