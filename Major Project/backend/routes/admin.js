const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../config/database");

const {
    requireRole
} = require("../middleware/auth");

const router = express.Router();


// =========================================================
// ADMIN DASHBOARD STATISTICS
// =========================================================

router.get(
    "/dashboard",
    requireRole("admin"),
    (req, res) => {

        try {

            const totalDoctors = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM doctors
                    WHERE status = 'Active'
                `)
                .get()
                .count;


            const totalPatients = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM patients
                `)
                .get()
                .count;


            const totalAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                `)
                .get()
                .count;


            const totalDepartments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM departments
                    WHERE status = 'Active'
                `)
                .get()
                .count;


            const pendingAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE status = 'Pending'
                `)
                .get()
                .count;


            const confirmedAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE status = 'Confirmed'
                `)
                .get()
                .count;


            const completedAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE status = 'Completed'
                `)
                .get()
                .count;


            const cancelledAppointments = db
                .prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE status = 'Cancelled'
                `)
                .get()
                .count;


            return res.json({
                success: true,

                statistics: {
                    totalDoctors,
                    totalPatients,
                    totalAppointments,
                    totalDepartments,
                    pendingAppointments,
                    confirmedAppointments,
                    completedAppointments,
                    cancelledAppointments
                }
            });

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load dashboard statistics"
            });
        }
    }
);


// =========================================================
// GET ALL DOCTORS
// =========================================================

router.get(
    "/doctors",
    requireRole("admin"),
    (req, res) => {

        try {

            const doctors = db
                .prepare(`
                    SELECT
                        d.id,
                        d.user_id,
                        u.name,
                        u.email,
                        u.phone,
                        d.department_id,
                        dep.name AS department,
                        d.qualification,
                        d.experience,
                        d.consultation_fee AS fee,
                        d.specialization,
                        d.status,
                        d.created_at

                    FROM doctors d

                    INNER JOIN users u
                        ON d.user_id = u.id

                    LEFT JOIN departments dep
                        ON d.department_id = dep.id

                    ORDER BY d.created_at DESC
                `)
                .all();


            return res.json({
                success: true,
                doctors
            });

        } catch (error) {

            console.error(
                "Get doctors error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load doctors"
            });
        }
    }
);


// =========================================================
// ADD DOCTOR
// =========================================================

router.post(
    "/doctors",
    requireRole("admin"),
    async (req, res) => {

        try {

            const {
                name,
                email,
                phone,
                department,
                qualification,
                experience,
                fee,
                status,
                specialization
            } = req.body || {};


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (
                !name ||
                !String(name).trim() ||
                !email ||
                !String(email).trim() ||
                !phone ||
                !String(phone).trim() ||
                !department ||
                !String(department).trim() ||
                !qualification ||
                !String(qualification).trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Name, email, phone, department and qualification are required"
                });
            }


            const normalizedEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            // -------------------------------------------------
            // BASIC EMAIL VALIDATION
            // -------------------------------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(normalizedEmail)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please provide a valid email address"
                });
            }


            // -------------------------------------------------
            // NORMALIZE NUMERIC VALUES
            // -------------------------------------------------

            const experienceValue =
                Number(experience) || 0;

            const feeValue =
                Number(fee) || 0;


            if (
                !Number.isFinite(experienceValue) ||
                experienceValue < 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Experience must be a valid non-negative number"
                });
            }


            if (
                !Number.isFinite(feeValue) ||
                feeValue < 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Consultation fee must be a valid non-negative number"
                });
            }


            // -------------------------------------------------
            // CHECK EMAIL
            // -------------------------------------------------

            const existingUser =
                db.prepare(`
                    SELECT id
                    FROM users
                    WHERE LOWER(email) = LOWER(?)
                    LIMIT 1
                `)
                .get(normalizedEmail);


            if (existingUser) {

                return res.status(409).json({
                    success: false,
                    message:
                        "A user with this email already exists"
                });
            }


            // -------------------------------------------------
            // FIND DEPARTMENT
            // Case-insensitive lookup
            // -------------------------------------------------

            const departmentRecord =
                db.prepare(`
                    SELECT id
                    FROM departments
                    WHERE LOWER(name) = LOWER(?)
                    LIMIT 1
                `)
                .get(
                    String(department).trim()
                );


            if (!departmentRecord) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Selected department does not exist"
                });
            }


            // -------------------------------------------------
            // NORMALIZE STATUS
            // -------------------------------------------------

            const doctorStatus =
                status === "Inactive"
                    ? "Inactive"
                    : "Active";


            // -------------------------------------------------
            // CREATE TEMPORARY PASSWORD
            // -------------------------------------------------

            const temporaryPassword =
                "Doctor@123";


            const hashedPassword =
                await bcrypt.hash(
                    temporaryPassword,
                    12
                );


            // -------------------------------------------------
            // CREATE USER + DOCTOR IN ONE TRANSACTION
            // -------------------------------------------------

            const createDoctorTransaction =
                db.transaction(() => {

                    const userResult =
                        db.prepare(`
                            INSERT INTO users
                            (
                                name,
                                email,
                                password,
                                role,
                                phone
                            )

                            VALUES
                            (?, ?, ?, 'doctor', ?)
                        `)
                        .run(
                            String(name).trim(),
                            normalizedEmail,
                            hashedPassword,
                            String(phone).trim()
                        );


                    const userId =
                        userResult.lastInsertRowid;


                    const doctorResult =
                        db.prepare(`
                            INSERT INTO doctors
                            (
                                user_id,
                                department_id,
                                qualification,
                                experience,
                                consultation_fee,
                                specialization,
                                status
                            )

                            VALUES
                            (?, ?, ?, ?, ?, ?, ?)
                        `)
                        .run(
                            userId,
                            departmentRecord.id,
                            String(
                                qualification
                            ).trim(),
                            experienceValue,
                            feeValue,
                            specialization
                                ? String(
                                    specialization
                                ).trim()
                                : null,
                            doctorStatus
                        );


                    return {
                        userId,
                        doctorId:
                            doctorResult.lastInsertRowid
                    };
                });


            const transaction =
                createDoctorTransaction();


            // -------------------------------------------------
            // SUCCESS RESPONSE
            // -------------------------------------------------

            return res.status(201).json({

                success: true,

                message:
                    "Doctor created successfully",

                doctorId:
                    transaction.doctorId,

                temporaryPassword
            });


        } catch (error) {

            console.error(
                "Add doctor error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create doctor"
            });
        }
    }
);


// =========================================================
// UPDATE DOCTOR
// =========================================================

router.put(
    "/doctors/:id",
    requireRole("admin"),
    (req, res) => {

        try {

            const doctorId =
                req.params.id;


            const {
                name,
                email,
                phone,
                department,
                qualification,
                experience,
                fee,
                status,
                specialization
            } = req.body || {};


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (
                !name ||
                !String(name).trim() ||
                !email ||
                !String(email).trim() ||
                !phone ||
                !String(phone).trim() ||
                !department ||
                !String(department).trim() ||
                !qualification ||
                !String(qualification).trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Name, email, phone, department and qualification are required"
                });
            }


            const normalizedEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(normalizedEmail)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please provide a valid email address"
                });
            }


            const experienceValue =
                Number(experience) || 0;

            const feeValue =
                Number(fee) || 0;


            if (
                !Number.isFinite(experienceValue) ||
                experienceValue < 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Experience must be a valid non-negative number"
                });
            }


            if (
                !Number.isFinite(feeValue) ||
                feeValue < 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Consultation fee must be a valid non-negative number"
                });
            }


            // -------------------------------------------------
            // FIND DOCTOR
            // -------------------------------------------------

            const doctor =
                db.prepare(`
                    SELECT
                        id,
                        user_id
                    FROM doctors
                    WHERE id = ?
                `)
                .get(doctorId);


            if (!doctor) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Doctor not found"
                });
            }


            // -------------------------------------------------
            // FIND DEPARTMENT
            // Case-insensitive lookup
            // -------------------------------------------------

            const departmentRecord =
                db.prepare(`
                    SELECT id
                    FROM departments
                    WHERE LOWER(name) = LOWER(?)
                    LIMIT 1
                `)
                .get(
                    String(department).trim()
                );


            if (!departmentRecord) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Selected department does not exist"
                });
            }


            // -------------------------------------------------
            // CHECK EMAIL BELONGS TO SOMEONE ELSE
            // -------------------------------------------------

            const emailOwner =
                db.prepare(`
                    SELECT id
                    FROM users
                    WHERE LOWER(email) = LOWER(?)
                    AND id != ?
                    LIMIT 1
                `)
                .get(
                    normalizedEmail,
                    doctor.user_id
                );


            if (emailOwner) {

                return res.status(409).json({
                    success: false,
                    message:
                        "This email is already used by another user"
                });
            }


            // -------------------------------------------------
            // NORMALIZE STATUS
            // -------------------------------------------------

            const doctorStatus =
                status === "Inactive"
                    ? "Inactive"
                    : "Active";


            // -------------------------------------------------
            // UPDATE USER + DOCTOR
            // -------------------------------------------------

            const transaction =
                db.transaction(() => {

                    db.prepare(`
                        UPDATE users

                        SET
                            name = ?,
                            email = ?,
                            phone = ?

                        WHERE id = ?
                    `)
                    .run(
                        String(name).trim(),
                        normalizedEmail,
                        String(phone).trim(),
                        doctor.user_id
                    );


                    db.prepare(`
                        UPDATE doctors

                        SET
                            department_id = ?,
                            qualification = ?,
                            experience = ?,
                            consultation_fee = ?,
                            specialization = ?,
                            status = ?

                        WHERE id = ?
                    `)
                    .run(
                        departmentRecord.id,
                        String(
                            qualification
                        ).trim(),
                        experienceValue,
                        feeValue,
                        specialization
                            ? String(
                                specialization
                            ).trim()
                            : null,
                        doctorStatus,
                        doctorId
                    );
                });


            transaction();


            return res.json({

                success: true,

                message:
                    "Doctor updated successfully"
            });


        } catch (error) {

            console.error(
                "Update doctor error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update doctor"
            });
        }
    }
);


// =========================================================
// DELETE DOCTOR
// =========================================================

router.delete(
    "/doctors/:id",
    requireRole("admin"),
    (req, res) => {

        try {

            const doctorId =
                req.params.id;


            // -------------------------------------------------
            // FIND DOCTOR
            // -------------------------------------------------

            const doctor =
                db.prepare(`
                    SELECT
                        id,
                        user_id
                    FROM doctors
                    WHERE id = ?
                `)
                .get(doctorId);


            if (!doctor) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Doctor not found"
                });
            }


            // -------------------------------------------------
            // CHECK APPOINTMENTS
            // -------------------------------------------------

            const appointmentCount =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM appointments
                    WHERE doctor_id = ?
                `)
                .get(doctorId)
                .count;


            if (appointmentCount > 0) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Cannot delete this doctor because appointments are associated with this doctor. Deactivate the doctor instead."
                });
            }


            // -------------------------------------------------
            // DELETE USER + DOCTOR
            // -------------------------------------------------

            const transaction =
                db.transaction(() => {

                    db.prepare(`
                        DELETE FROM doctors
                        WHERE id = ?
                    `)
                    .run(doctorId);


                    db.prepare(`
                        DELETE FROM users
                        WHERE id = ?
                        AND role = 'doctor'
                    `)
                    .run(doctor.user_id);
                });


            transaction();


            return res.json({

                success: true,

                message:
                    "Doctor deleted successfully"
            });


        } catch (error) {

            console.error(
                "Delete doctor error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete doctor"
            });
        }
    }
);


// =========================================================
// RECENT APPOINTMENTS
// =========================================================

router.get(
    "/recent-appointments",
    requireRole("admin"),
    (req, res) => {

        try {

            const appointments =
                db.prepare(`
                    SELECT
                        a.id,
                        a.appointment_date,
                        a.appointment_time,
                        a.status,
                        a.reason,
                        a.consultation_fee,

                        p.id AS patient_id,
                        pu.name AS patient_name,

                        d.id AS doctor_id,
                        du.name AS doctor_name,

                        dep.name AS department

                    FROM appointments a

                    INNER JOIN patients p
                        ON a.patient_id = p.id

                    INNER JOIN users pu
                        ON p.user_id = pu.id

                    INNER JOIN doctors d
                        ON a.doctor_id = d.id

                    INNER JOIN users du
                        ON d.user_id = du.id

                    LEFT JOIN departments dep
                        ON d.department_id = dep.id

                    ORDER BY
                        a.created_at DESC

                    LIMIT 10
                `)
                .all();


            return res.json({
                success: true,
                appointments
            });


        } catch (error) {

            console.error(
                "Recent appointments error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load appointments"
            });
        }
    }
);

// =========================================================
// ADMIN - ALL APPOINTMENTS
// =========================================================

router.get(
    "/appointments",
    requireRole("admin"),
    (req, res) => {

        try {

            const appointments =
                db.prepare(`
                    SELECT
                        a.id,

                        a.patient_id AS patientId,
                        pu.name AS patientName,

                        a.doctor_id AS doctorId,
                        du.name AS doctorName,

                        dep.name AS department,

                        a.appointment_date AS date,
                        a.appointment_time AS time,

                        a.status,

                        a.consultation_fee AS fee,

                        a.reason,
                        a.notes,

                        a.created_at AS createdAt

                    FROM appointments a

                    INNER JOIN patients p
                        ON a.patient_id = p.id

                    INNER JOIN users pu
                        ON p.user_id = pu.id

                    INNER JOIN doctors d
                        ON a.doctor_id = d.id

                    INNER JOIN users du
                        ON d.user_id = du.id

                    LEFT JOIN departments dep
                        ON d.department_id = dep.id

                    ORDER BY
                        a.appointment_date ASC,
                        a.appointment_time ASC
                `)
                .all();


            return res.json({

                success: true,

                appointments

            });


        } catch (error) {

            console.error(
                "Admin appointments error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load appointments"

            });

        }

    }
);

// =========================================================
// ADMIN - CREATE APPOINTMENT
// =========================================================

router.post(
    "/appointments",
    requireRole("admin"),
    (req, res) => {

        try {

            const {
                patientId,
                doctorId,
                date,
                time,
                status,
                fee,
                reason,
                notes
            } = req.body;


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !patientId ||
                !doctorId ||
                !date ||
                !time ||
                !reason ||
                !String(reason).trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Patient, doctor, date, time and reason are required"

                });

            }


            // =================================================
            // FIND PATIENT
            // =================================================

            const patient =
                db.prepare(`
                    SELECT
                        id
                    FROM patients
                    WHERE id = ?
                `)
                .get(
                    patientId
                );


            if (!patient) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Patient not found"

                });

            }


            // =================================================
            // FIND DOCTOR
            // =================================================

            const doctor =
                db.prepare(`
                    SELECT
                        id,
                        consultation_fee,
                        status
                    FROM doctors
                    WHERE id = ?
                `)
                .get(
                    doctorId
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
                doctor.status !==
                "Active"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Selected doctor is not available"

                });

            }


            // =================================================
            // VALIDATE STATUS
            // =================================================

            const allowedStatuses = [

                "Pending",

                "Confirmed",

                "Completed",

                "Cancelled"

            ];


            const appointmentStatus =
                status || "Pending";


            if (
                !allowedStatuses.includes(
                    appointmentStatus
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid appointment status"

                });

            }


            // =================================================
            // VALIDATE FEE
            // =================================================

            const appointmentFee =
                fee === undefined ||
                fee === null ||
                fee === ""
                    ? Number(
                        doctor.consultation_fee ||
                        0
                    )
                    : Number(fee);


            if (
                !Number.isFinite(
                    appointmentFee
                ) ||
                appointmentFee < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid consultation fee"

                });

            }


            // =================================================
            // PREVENT DOUBLE BOOKING
            // =================================================

            const existing =
                db.prepare(`
                    SELECT
                        id
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
                    doctorId,
                    date,
                    time
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

            const result =
                db.prepare(`
                    INSERT INTO appointments
                    (
                        patient_id,
                        doctor_id,
                        appointment_date,
                        appointment_time,
                        status,
                        reason,
                        consultation_fee,
                        notes
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?)
                `)
                .run(

                    patientId,

                    doctorId,

                    String(date).trim(),

                    String(time).trim(),

                    appointmentStatus,

                    String(reason).trim(),

                    appointmentFee,

                    notes === undefined ||
                    notes === null
                        ? null
                        : String(notes).trim()

                );


            // =================================================
            // RETURN CREATED APPOINTMENT
            // =================================================

            const appointment =
                db.prepare(`
                    SELECT
                        a.id,

                        a.patient_id AS patientId,
                        pu.name AS patientName,

                        a.doctor_id AS doctorId,
                        du.name AS doctorName,

                        dep.name AS department,

                        a.appointment_date AS date,
                        a.appointment_time AS time,

                        a.status,

                        a.consultation_fee AS fee,

                        a.reason,
                        a.notes,

                        a.created_at AS createdAt

                    FROM appointments a

                    INNER JOIN patients p
                        ON a.patient_id = p.id

                    INNER JOIN users pu
                        ON p.user_id = pu.id

                    INNER JOIN doctors d
                        ON a.doctor_id = d.id

                    INNER JOIN users du
                        ON d.user_id = du.id

                    LEFT JOIN departments dep
                        ON d.department_id = dep.id

                    WHERE a.id = ?
                `)
                .get(
                    result.lastInsertRowid
                );


            return res.status(201).json({

                success: true,

                message:
                    "Appointment created successfully",

                appointment

            });


        } catch (error) {

            console.error(
                "Admin create appointment error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to create appointment"

            });

        }

    }
);

// =========================================================
// ADMIN - UPDATE APPOINTMENT
// =========================================================

router.put(
    "/appointments/:id",
    requireRole("admin"),
    (req, res) => {

        try {

            const appointmentId =
                req.params.id;


            const {
                status,
                appointment_date,
                appointment_time,
                reason,
                notes,
                consultation_fee
            } = req.body;


            const existing =
                db.prepare(`
                    SELECT id
                    FROM appointments
                    WHERE id = ?
                `)
                .get(
                    appointmentId
                );


            if (!existing) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Appointment not found"

                });

            }


            const allowedStatuses = [
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled"
            ];


            if (
                status !== undefined &&
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid appointment status"

                });

            }


            const fields = [];
            const values = [];


            if (
                status !== undefined
            ) {

                fields.push(
                    "status = ?"
                );

                values.push(
                    status
                );

            }


            if (
                appointment_date !==
                undefined
            ) {

                fields.push(
                    "appointment_date = ?"
                );

                values.push(
                    appointment_date
                );

            }


            if (
                appointment_time !==
                undefined
            ) {

                fields.push(
                    "appointment_time = ?"
                );

                values.push(
                    appointment_time
                );

            }


            if (
                reason !== undefined
            ) {

                fields.push(
                    "reason = ?"
                );

                values.push(
                    String(reason).trim()
                );

            }


            if (
                notes !== undefined
            ) {

                fields.push(
                    "notes = ?"
                );

                values.push(
                    notes === null
                        ? null
                        : String(notes).trim()
                );

            }


            if (
                consultation_fee !==
                undefined
            ) {

                const fee =
                    Number(
                        consultation_fee
                    );


                if (
                    !Number.isFinite(fee) ||
                    fee < 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Invalid consultation fee"

                    });

                }


                fields.push(
                    "consultation_fee = ?"
                );

                values.push(
                    fee
                );

            }


            if (
                fields.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No appointment fields to update"

                });

            }


            values.push(
                appointmentId
            );


            db.prepare(`
                UPDATE appointments
                SET
                    ${fields.join(", ")}
                WHERE id = ?
            `)
            .run(
                ...values
            );


            return res.json({

                success: true,

                message:
                    "Appointment updated successfully"

            });


        } catch (error) {

            console.error(
                "Admin update appointment error:",
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
// ADMIN - DELETE APPOINTMENT
// =========================================================

router.delete(
    "/appointments/:id",
    requireRole("admin"),
    (req, res) => {

        try {

            const appointmentId =
                req.params.id;


            const existing =
                db.prepare(`
                    SELECT id
                    FROM appointments
                    WHERE id = ?
                `)
                .get(
                    appointmentId
                );


            if (!existing) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Appointment not found"

                });

            }


            db.prepare(`
                DELETE FROM appointments
                WHERE id = ?
            `)
            .run(
                appointmentId
            );


            return res.json({

                success: true,

                message:
                    "Appointment deleted successfully"

            });


        } catch (error) {

            console.error(
                "Admin delete appointment error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete appointment"

            });

        }

    }
);

// =========================================================
// DEPARTMENT OVERVIEW
// =========================================================

router.get(
    "/department-overview",
    requireRole("admin"),
    (req, res) => {

        try {

            const departments =
                db.prepare(`
                    SELECT
                        dep.id,
                        dep.name,
                        dep.description,
                        dep.status,
                        COUNT(d.id) AS doctor_count

                    FROM departments dep

                    LEFT JOIN doctors d
                        ON dep.id = d.department_id
                        AND d.status = 'Active'

                    GROUP BY
                        dep.id

                    ORDER BY
                        dep.name
                `)
                .all();


            return res.json({
                success: true,
                departments
            });


        } catch (error) {

            console.error(
                "Department overview error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load department overview"
            });
        }
    }
);


// =========================================================
// GET ALL DEPARTMENTS
// =========================================================

router.get(
    "/departments",
    requireRole("admin"),
    (req, res) => {

        try {

            const departments =
                db.prepare(`
                    SELECT
                        id,
                        name,
                        description,
                        status,
                        created_at

                    FROM departments

                    ORDER BY
                        name ASC
                `)
                .all();


            return res.json({

                success: true,

                departments
            });


        } catch (error) {

            console.error(
                "Get departments error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to load departments"
            });
        }
    }
);


// =========================================================
// CREATE DEPARTMENT
// =========================================================

router.post(
    "/departments",
    requireRole("admin"),
    (req, res) => {

        try {

            const {
                name,
                description,
                status
            } = req.body || {};


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (
                !name ||
                !String(name).trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Department name is required"
                });
            }


            const departmentName =
                String(name).trim();


            const departmentDescription =
                description &&
                String(description).trim()
                    ? String(description).trim()
                    : null;


            const departmentStatus =
                status === "Inactive"
                    ? "Inactive"
                    : "Active";


            // -------------------------------------------------
            // CHECK DUPLICATE
            // -------------------------------------------------

            const existing =
                db.prepare(`
                    SELECT id
                    FROM departments
                    WHERE LOWER(name) = LOWER(?)
                    LIMIT 1
                `)
                .get(
                    departmentName
                );


            if (existing) {

                return res.status(409).json({
                    success: false,
                    message:
                        "A department with this name already exists"
                });
            }


            // -------------------------------------------------
            // INSERT
            // -------------------------------------------------

            const result =
                db.prepare(`
                    INSERT INTO departments
                    (
                        name,
                        description,
                        status
                    )

                    VALUES
                    (?, ?, ?)
                `)
                .run(
                    departmentName,
                    departmentDescription,
                    departmentStatus
                );


            // -------------------------------------------------
            // GET CREATED DEPARTMENT
            // -------------------------------------------------

            const department =
                db.prepare(`
                    SELECT
                        id,
                        name,
                        description,
                        status,
                        created_at

                    FROM departments

                    WHERE id = ?
                `)
                .get(
                    result.lastInsertRowid
                );


            return res.status(201).json({

                success: true,

                message:
                    "Department created successfully",

                department
            });


        } catch (error) {

            console.error(
                "Create department error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create department"
            });
        }
    }
);


// =========================================================
// UPDATE DEPARTMENT
// =========================================================

router.put(
    "/departments/:id",
    requireRole("admin"),
    (req, res) => {

        try {

            const departmentId =
                req.params.id;


            const {
                name,
                description,
                status
            } = req.body || {};


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (
                !name ||
                !String(name).trim()
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Department name is required"
                });
            }


            const departmentName =
                String(name).trim();


            const departmentDescription =
                description &&
                String(description).trim()
                    ? String(description).trim()
                    : null;


            const departmentStatus =
                status === "Inactive"
                    ? "Inactive"
                    : "Active";


            // -------------------------------------------------
            // CHECK DEPARTMENT EXISTS
            // -------------------------------------------------

            const existingDepartment =
                db.prepare(`
                    SELECT id
                    FROM departments
                    WHERE id = ?
                `)
                .get(
                    departmentId
                );


            if (!existingDepartment) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Department not found"
                });
            }


            // -------------------------------------------------
            // CHECK DUPLICATE NAME
            // -------------------------------------------------

            const duplicate =
                db.prepare(`
                    SELECT id
                    FROM departments

                    WHERE
                        LOWER(name) = LOWER(?)
                        AND id != ?

                    LIMIT 1
                `)
                .get(
                    departmentName,
                    departmentId
                );


            if (duplicate) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Another department already uses this name"
                });
            }


            // -------------------------------------------------
            // UPDATE
            // -------------------------------------------------

            db.prepare(`
                UPDATE departments

                SET
                    name = ?,
                    description = ?,
                    status = ?

                WHERE id = ?
            `)
            .run(
                departmentName,
                departmentDescription,
                departmentStatus,
                departmentId
            );


            // -------------------------------------------------
            // GET UPDATED DEPARTMENT
            // -------------------------------------------------

            const department =
                db.prepare(`
                    SELECT
                        id,
                        name,
                        description,
                        status,
                        created_at

                    FROM departments

                    WHERE id = ?
                `)
                .get(
                    departmentId
                );


            return res.json({

                success: true,

                message:
                    "Department updated successfully",

                department
            });


        } catch (error) {

            console.error(
                "Update department error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to update department"
            });
        }
    }
);


// =========================================================
// DELETE DEPARTMENT
// =========================================================

router.delete(
    "/departments/:id",
    requireRole("admin"),
    (req, res) => {

        try {

            const departmentId =
                req.params.id;


            // -------------------------------------------------
            // CHECK DEPARTMENT
            // -------------------------------------------------

            const department =
                db.prepare(`
                    SELECT
                        id,
                        name

                    FROM departments

                    WHERE id = ?
                `)
                .get(
                    departmentId
                );


            if (!department) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Department not found"
                });
            }


            // -------------------------------------------------
            // CHECK ALL DOCTORS
            // -------------------------------------------------
            // We check both Active and Inactive doctors.
            // This prevents foreign-key/reference problems.
            // -------------------------------------------------

            const doctorCount =
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM doctors
                    WHERE department_id = ?
                `)
                .get(
                    departmentId
                )
                .count;


            if (doctorCount > 0) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Cannot delete this department because doctors are assigned to it. Reassign or remove the doctors first."
                });
            }


            // -------------------------------------------------
            // DELETE DEPARTMENT
            // -------------------------------------------------

            db.prepare(`
                DELETE FROM departments
                WHERE id = ?
            `)
            .run(
                departmentId
            );


            return res.json({

                success: true,

                message:
                    "Department deleted successfully"
            });


        } catch (error) {

            console.error(
                "Delete department error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to delete department"
            });
        }
    }
);

// =========================================================
// ADMIN - GET ALL PATIENTS
// =========================================================

router.get(
    "/patients",
    requireRole("admin"),
    (req, res) => {

        try {

            const patients = db.prepare(`
                SELECT
                    p.id,
                    p.user_id,
                    u.name,
                    u.email,
                    u.phone,
                    p.date_of_birth,
                    p.gender,
                    p.blood_group,
                    p.address,
                    p.emergency_contact
                FROM patients p
                INNER JOIN users u
                    ON p.user_id = u.id
                ORDER BY p.created_at DESC
            `).all();


            const formattedPatients =
                patients.map(patient => {

                    let age = 0;

                    if (patient.date_of_birth) {

                        const dob =
                            new Date(
                                patient.date_of_birth
                            );

                        if (!isNaN(dob.getTime())) {

                            const today =
                                new Date();

                            age =
                                today.getFullYear() -
                                dob.getFullYear();

                            const monthDifference =
                                today.getMonth() -
                                dob.getMonth();

                            if (
                                monthDifference < 0 ||
                                (
                                    monthDifference === 0 &&
                                    today.getDate() < dob.getDate()
                                )
                            ) {
                                age--;
                            }

                        }

                    }


                    return {

                        id: patient.id,

                        userId:
                            patient.user_id,

                        name:
                            patient.name,

                        age,

                        gender:
                            patient.gender || "",

                        bloodGroup:
                            patient.blood_group || "",

                        department: "",

                        phone:
                            patient.phone || "",

                        email:
                            patient.email || "",

                        address:
                            patient.address || "",

                        emergencyContact:
                            patient.emergency_contact || "",

                        registeredAt:
                            null

                    };

                });


            return res.json({

                success: true,

                patients:
                    formattedPatients

            });

        } catch (error) {

            console.error(
                "Admin patients error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load patients"

            });

        }

    }
);


// =========================================================
// ADMIN - CREATE PATIENT
// =========================================================

router.post(
    "/patients",
    requireRole("admin"),
    async (req, res) => {

        try {

            const {
                name,
                age,
                gender,
                bloodGroup,
                phone,
                email,
                address
            } = req.body;


            if (
                !name ||
                !email ||
                !phone
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, email and phone are required"

                });

            }


            const normalizedEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            const existingUser =
                db.prepare(`
                    SELECT id
                    FROM users
                    WHERE email = ?
                `).get(
                    normalizedEmail
                );


            if (existingUser) {

                return res.status(409).json({

                    success: false,

                    message:
                        "A user with this email already exists"

                });

            }


            const temporaryPassword =
                "Patient@123";


            const hashedPassword =
                await bcrypt.hash(
                    temporaryPassword,
                    12
                );


            /*
             * Convert age into an approximate
             * date of birth because the database
             * stores date_of_birth rather than age.
             */

            let dateOfBirth = null;


            if (
                Number.isFinite(
                    Number(age)
                ) &&
                Number(age) > 0
            ) {

                const today =
                    new Date();

                const birthYear =
                    today.getFullYear() -
                    Number(age);

                dateOfBirth =
                    `${birthYear}-01-01`;

            }


            const createPatientTransaction =
                db.transaction(() => {

                    const userResult =
                        db.prepare(`
                            INSERT INTO users
                            (
                                name,
                                email,
                                password,
                                role,
                                phone
                            )
                            VALUES
                            (?, ?, ?, 'patient', ?)
                        `).run(

                            String(name).trim(),

                            normalizedEmail,

                            hashedPassword,

                            String(phone).trim()

                        );


                    const userId =
                        userResult.lastInsertRowid;


                    const patientResult =
                        db.prepare(`
                            INSERT INTO patients
                            (
                                user_id,
                                date_of_birth,
                                gender,
                                blood_group,
                                address
                            )
                            VALUES
                            (?, ?, ?, ?, ?)
                        `).run(

                            userId,

                            dateOfBirth,

                            gender
                                ? String(gender).trim()
                                : null,

                            bloodGroup
                                ? String(
                                    bloodGroup
                                ).trim()
                                : null,

                            address
                                ? String(
                                    address
                                ).trim()
                                : null

                        );


                    return {

                        userId,

                        patientId:
                            patientResult.lastInsertRowid

                    };

                });

                // =========================================================
// EXECUTE THE TRANSACTION
// =========================================================

const transaction =
    createPatientTransaction();


            return res.status(201).json({

                success: true,

                message:
                    "Patient created successfully",

                patientId:
                    transaction.patientId,

                temporaryPassword

            });

        } catch (error) {

            console.error(
                "Admin create patient error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to create patient"

            });

        }

    }
);


// =========================================================
// ADMIN - UPDATE PATIENT
// =========================================================

router.put(
    "/patients/:id",
    requireRole("admin"),
    async (req, res) => {

        try {

            const patientId =
                Number(req.params.id);


            const {
                name,
                age,
                gender,
                bloodGroup,
                phone,
                email,
                address
            } = req.body;


            const patient =
                db.prepare(`
                    SELECT
                        p.id,
                        p.user_id,
                        u.email
                    FROM patients p
                    INNER JOIN users u
                        ON p.user_id = u.id
                    WHERE p.id = ?
                `).get(
                    patientId
                );


            if (!patient) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Patient not found"

                });

            }


            const normalizedEmail =
                String(email || "")
                    .trim()
                    .toLowerCase();


            if (!name || !normalizedEmail) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name and email are required"

                });

            }


            const emailOwner =
                db.prepare(`
                    SELECT id
                    FROM users
                    WHERE email = ?
                    AND id != ?
                `).get(
                    normalizedEmail,
                    patient.user_id
                );


            if (emailOwner) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Another user already uses this email"

                });

            }


            let dateOfBirth = null;


            if (
                Number.isFinite(
                    Number(age)
                ) &&
                Number(age) > 0
            ) {

                const today =
                    new Date();

                const birthYear =
                    today.getFullYear() -
                    Number(age);

                dateOfBirth =
                    `${birthYear}-01-01`;

            }


            const transaction =
                db.transaction(() => {

                    db.prepare(`
                        UPDATE users
                        SET
                            name = ?,
                            email = ?,
                            phone = ?
                        WHERE id = ?
                    `).run(

                        String(name).trim(),

                        normalizedEmail,

                        phone
                            ? String(phone).trim()
                            : null,

                        patient.user_id

                    );


                    db.prepare(`
                        UPDATE patients
                        SET
                            date_of_birth = ?,
                            gender = ?,
                            blood_group = ?,
                            address = ?
                        WHERE id = ?
                    `).run(

                        dateOfBirth,

                        gender
                            ? String(gender).trim()
                            : null,

                        bloodGroup
                            ? String(
                                bloodGroup
                            ).trim()
                            : null,

                        address
                            ? String(
                                address
                            ).trim()
                            : null,

                        patientId

                    );

                });


            return res.json({

                success: true,

                message:
                    "Patient updated successfully"

            });

        } catch (error) {

            console.error(
                "Admin update patient error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update patient"

            });

        }

    }
);


// =========================================================
// ADMIN - DELETE PATIENT
// =========================================================

router.delete(
    "/patients/:id",
    requireRole("admin"),
    (req, res) => {

        try {

            const patientId =
                Number(req.params.id);


            const patient =
                db.prepare(`
                    SELECT
                        user_id
                    FROM patients
                    WHERE id = ?
                `).get(
                    patientId
                );


            if (!patient) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Patient not found"

                });

            }


            /*
             * Deleting the user cascades to
             * the patient profile because
             * patients.user_id has ON DELETE CASCADE.
             *
             * Appointments also cascade because
             * appointments.patient_id has
             * ON DELETE CASCADE.
             */

            db.prepare(`
                DELETE FROM users
                WHERE id = ?
            `).run(
                patient.user_id
            );


            return res.json({

                success: true,

                message:
                    "Patient deleted successfully"

            });

        } catch (error) {

            console.error(
                "Admin delete patient error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete patient"

            });

        }

    }
);

// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;