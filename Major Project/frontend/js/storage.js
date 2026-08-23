/* =========================================================
   PULSECARE HEALTHCARE MANAGEMENT DASHBOARD
   storage.js

   CENTRAL DATA STORAGE

   Handles:
   - Doctors
   - Patients
   - Appointments
   - Departments
   - LocalStorage
   - Demo data
   - CRUD operations
   ========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {

    doctors:
        "pulsecare_doctors",

    patients:
        "pulsecare_patients",

    appointments:
        "pulsecare_appointments",

    departments:
        "pulsecare_departments",

    initialized:
        "pulsecare_initialized"

};


/* =========================================================
   GENERATE UNIQUE ID
========================================================= */

function generateId(prefix) {

    return (

        prefix +

        "_" +

        Date.now().toString(36) +

        "_" +

        Math.random()
            .toString(36)
            .substring(2, 7)

    );

}


/* =========================================================
   GENERIC GET DATA
========================================================= */

function getStoredData(key) {

    try {

        const data =
            localStorage.getItem(key);


        if (!data) {

            return [];

        }


        const parsed =
            JSON.parse(data);


        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "Storage read error:",
            error
        );

        return [];

    }

}


/* =========================================================
   GENERIC SAVE DATA
========================================================= */

function saveStoredData(
    key,
    data
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );


        return true;

    }

    catch (error) {

        console.error(
            "Storage save error:",
            error
        );

        return false;

    }

}


/* =========================================================
   ===================== DOCTORS ==========================
========================================================= */


/* GET ALL DOCTORS */

function getDoctors() {

    return getStoredData(
        STORAGE_KEYS.doctors
    );

}


/* GET DOCTOR BY ID */

function getDoctorById(id) {

    const doctors =
        getDoctors();


    return doctors.find(
        doctor =>
            String(doctor.id) ===
            String(id)
    ) || null;

}


/* ADD DOCTOR */

function addDoctor(
    doctorData
) {

    const doctors =
        getDoctors();


    const doctor = {

        id:
            generateId("DOC"),

        name:
            doctorData.name ||
            "New Doctor",

        department:
            doctorData.department ||
            "General Medicine",

        qualification:
            doctorData.qualification ||
            "MBBS",

        experience:
            doctorData.experience ||
            "1 Year",

        rating:
            doctorData.rating ||
            4.5,

        fee:
            Number(
                doctorData.fee ||
                500
            ),

        phone:
            doctorData.phone ||
            "",

        email:
            doctorData.email ||
            "",

        status:
            doctorData.status ||
            "Active",

        image:
            doctorData.image ||
            "assets/default-doctor.jpg"

    };


    doctors.push(
        doctor
    );


    saveStoredData(
        STORAGE_KEYS.doctors,
        doctors
    );


    return doctor;

}


/* UPDATE DOCTOR */

function updateDoctor(
    id,
    updatedData
) {

    const doctors =
        getDoctors();


    const index =
        doctors.findIndex(
            doctor =>
                String(doctor.id) ===
                String(id)
        );


    if (index === -1) {

        return null;

    }


    doctors[index] = {

        ...doctors[index],

        ...updatedData,

        id:
            doctors[index].id

    };


    saveStoredData(
        STORAGE_KEYS.doctors,
        doctors
    );


    return doctors[index];

}


/* DELETE DOCTOR */

function deleteDoctor(id) {

    const doctors =
        getDoctors();


    const filtered =
        doctors.filter(
            doctor =>
                String(doctor.id) !==
                String(id)
        );


    saveStoredData(
        STORAGE_KEYS.doctors,
        filtered
    );


    return true;

}


/* =========================================================
   ===================== PATIENTS =========================
========================================================= */


/* GET ALL PATIENTS */

function getPatients() {

    return getStoredData(
        STORAGE_KEYS.patients
    );

}


/* GET PATIENT BY ID */

function getPatientById(id) {

    const patients =
        getPatients();


    return patients.find(
        patient =>
            String(patient.id) ===
            String(id)
    ) || null;

}


/* ADD PATIENT */

function addPatient(
    patientData
) {

    const patients =
        getPatients();


    const patient = {

        id:
            generateId("PAT"),

        name:
            patientData.name ||
            "New Patient",

        age:
            Number(
                patientData.age ||
                0
            ),

        gender:
            patientData.gender ||
            "Other",

        bloodGroup:
            patientData.bloodGroup ||
            "O+",

        department:
            patientData.department ||
            "",

        phone:
            patientData.phone ||
            "",

        email:
            patientData.email ||
            "",

        address:
            patientData.address ||
            "",

        registeredAt:
            new Date()
                .toISOString()

    };


    patients.push(
        patient
    );


    saveStoredData(
        STORAGE_KEYS.patients,
        patients
    );


    return patient;

}


/* UPDATE PATIENT */

function updatePatient(
    id,
    updatedData
) {

    const patients =
        getPatients();


    const index =
        patients.findIndex(
            patient =>
                String(patient.id) ===
                String(id)
        );


    if (index === -1) {

        return null;

    }


    patients[index] = {

        ...patients[index],

        ...updatedData,

        id:
            patients[index].id

    };


    saveStoredData(
        STORAGE_KEYS.patients,
        patients
    );


    return patients[index];

}


/* DELETE PATIENT */

function deletePatient(id) {

    const patients =
        getPatients();


    const filtered =
        patients.filter(
            patient =>
                String(patient.id) !==
                String(id)
        );


    saveStoredData(
        STORAGE_KEYS.patients,
        filtered
    );


    return true;

}


/* =========================================================
   =================== APPOINTMENTS =======================
========================================================= */


/* GET ALL APPOINTMENTS */

function getAppointments() {

    return getStoredData(
        STORAGE_KEYS.appointments
    );

}


/* GET APPOINTMENT BY ID */

function getAppointmentById(id) {

    const appointments =
        getAppointments();


    return appointments.find(
        appointment =>
            String(
                appointment.id
            ) ===
            String(id)
    ) || null;

}


/* ADD APPOINTMENT */

function addAppointment(
    appointmentData
) {

    const appointments =
        getAppointments();


    const appointment = {

        id:
            generateId("APT"),

        patientId:
            appointmentData.patientId ||
            "",

        patientName:
            appointmentData.patientName ||
            "",

        doctorId:
            appointmentData.doctorId ||
            "",

        doctorName:
            appointmentData.doctorName ||
            "",

        department:
            appointmentData.department ||
            "",

        date:
            appointmentData.date ||
            "",

        time:
            appointmentData.time ||
            "",

        status:
            appointmentData.status ||
            "Pending",

        fee:
            Number(
                appointmentData.fee ||
                0
            ),

        reason:
            appointmentData.reason ||
            "",

        notes:
            appointmentData.notes ||
            "",

        createdAt:
            new Date()
                .toISOString()

    };


    appointments.push(
        appointment
    );


    saveStoredData(
        STORAGE_KEYS.appointments,
        appointments
    );


    return appointment;

}


/* UPDATE APPOINTMENT */

function updateAppointment(
    id,
    updatedData
) {

    const appointments =
        getAppointments();


    const index =
        appointments.findIndex(
            appointment =>
                String(
                    appointment.id
                ) ===
                String(id)
        );


    if (index === -1) {

        return null;

    }


    appointments[index] = {

        ...appointments[index],

        ...updatedData,

        id:
            appointments[index].id

    };


    saveStoredData(
        STORAGE_KEYS.appointments,
        appointments
    );


    return appointments[index];

}


/* DELETE APPOINTMENT */

function deleteAppointment(id) {

    const appointments =
        getAppointments();


    const filtered =
        appointments.filter(
            appointment =>
                String(
                    appointment.id
                ) !==
                String(id)
        );


    saveStoredData(
        STORAGE_KEYS.appointments,
        filtered
    );


    return true;

}


/* =========================================================
   =================== DEPARTMENTS =========================
========================================================= */


/* GET ALL DEPARTMENTS */

function getDepartments() {

    return getStoredData(
        STORAGE_KEYS.departments
    );

}


/* GET DEPARTMENT BY ID */

function getDepartmentById(id) {

    const departments =
        getDepartments();


    return departments.find(
        department =>
            String(
                department.id
            ) ===
            String(id)
    ) || null;

}


/* ADD DEPARTMENT */

function addDepartment(
    departmentData
) {

    const departments =
        getDepartments();


    const department = {

        id:
            generateId("DEP"),

        name:
            departmentData.name ||
            "New Department",

        headId:
            departmentData.headId ||
            "",

        headName:
            departmentData.headName ||
            "",

        status:
            departmentData.status ||
            "Active",

        description:
            departmentData.description ||
            ""

    };


    departments.push(
        department
    );


    saveStoredData(
        STORAGE_KEYS.departments,
        departments
    );


    return department;

}


/* UPDATE DEPARTMENT */

function updateDepartment(
    id,
    updatedData
) {

    const departments =
        getDepartments();


    const index =
        departments.findIndex(
            department =>
                String(
                    department.id
                ) ===
                String(id)
        );


    if (index === -1) {

        return null;

    }


    departments[index] = {

        ...departments[index],

        ...updatedData,

        id:
            departments[index].id

    };


    saveStoredData(
        STORAGE_KEYS.departments,
        departments
    );


    return departments[index];

}


/* DELETE DEPARTMENT */

function deleteDepartment(id) {

    const departments =
        getDepartments();


    const filtered =
        departments.filter(
            department =>
                String(
                    department.id
                ) !==
                String(id)
        );


    saveStoredData(
        STORAGE_KEYS.departments,
        filtered
    );


    return true;

}


/* =========================================================
   =================== DEMO DOCTORS ========================
========================================================= */

const DEFAULT_DOCTORS = [

    {
        id: "DOC001",

        name:
            "Dr. Ananya Sharma",

        department:
            "Cardiology",

        qualification:
            "MD, DM Cardiology",

        experience:
            "12 Years",

        rating:
            4.9,

        fee:
            1200,

        phone:
            "9876543210",

        email:
            "ananya@pulsecare.com",

        status:
            "Active",

        image:
            "assets/doctor-1.jpg"

    },


    {
        id: "DOC002",

        name:
            "Dr. Rahul Verma",

        department:
            "Neurology",

        qualification:
            "MBBS, MD Neurology",

        experience:
            "10 Years",

        rating:
            4.8,

        fee:
            1000,

        phone:
            "9876543211",

        email:
            "rahul@pulsecare.com",

        status:
            "Active",

        image:
            "assets/doctor-2.jpg"

    },


    {
        id: "DOC003",

        name:
            "Dr. Priya Reddy",

        department:
            "Orthopedics",

        qualification:
            "MBBS, MS Orthopedics",

        experience:
            "9 Years",

        rating:
            4.7,

        fee:
            900,

        phone:
            "9876543212",

        email:
            "priya@pulsecare.com",

        status:
            "Active",

        image:
            "assets/doctor-3.jpg"

    },


    {
        id: "DOC004",

        name:
            "Dr. Arjun Mehta",

        department:
            "Pediatrics",

        qualification:
            "MBBS, MD Pediatrics",

        experience:
            "8 Years",

        rating:
            4.8,

        fee:
            800,

        phone:
            "9876543213",

        email:
            "arjun@pulsecare.com",

        status:
            "Active",

        image:
            "assets/doctor-4.jpg"

    },


    {
        id: "DOC005",

        name:
            "Dr. Sneha Rao",

        department:
            "Dental",

        qualification:
            "BDS, MDS",

        experience:
            "7 Years",

        rating:
            4.6,

        fee:
            700,

        phone:
            "9876543214",

        email:
            "sneha@pulsecare.com",

        status:
            "Active",

        image:
            "assets/doctor-5.jpg"

    }

];


/* =========================================================
   =================== DEMO PATIENTS =======================
========================================================= */

const DEFAULT_PATIENTS = [

    {

        id:
            "PAT001",

        name:
            "Rohit Kumar",

        age:
            28,

        gender:
            "Male",

        bloodGroup:
            "O+",

        department:
            "Cardiology",

        phone:
            "9876500001",

        email:
            "rohit@example.com",

        address:
            "Vellore, Tamil Nadu"

    },


    {

        id:
            "PAT002",

        name:
            "Sneha Patel",

        age:
            34,

        gender:
            "Female",

        bloodGroup:
            "A+",

        department:
            "Neurology",

        phone:
            "9876500002",

        email:
            "sneha@example.com",

        address:
            "Chennai, Tamil Nadu"

    },


    {

        id:
            "PAT003",

        name:
            "Aditya Singh",

        age:
            41,

        gender:
            "Male",

        bloodGroup:
            "B+",

        department:
            "Orthopedics",

        phone:
            "9876500003",

        email:
            "aditya@example.com",

        address:
            "Bengaluru, Karnataka"

    },


    {

        id:
            "PAT004",

        name:
            "Kavya Reddy",

        age:
            25,

        gender:
            "Female",

        bloodGroup:
            "O-",

        department:
            "Pediatrics",

        phone:
            "9876500004",

        email:
            "kavya@example.com",

        address:
            "Hyderabad, Telangana"

    },


    {

        id:
            "PAT005",

        name:
            "Vikram Rao",

        age:
            52,

        gender:
            "Male",

        bloodGroup:
            "AB+",

        department:
            "Dental",

        phone:
            "9876500005",

        email:
            "vikram@example.com",

        address:
            "Vijayawada, Andhra Pradesh"

    },


    {

        id:
            "PAT006",

        name:
            "Meera Nair",

        age:
            31,

        gender:
            "Female",

        bloodGroup:
            "A-",

        department:
            "Cardiology",

        phone:
            "9876500006",

        email:
            "meera@example.com",

        address:
            "Kochi, Kerala"

    }

];


/* =========================================================
   ================= DEMO DEPARTMENTS ======================
========================================================= */

const DEFAULT_DEPARTMENTS = [

    {

        id:
            "DEP001",

        name:
            "Cardiology",

        headId:
            "DOC001",

        headName:
            "Dr. Ananya Sharma",

        status:
            "Active",

        description:
            "Specialized care for heart and cardiovascular conditions."

    },


    {

        id:
            "DEP002",

        name:
            "Neurology",

        headId:
            "DOC002",

        headName:
            "Dr. Rahul Verma",

        status:
            "Active",

        description:
            "Diagnosis and treatment of neurological disorders."

    },


    {

        id:
            "DEP003",

        name:
            "Orthopedics",

        headId:
            "DOC003",

        headName:
            "Dr. Priya Reddy",

        status:
            "Active",

        description:
            "Comprehensive treatment for bones, joints and muscles."

    },


    {

        id:
            "DEP004",

        name:
            "Pediatrics",

        headId:
            "DOC004",

        headName:
            "Dr. Arjun Mehta",

        status:
            "Active",

        description:
            "Specialized healthcare services for children and infants."

    },


    {

        id:
            "DEP005",

        name:
            "Dental",

        headId:
            "DOC005",

        headName:
            "Dr. Sneha Rao",

        status:
            "Active",

        description:
            "Complete dental care, diagnosis and oral health services."

    }

];


/* =========================================================
   ================= DEMO APPOINTMENTS =====================
========================================================= */

const DEFAULT_APPOINTMENTS = [

    {

        id:
            "APT001",

        patientId:
            "PAT001",

        patientName:
            "Rohit Kumar",

        doctorId:
            "DOC001",

        doctorName:
            "Dr. Ananya Sharma",

        department:
            "Cardiology",

        date:
            getRelativeDate(0),

        time:
            "10:00",

        status:
            "Confirmed",

        fee:
            1200,

        reason:
            "Routine cardiac consultation",

        notes:
            "Follow-up consultation."

    },


    {

        id:
            "APT002",

        patientId:
            "PAT002",

        patientName:
            "Sneha Patel",

        doctorId:
            "DOC002",

        doctorName:
            "Dr. Rahul Verma",

        department:
            "Neurology",

        date:
            getRelativeDate(1),

        time:
            "11:30",

        status:
            "Pending",

        fee:
            1000,

        reason:
            "Frequent headaches",

        notes:
            ""

    },


    {

        id:
            "APT003",

        patientId:
            "PAT003",

        patientName:
            "Aditya Singh",

        doctorId:
            "DOC003",

        doctorName:
            "Dr. Priya Reddy",

        department:
            "Orthopedics",

        date:
            getRelativeDate(2),

        time:
            "14:00",

        status:
            "Completed",

        fee:
            900,

        reason:
            "Knee pain evaluation",

        notes:
            "X-ray reviewed."

    },


    {

        id:
            "APT004",

        patientId:
            "PAT004",

        patientName:
            "Kavya Reddy",

        doctorId:
            "DOC004",

        doctorName:
            "Dr. Arjun Mehta",

        department:
            "Pediatrics",

        date:
            getRelativeDate(-1),

        time:
            "09:30",

        status:
            "Cancelled",

        fee:
            800,

        reason:
            "Child health consultation",

        notes:
            "Patient requested cancellation."

    },


    {

        id:
            "APT005",

        patientId:
            "PAT005",

        patientName:
            "Vikram Rao",

        doctorId:
            "DOC005",

        doctorName:
            "Dr. Sneha Rao",

        department:
            "Dental",

        date:
            getRelativeDate(3),

        time:
            "16:00",

        status:
            "Confirmed",

        fee:
            700,

        reason:
            "Dental check-up",

        notes:
            ""

    }

];


/* =========================================================
   RELATIVE DATE HELPER
========================================================= */

function getRelativeDate(
    offset
) {

    const date =
        new Date();


    date.setDate(
        date.getDate() +
        offset
    );


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    const day =
        String(
            date.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return (
        `${year}-${month}-${day}`
    );

}


/* =========================================================
   INITIALIZE DEFAULT DATA
========================================================= */

function initializeDefaultData() {

    /*
       Only initialize if the
       corresponding LocalStorage
       item does not already exist.
    */


    if (
        !localStorage.getItem(
            STORAGE_KEYS.doctors
        )
    ) {

        saveStoredData(
            STORAGE_KEYS.doctors,
            DEFAULT_DOCTORS
        );

    }


    if (
        !localStorage.getItem(
            STORAGE_KEYS.patients
        )
    ) {

        saveStoredData(
            STORAGE_KEYS.patients,
            DEFAULT_PATIENTS
        );

    }


    if (
        !localStorage.getItem(
            STORAGE_KEYS.departments
        )
    ) {

        saveStoredData(
            STORAGE_KEYS.departments,
            DEFAULT_DEPARTMENTS
        );

    }


    if (
        !localStorage.getItem(
            STORAGE_KEYS.appointments
        )
    ) {

        saveStoredData(
            STORAGE_KEYS.appointments,
            DEFAULT_APPOINTMENTS
        );

    }


    localStorage.setItem(
        STORAGE_KEYS.initialized,
        "true"
    );

}


/* =========================================================
   INITIALIZE STORAGE
========================================================= */

initializeDefaultData();


/* =========================================================
   RESET DEMO DATA
   Useful during development/testing.
========================================================= */

function resetPulseCareData() {

    const confirmed =
        confirm(
            "Reset all PulseCare demo data? This will remove any changes you made."
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        STORAGE_KEYS.doctors
    );

    localStorage.removeItem(
        STORAGE_KEYS.patients
    );

    localStorage.removeItem(
        STORAGE_KEYS.appointments
    );

    localStorage.removeItem(
        STORAGE_KEYS.departments
    );


    initializeDefaultData();


    alert(
        "PulseCare demo data has been reset."
    );


    window.location.reload();

}


/* =========================================================
   STORAGE DEBUG INFORMATION
========================================================= */

function getStorageSummary() {

    return {

        doctors:
            getDoctors().length,

        patients:
            getPatients().length,

        appointments:
            getAppointments().length,

        departments:
            getDepartments().length

    };

}


/* =========================================================
   GLOBAL STORAGE API
========================================================= */

window.PulseCareStorage = {

    getDoctors,

    getDoctorById,

    addDoctor,

    updateDoctor,

    deleteDoctor,


    getPatients,

    getPatientById,

    addPatient,

    updatePatient,

    deletePatient,


    getAppointments,

    getAppointmentById,

    addAppointment,

    updateAppointment,

    deleteAppointment,


    getDepartments,

    getDepartmentById,

    addDepartment,

    updateDepartment,

    deleteDepartment,


    resetPulseCareData,

    getStorageSummary

};