const express = require("express");

const db = require("../config/database");

const {
    requireRole
} = require("../middleware/auth");

const router = express.Router();


// =========================================================
// DOCTOR DASHBOARD
// =========================================================

router.get(
    "/dashboard",
    requireRole("doctor"),
    (req, res) => {

        try {

            const userId =
                req.session.user.id;


            // ---------------------------------------------
            // FIND DOCTOR
            // ---------------------------------------------

            const doctor = db
                .prepare(`
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

                    WHERE d.user_id = ?
                `)
                .get(userId);


            if (!doctor) {

                return res.status(404).json({
                    success: false,
                    message: "Doctor profile not found"
                });

            }


            // ---------------------------------------------
            // APPOINTMENT COUNTS
            // ---------------------------------------------

            const totalAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE doctor_id = ?
                `)
                .get(doctor.id)
                .count;


            const pendingAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE doctor_id = ?
                    AND status = 'Pending'
                `)
                .get(doctor.id)
                .count;


            const confirmedAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE doctor_id = ?
                    AND status = 'Confirmed'
                `)
                .get(doctor.id)
                .count;


            const completedAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE doctor_id = ?
                    AND status = 'Completed'
                `)
                .get(doctor.id)
                .count;


            const totalPatients = db
                .prepare(`
                    SELECT COUNT(
                        DISTINCT patient_id
                    ) AS count

                    FROM appointments

                    WHERE doctor_id = ?
                `)
                .get(doctor.id)
                .count;


            res.json({

                success: true,

                doctor,

                statistics: {

                    totalAppointments,

                    pendingAppointments,

                    confirmedAppointments,

                    completedAppointments,

                    totalPatients

                }

            });

        } catch (error) {

            console.error(
                "Doctor dashboard error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load doctor dashboard"

            });

        }

    }
);


// =========================================================
// DOCTOR PROFILE
// =========================================================

router.get(
    "/profile",
    requireRole("doctor"),
    (req, res) => {

        try {

            const doctor = db
                .prepare(`
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
                        u.profile_picture,

                        dep.name AS department

                    FROM doctors d

                    INNER JOIN users u
                        ON d.user_id = u.id

                    LEFT JOIN departments dep
                        ON d.department_id = dep.id

                    WHERE d.user_id = ?
                `)
                .get(req.session.user.id);


            if (!doctor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Doctor profile not found"

                });

            }


            res.json({

                success: true,

                doctor

            });

        } catch (error) {

            console.error(
                "Doctor profile error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load doctor profile"

            });

        }

    }
);


// =========================================================
// DOCTOR APPOINTMENTS
// =========================================================

router.get(
    "/appointments",
    requireRole("doctor"),
    (req, res) => {

        try {

            const doctor = db
                .prepare(`
                    SELECT id
                    FROM doctors
                    WHERE user_id = ?
                `)
                .get(req.session.user.id);


            if (!doctor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Doctor profile not found"

                });

            }


            const appointments = db
                .prepare(`
                    SELECT

                        a.id,

                        a.appointment_date,
                        a.appointment_time,

                        a.status,
                        a.reason,
                        a.consultation_fee,
                        a.notes,

                        p.id AS patient_id,

                        pu.name AS patient_name,
                        pu.email AS patient_email,
                        pu.phone AS patient_phone,

                        p.date_of_birth,
                        p.gender,
                        p.blood_group,
                        p.address

                    FROM appointments a

                    INNER JOIN patients p
                        ON a.patient_id = p.id

                    INNER JOIN users pu
                        ON p.user_id = pu.id

                    WHERE a.doctor_id = ?

                    ORDER BY
                        a.appointment_date DESC,
                        a.appointment_time DESC
                `)
                .all(doctor.id);


            res.json({

                success: true,

                appointments

            });

        } catch (error) {

            console.error(
                "Doctor appointments error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load appointments"

            });

        }

    }
);


// =========================================================
// UPDATE APPOINTMENT STATUS
// =========================================================

// =========================================================
// UPDATE APPOINTMENT STATUS
// =========================================================

router.patch(
    "/appointments/:id/status",
    requireRole("doctor"),
    (req, res) => {

        try {

            const appointmentId = req.params.id;

            const {
                status,
                notes
            } = req.body;


            // =================================================
            // VALID STATUSES
            // =================================================

            const validStatuses = [
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled"
            ];


            if (!validStatuses.includes(status)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid appointment status"
                });

            }


            // =================================================
            // FIND DOCTOR
            // =================================================

            const doctor = db
                .prepare(`
                    SELECT
                        id,
                        user_id
                    FROM doctors
                    WHERE user_id = ?
                `)
                .get(
                    req.session.user.id
                );


            if (!doctor) {

                return res.status(404).json({
                    success: false,
                    message: "Doctor profile not found"
                });

            }


            // =================================================
            // FIND APPOINTMENT
            // =================================================

            const appointment = db
                .prepare(`
                    SELECT

                        a.id,

                        a.patient_id,

                        a.doctor_id,

                        a.reason,

                        a.notes,

                        a.status,

                        a.appointment_date,

                        a.appointment_time,

                        p.user_id AS patient_user_id,

                        u.name AS patient_name

                    FROM appointments a

                    INNER JOIN patients p
                        ON a.patient_id = p.id

                    INNER JOIN users u
                        ON p.user_id = u.id

                    WHERE a.id = ?

                    AND a.doctor_id = ?

                `)
                .get(
                    appointmentId,
                    doctor.id
                );


            if (!appointment) {

                return res.status(404).json({
                    success: false,
                    message: "Appointment not found"
                });

            }


            // =================================================
            // CHECK WHETHER STATUS ACTUALLY CHANGED
            // =================================================

            const statusChanged =
                appointment.status !== status;


            // =================================================
            // UPDATE APPOINTMENT
            // =================================================

            db.prepare(`
                UPDATE appointments

                SET
                    status = ?,
                    notes = COALESCE(?, notes)

                WHERE id = ?

                AND doctor_id = ?

            `).run(

                status,

                notes || null,

                appointmentId,

                doctor.id

            );


            // =================================================
            // PATIENT NOTIFICATION
            // =================================================

            if (statusChanged) {

                let notificationTitle = "";
                let notificationMessage = "";


                // -------------------------------------------------
                // CONFIRMED
                // -------------------------------------------------

                if (status === "Confirmed") {

                    notificationTitle =
                        "Appointment Confirmed";

                    notificationMessage =
                        `Your appointment with Dr. ${req.session.user.name} on ${appointment.appointment_date} at ${appointment.appointment_time} has been confirmed.`;

                }


                // -------------------------------------------------
                // COMPLETED
                // -------------------------------------------------

                else if (status === "Completed") {

                    notificationTitle =
                        "Appointment Completed";

                    notificationMessage =
                        `Your appointment with Dr. ${req.session.user.name} has been completed. Your medical record is now available.`;

                }


                // -------------------------------------------------
                // CANCELLED
                // -------------------------------------------------

                else if (status === "Cancelled") {

                    notificationTitle =
                        "Appointment Cancelled";

                    notificationMessage =
                        `Your appointment with Dr. ${req.session.user.name} on ${appointment.appointment_date} at ${appointment.appointment_time} has been cancelled.`;

                }


                // -------------------------------------------------
                // INSERT NOTIFICATION
                // -------------------------------------------------

                if (notificationTitle) {

                    db.prepare(`
                        INSERT INTO notifications
                        (
                            user_id,
                            title,
                            message,
                            type,
                            is_read
                        )

                        VALUES (?, ?, ?, ?, 0)

                    `).run(

                        appointment.patient_user_id,

                        notificationTitle,

                        notificationMessage,

                        "appointment"

                    );

                }

            }


            // =================================================
            // CREATE MEDICAL RECORD WHEN COMPLETED
            // =================================================

            if (status === "Completed") {

                // -------------------------------------------------
                // CHECK WHETHER RECORD ALREADY EXISTS
                // -------------------------------------------------

                const existingRecord = db
                    .prepare(`
                        SELECT id

                        FROM medical_records

                        WHERE appointment_id = ?

                        LIMIT 1

                    `)
                    .get(
                        appointmentId
                    );


                // -------------------------------------------------
                // CREATE ONLY ONE MEDICAL RECORD
                // -------------------------------------------------

                if (!existingRecord) {

                    db.prepare(`
                        INSERT INTO medical_records
                        (
                            patient_id,
                            doctor_id,
                            appointment_id,
                            diagnosis,
                            prescription,
                            notes
                        )

                        VALUES (?, ?, ?, ?, ?, ?)

                    `).run(

                        appointment.patient_id,

                        doctor.id,

                        appointmentId,

                        appointment.reason ||
                            "Consultation completed",

                        null,

                        notes ||
                            appointment.notes ||
                            "Consultation completed successfully."

                    );

                }

            }


            // =================================================
            // RESPONSE
            // =================================================

            return res.json({

                success: true,

                message:
                    status === "Completed"
                        ? "Appointment completed and medical record created successfully"
                        : status === "Confirmed"
                            ? "Appointment confirmed successfully"
                            : status === "Cancelled"
                                ? "Appointment cancelled successfully"
                                : "Appointment updated successfully"

            });


        } catch (error) {

            console.error(
                "Update appointment error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update appointment"

            });

        }

    }
);

// =========================================================
// PATIENT APPOINTMENT HISTORY
// =========================================================

router.get(
    "/patients/:patientId/appointments",
    requireRole("doctor"),
    (req, res) => {

        try {

            const doctor = db
                .prepare(`
                    SELECT id
                    FROM doctors
                    WHERE user_id = ?
                `)
                .get(
                    req.session.user.id
                );

            if (!doctor) {

                return res.status(404).json({
                    success: false,
                    message: "Doctor profile not found"
                });

            }

            const relationship = db
                .prepare(`
                    SELECT id
                    FROM appointments
                    WHERE doctor_id = ?
                    AND patient_id = ?
                    LIMIT 1
                `)
                .get(
                    doctor.id,
                    req.params.patientId
                );

            if (!relationship) {

                return res.status(403).json({
                    success: false,
                    message:
                        "You do not have access to this patient"
                });

            }

            const appointments = db
                .prepare(`
                    SELECT
                        a.id,
                        a.appointment_date,
                        a.appointment_time,
                        a.status,
                        a.reason,
                        a.consultation_fee,
                        a.notes,
                        a.created_at
                    FROM appointments a
                    WHERE a.doctor_id = ?
                    AND a.patient_id = ?
                    ORDER BY
                        a.appointment_date DESC,
                        a.appointment_time DESC
                `)
                .all(
                    doctor.id,
                    req.params.patientId
                );

            return res.json({
                success: true,
                appointments
            });

        } catch (error) {

            console.error(
                "Patient appointment history error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load appointment history"
            });

        }

    }
);

// =========================================================
// COMPLETE CONSULTATION
// Creates medical record + marks appointment Completed
// =========================================================

router.post(
    "/appointments/:id/complete",
    requireRole("doctor"),
    (req, res) => {

        try {

            const appointmentId =
                req.params.id;

            const {
                diagnosis,
                prescription,
                notes
            } = req.body;


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (
                !diagnosis ||
                !String(diagnosis).trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Diagnosis is required"
                });
            }


            // -------------------------------------------------
            // FIND DOCTOR
            // -------------------------------------------------

            const doctor = db
                .prepare(`
                    SELECT id
                    FROM doctors
                    WHERE user_id = ?
                `)
                .get(
                    req.session.user.id
                );


            if (!doctor) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Doctor profile not found"
                });
            }


            // -------------------------------------------------
            // FIND APPOINTMENT
            // -------------------------------------------------

            const appointment = db
                .prepare(`
                    SELECT
                        id,
                        patient_id,
                        doctor_id,
                        status
                    FROM appointments

                    WHERE id = ?
                    AND doctor_id = ?
                `)
                .get(
                    appointmentId,
                    doctor.id
                );


            if (!appointment) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Appointment not found"
                });
            }


            // -------------------------------------------------
            // STATUS VALIDATION
            // -------------------------------------------------

            if (
                appointment.status !==
                "Confirmed"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Only confirmed appointments can be completed"
                });
            }


            // -------------------------------------------------
            // TRANSACTION
            // -------------------------------------------------

            const completeConsultation =
                db.transaction(() => {

                    // -----------------------------------------
                    // CREATE MEDICAL RECORD
                    // -----------------------------------------

                    const record =
                        db.prepare(`
                            INSERT INTO medical_records
                            (
                                patient_id,
                                doctor_id,
                                appointment_id,
                                diagnosis,
                                prescription,
                                notes
                            )

                            VALUES (?, ?, ?, ?, ?, ?)
                        `).run(

                            appointment.patient_id,

                            doctor.id,

                            appointment.id,

                            String(
                                diagnosis
                            ).trim(),

                            prescription
                                ? String(
                                    prescription
                                ).trim()
                                : null,

                            notes
                                ? String(
                                    notes
                                ).trim()
                                : null
                        );


                    // -----------------------------------------
                    // MARK APPOINTMENT COMPLETED
                    // -----------------------------------------

                    db.prepare(`
                        UPDATE appointments

                        SET
                            status = 'Completed',
                            notes = ?

                        WHERE id = ?
                        AND doctor_id = ?
                    `).run(

                        notes
                            ? String(
                                notes
                            ).trim()
                            : null,

                        appointment.id,

                        doctor.id
                    );


                    return record.lastInsertRowid;
                });


            const recordId =
                completeConsultation();


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            return res.json({

                success: true,

                message:
                    "Consultation completed successfully",

                recordId

            });


        } catch (error) {

            console.error(
                "Complete consultation error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to complete consultation"

            });
        }
    }
);


// =========================================================
// DOCTOR PATIENTS
// =========================================================

router.get(
    "/patients",
    requireRole("doctor"),
    (req, res) => {

        try {

            const doctor = db
                .prepare(`
                    SELECT id
                    FROM doctors
                    WHERE user_id = ?
                `)
                .get(req.session.user.id);


            if (!doctor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Doctor profile not found"

                });

            }


            const patients = db
                .prepare(`
                    SELECT DISTINCT

                        p.id,

                        p.user_id,

                        p.date_of_birth,
                        p.gender,
                        p.blood_group,
                        p.address,
                        p.emergency_contact,

                        u.name,
                        u.email,
                        u.phone

                    FROM patients p

                    INNER JOIN users u
                        ON p.user_id = u.id

                    INNER JOIN appointments a
                        ON a.patient_id = p.id

                    WHERE a.doctor_id = ?

                    ORDER BY u.name
                `)
                .all(doctor.id);


            res.json({

                success: true,

                patients

            });

        } catch (error) {

            console.error(
                "Doctor patients error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load patients"

            });

        }

    }
);


// =========================================================
// MEDICAL RECORDS
// =========================================================

router.get(
    "/medical-records/:patientId",
    requireRole("doctor"),
    (req, res) => {

        try {

            const doctor = db
                .prepare(`
                    SELECT id
                    FROM doctors
                    WHERE user_id = ?
                `)
                .get(req.session.user.id);


            if (!doctor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Doctor profile not found"

                });

            }


            // ---------------------------------------------
            // VERIFY DOCTOR-PATIENT RELATIONSHIP
            // ---------------------------------------------

            const relationship = db
                .prepare(`
                    SELECT id
                    FROM appointments

                    WHERE doctor_id = ?
                    AND patient_id = ?

                    LIMIT 1
                `)
                .get(
                    doctor.id,
                    req.params.patientId
                );


            if (!relationship) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You do not have access to this patient"

                });

            }


            const records = db
                .prepare(`
                    SELECT

                        mr.id,

                        mr.patient_id,
                        mr.doctor_id,
                        mr.appointment_id,

                        mr.diagnosis,
                        mr.prescription,
                        mr.notes,

                        mr.created_at

                    FROM medical_records mr

                    WHERE mr.patient_id = ?
                    AND mr.doctor_id = ?

                    ORDER BY
                        mr.created_at DESC
                `)
                .all(
                    req.params.patientId,
                    doctor.id
                );


            res.json({

                success: true,

                records

            });

        } catch (error) {

            console.error(
                "Medical records error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load medical records"

            });

        }

    }
);


// =========================================================
// CREATE MEDICAL RECORD
// =========================================================

router.post(
    "/medical-records",
    requireRole("doctor"),
    (req, res) => {

        try {

            const {
                patient_id,
                appointment_id,
                diagnosis,
                prescription,
                notes
            } = req.body;


            if (!patient_id) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Patient ID is required"

                });

            }


            const doctor = db
                .prepare(`
                    SELECT id
                    FROM doctors
                    WHERE user_id = ?
                `)
                .get(req.session.user.id);


            if (!doctor) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Doctor profile not found"

                });

            }


            // ---------------------------------------------
            // VERIFY DOCTOR-PATIENT RELATIONSHIP
            // ---------------------------------------------

            const relationship = db
                .prepare(`
                    SELECT id
                    FROM appointments

                    WHERE doctor_id = ?
                    AND patient_id = ?

                    LIMIT 1
                `)
                .get(
                    doctor.id,
                    patient_id
                );


            if (!relationship) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You do not have access to this patient"

                });

            }


            const result = db
                .prepare(`
                    INSERT INTO medical_records
                    (
                        patient_id,
                        doctor_id,
                        appointment_id,
                        diagnosis,
                        prescription,
                        notes
                    )

                    VALUES (?, ?, ?, ?, ?, ?)
                `)
                .run(
                    patient_id,
                    doctor.id,
                    appointment_id || null,
                    diagnosis || null,
                    prescription || null,
                    notes || null
                );


            res.status(201).json({

                success: true,

                message:
                    "Medical record created successfully",

                recordId:
                    result.lastInsertRowid

            });

        } catch (error) {

            console.error(
                "Create medical record error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to create medical record"

            });

        }

    }
);


module.exports = router;