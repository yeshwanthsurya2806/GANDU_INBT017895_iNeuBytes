// ======================================================
// PulseCare Healthcare Management System
// storage.js
//
// This file provides helper functions for managing
// appointment data using the browser's localStorage.
//
// Functions:
// • saveAppointment()
// • getAppointments()
// • clearAppointments()
// ======================================================


// ==============================
// LOCAL STORAGE KEY
// ==============================
const APPOINTMENTS_KEY = "appointments";


// ==============================
// SAVE APPOINTMENT
// ==============================
function saveAppointment(appointment) {

    const appointments = getAppointments();

    appointments.push(appointment);

    localStorage.setItem(
        APPOINTMENTS_KEY,
        JSON.stringify(appointments)
    );

}


// ==============================
// GET ALL APPOINTMENTS
// ==============================
function getAppointments() {

    return JSON.parse(
        localStorage.getItem(APPOINTMENTS_KEY)
    ) || [];

}


// ==============================
// CLEAR ALL APPOINTMENTS
// ==============================
function clearAppointments() {

    localStorage.removeItem(APPOINTMENTS_KEY);

}