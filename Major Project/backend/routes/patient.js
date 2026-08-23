const express = require("express");
const db = require("../config/database");
const { requireRole } = require("../middleware/auth");

const router = express.Router();


// =========================================================
// GET PATIENT PROFILE
// =========================================================

router.get(
    "/profile",
    requireRole("patient"),
    (req, res) => {
        try {
            const patient = db.prepare(`
                SELECT
                    p.id,
                    p.user_id,
                    p.date_of_birth,
                    p.gender,
                    p.blood_group,
                    p.address,
                    p.emergency_contact,
                    u.name,
                    u.email,
                    u.phone,
                    u.profile_picture
                FROM patients p
                INNER JOIN users u
                    ON p.user_id = u.id
                WHERE p.user_id = ?
            `).get(req.session.user.id);

            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient profile not found"
                });
            }

            return res.json({
                success: true,
                patient
            });

        } catch (error) {
            console.error("Patient profile error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to load patient profile"
            });
        }
    }
);


// =========================================================
// PATIENT DASHBOARD
// Includes statistics + appointments
// =========================================================

router.get(
    "/dashboard",
    requireRole("patient"),
    (req, res) => {
        try {

            // -------------------------------------------------
            // FIND PATIENT
            // -------------------------------------------------

            const patient = db.prepare(`
                SELECT
                    p.id,
                    p.user_id,
                    p.date_of_birth,
                    p.gender,
                    p.blood_group,
                    p.address,
                    p.emergency_contact,
                    u.name,
                    u.email,
                    u.phone,
                    u.profile_picture
                FROM patients p
                INNER JOIN users u
                    ON p.user_id = u.id
                WHERE p.user_id = ?
            `).get(req.session.user.id);


            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient profile not found"
                });
            }


            // -------------------------------------------------
            // STATISTICS
            // -------------------------------------------------

            const totalAppointments = db.prepare(`
                SELECT COUNT(*) AS count
                FROM appointments
                WHERE patient_id = ?
            `).get(patient.id).count;


            const pendingAppointments = db.prepare(`
                SELECT COUNT(*) AS count
                FROM appointments
                WHERE patient_id = ?
                AND status = 'Pending'
            `).get(patient.id).count;


            const confirmedAppointments = db.prepare(`
                SELECT COUNT(*) AS count
                FROM appointments
                WHERE patient_id = ?
                AND status = 'Confirmed'
            `).get(patient.id).count;


            const completedAppointments = db.prepare(`
                SELECT COUNT(*) AS count
                FROM appointments
                WHERE patient_id = ?
                AND status = 'Completed'
            `).get(patient.id).count;


            // -------------------------------------------------
            // APPOINTMENTS
            // -------------------------------------------------

            const appointments = db.prepare(`
                SELECT

                    a.id,
                    a.patient_id,
                    a.doctor_id,

                    a.appointment_date,
                    a.appointment_time,

                    a.status,
                    a.reason,

                    a.consultation_fee,
                    a.notes,
                    a.created_at,

                    d.specialization,
                    d.qualification,
                    d.experience,

                    u.name AS doctor_name,
                    u.email AS doctor_email,
                    u.phone AS doctor_phone,

                    dep.name AS department

                FROM appointments a

                INNER JOIN doctors d
                    ON a.doctor_id = d.id

                INNER JOIN users u
                    ON d.user_id = u.id

                LEFT JOIN departments dep
                    ON d.department_id = dep.id

                WHERE a.patient_id = ?

                ORDER BY
                    a.appointment_date ASC,
                    a.appointment_time ASC,
                    a.created_at DESC

            `).all(patient.id);


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return res.json({

                success: true,

                patient,

                statistics: {
                    totalAppointments,
                    pendingAppointments,
                    confirmedAppointments,
                    completedAppointments
                },

                appointments

            });

        } catch (error) {

            console.error(
                "Patient dashboard error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load patient dashboard"
            });
        }
    }
);


// =========================================================
// GET PATIENT APPOINTMENTS
// =========================================================

router.get(
    "/appointments",
    requireRole("patient"),
    (req, res) => {

        try {

            const patient = db.prepare(`
                SELECT id
                FROM patients
                WHERE user_id = ?
            `).get(req.session.user.id);


            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient profile not found"
                });
            }


            const appointments = db.prepare(`
                SELECT

                    a.id,
                    a.patient_id,
                    a.doctor_id,

                    a.appointment_date,
                    a.appointment_time,

                    a.status,
                    a.reason,

                    a.consultation_fee,
                    a.notes,
                    a.created_at,

                    d.specialization,
                    d.qualification,
                    d.experience,

                    u.name AS doctor_name,
                    u.email AS doctor_email,
                    u.phone AS doctor_phone,

                    dep.name AS department

                FROM appointments a

                INNER JOIN doctors d
                    ON a.doctor_id = d.id

                INNER JOIN users u
                    ON d.user_id = u.id

                LEFT JOIN departments dep
                    ON d.department_id = dep.id

                WHERE a.patient_id = ?

                ORDER BY
                    a.appointment_date ASC,
                    a.appointment_time ASC,
                    a.created_at DESC

            `).all(patient.id);


            return res.json({
                success: true,
                appointments
            });

        } catch (error) {

            console.error(
                "Patient appointments error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load patient appointments"
            });
        }
    }
);


// =========================================================
// DEPARTMENTS FOR BOOKING
// =========================================================

router.get(
    "/departments",
    requireRole("patient"),
    (req, res) => {

        try {

            const departments = db.prepare(`
                SELECT
                    id,
                    name,
                    description
                FROM departments
                WHERE status = 'Active'
                ORDER BY name ASC
            `).all();


            return res.json({
                success: true,
                departments
            });

        } catch (error) {

            console.error(
                "Patient departments error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load departments"
            });
        }
    }
);


// =========================================================
// DOCTORS FOR BOOKING
//
// Supports:
// /api/patient/doctors
// /api/patient/doctors?department_id=1
//
// IMPORTANT:
// Do NOT use:
// /doctors/:departmentId?
//
// Express 5 does not accept that syntax.
// =========================================================

router.get(
    "/doctors",
    requireRole("patient"),
    (req, res) => {

        try {

            const departmentId =
                req.query.department_id;


            let doctors;


            // -------------------------------------------------
            // FILTERED DOCTORS
            // -------------------------------------------------

            if (departmentId) {

                doctors = db.prepare(`
                    SELECT

                        d.id,
                        d.user_id,
                        d.department_id,

                        d.qualification,
                        d.experience,
                        d.consultation_fee,
                        d.specialization,
                        d.status,

                        u.name,
                        u.email,
                        u.phone,

                        dep.name AS department

                    FROM doctors d

                    INNER JOIN users u
                        ON d.user_id = u.id

                    LEFT JOIN departments dep
                        ON d.department_id = dep.id

                    WHERE d.status = 'Active'

                    AND d.department_id = ?

                    ORDER BY u.name ASC

                `).all(departmentId);

            }


            // -------------------------------------------------
            // ALL ACTIVE DOCTORS
            // -------------------------------------------------

            else {

                doctors = db.prepare(`
                    SELECT

                        d.id,
                        d.user_id,
                        d.department_id,

                        d.qualification,
                        d.experience,
                        d.consultation_fee,
                        d.specialization,
                        d.status,

                        u.name,
                        u.email,
                        u.phone,

                        dep.name AS department

                    FROM doctors d

                    INNER JOIN users u
                        ON d.user_id = u.id

                    LEFT JOIN departments dep
                        ON d.department_id = dep.id

                    WHERE d.status = 'Active'

                    ORDER BY u.name ASC

                `).all();

            }


            return res.json({
                success: true,
                doctors
            });

        } catch (error) {

            console.error(
                "Patient doctors error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load doctors"
            });
        }
    }
);


// =========================================================
// BOOK APPOINTMENT
// =========================================================

router.post(
    "/appointments",
    requireRole("patient"),
    (req, res) => {

        try {

            const {
                doctor_id,
                appointment_date,
                appointment_time,
                reason
            } = req.body;


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !doctor_id ||
                !appointment_date ||
                !appointment_time ||
                !reason ||
                !String(reason).trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Doctor, date, time and reason are required"
                });

            }


            // =================================================
            // FIND PATIENT
            // =================================================

            const patient = db
                .prepare(`
                    SELECT
                        id,
                        user_id
                    FROM patients
                    WHERE user_id = ?
                `)
                .get(
                    req.session.user.id
                );


            if (!patient) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Patient profile not found"
                });

            }


            // =================================================
            // FIND DOCTOR
            // =================================================

            const doctor = db
                .prepare(`
                    SELECT
                        id,
                        user_id,
                        consultation_fee,
                        status
                    FROM doctors
                    WHERE id = ?
                `)
                .get(
                    doctor_id
                );


            if (!doctor) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Doctor not found"
                });

            }


            // =================================================
            // CHECK DOCTOR STATUS
            // =================================================

            if (
                doctor.status !== "Active"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Selected doctor is not available"
                });

            }


            // =================================================
            // PREVENT DOUBLE BOOKING
            // =================================================

            const existing = db
                .prepare(`
                    SELECT id

                    FROM appointments

                    WHERE doctor_id = ?

                    AND appointment_date = ?

                    AND appointment_time = ?

                    AND status IN (
                        'Pending',
                        'Confirmed'
                    )

                    LIMIT 1
                `)
                .get(
                    doctor_id,
                    appointment_date,
                    appointment_time
                );


            if (existing) {

                return res.status(409).json({
                    success: false,
                    message:
                        "This appointment slot is already booked"
                });

            }


            // =================================================
            // CREATE APPOINTMENT
            // =================================================

            const result = db
                .prepare(`
                    INSERT INTO appointments
                    (
                        patient_id,
                        doctor_id,
                        appointment_date,
                        appointment_time,
                        status,
                        reason,
                        consultation_fee
                    )

                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        'Pending',
                        ?,
                        ?
                    )
                `)
                .run(

                    patient.id,

                    doctor.id,

                    appointment_date,

                    appointment_time,

                    String(reason).trim(),

                    doctor.consultation_fee || 0

                );


            // =================================================
            // CREATE NOTIFICATION FOR DOCTOR
            // =================================================

            db
                .prepare(`
                    INSERT INTO notifications
                    (
                        user_id,
                        title,
                        message,
                        type,
                        is_read
                    )

                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        0
                    )
                `)
                .run(

                    doctor.user_id,

                    "New Appointment Request",

                    `${req.session.user.name} has booked an appointment with you on ${appointment_date} at ${appointment_time}.`,

                    "appointment"

                );


            // =================================================
            // SUCCESS
            // =================================================

            return res.status(201).json({

                success: true,

                message:
                    "Appointment booked successfully",

                appointmentId:
                    result.lastInsertRowid

            });


        } catch (error) {

            console.error(
                "Book appointment error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to book appointment"

            });

        }

    }
);


// =========================================================
// PATIENT MEDICAL RECORDS
// =========================================================

router.get(
    "/medical-records",
    requireRole("patient"),
    (req, res) => {

        try {

            const patient = db.prepare(`
                SELECT id
                FROM patients
                WHERE user_id = ?
            `).get(req.session.user.id);


            if (!patient) {

                return res.status(404).json({
                    success: false,
                    message: "Patient profile not found"
                });
            }


            const records = db.prepare(`
                SELECT

                    mr.id,
                    mr.patient_id,
                    mr.doctor_id,
                    mr.appointment_id,

                    mr.diagnosis,
                    mr.prescription,
                    mr.notes,
                    mr.created_at,

                    du.name AS doctor_name,

                    d.specialization,

                    dep.name AS department,

                    a.appointment_date,
                    a.appointment_time

                FROM medical_records mr

                INNER JOIN doctors d
                    ON mr.doctor_id = d.id

                INNER JOIN users du
                    ON d.user_id = du.id

                LEFT JOIN departments dep
                    ON d.department_id = dep.id

                LEFT JOIN appointments a
                    ON mr.appointment_id = a.id

                WHERE mr.patient_id = ?

                ORDER BY mr.created_at DESC

            `).all(patient.id);


            return res.json({
                success: true,
                records
            });

        } catch (error) {

            console.error(
                "Patient medical records error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to load medical records"
            });
        }
    }
);


// =========================================================
// EXPORT
// =========================================================

module.exports = router;