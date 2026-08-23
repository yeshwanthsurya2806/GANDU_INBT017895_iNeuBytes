const bcrypt = require("bcryptjs");

const db = require("./config/database");

require("./config/initDatabase");


// =========================================================
// SEED DATA
// =========================================================

async function seedDatabase() {

    console.log("🌱 Starting database seed...");


    // =====================================================
    // DEPARTMENTS
    // =====================================================

    const departments = [
        {
            name: "Cardiology",
            description: "Heart and cardiovascular care"
        },
        {
            name: "Neurology",
            description: "Brain and nervous system care"
        },
        {
            name: "Orthopedics",
            description: "Bone and joint care"
        },
        {
            name: "Pediatrics",
            description: "Healthcare for children"
        },
        {
            name: "General Medicine",
            description: "General healthcare and consultation"
        }
    ];


    const departmentInsert = db.prepare(`
        INSERT OR IGNORE INTO departments
        (
            name,
            description
        )
        VALUES (?, ?)
    `);


    for (const department of departments) {

        departmentInsert.run(
            department.name,
            department.description
        );

    }


    // =====================================================
    // HELPER FUNCTION
    // =====================================================

    async function createUser(
        name,
        email,
        password,
        role,
        phone
    ) {

        const existing = db
            .prepare(
                "SELECT id FROM users WHERE email = ?"
            )
            .get(email);


        if (existing) {

            console.log(
                `ℹ️ ${role} already exists: ${email}`
            );

            return existing.id;

        }


        const hashedPassword =
            await bcrypt.hash(password, 12);


        const result = db
            .prepare(`
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role,
                    phone
                )
                VALUES (?, ?, ?, ?, ?)
            `)
            .run(
                name,
                email,
                hashedPassword,
                role,
                phone
            );


        console.log(
            `✅ Created ${role}: ${email}`
        );


        return result.lastInsertRowid;

    }


    // =====================================================
    // ADMIN
    // =====================================================

    await createUser(
        "PulseCare Administrator",
        "admin@pulsecare.com",
        "Admin@123",
        "admin",
        "9876543210"
    );


    // =====================================================
    // DOCTOR
    // =====================================================

    const doctorUserId = await createUser(
        "Dr. Ananya Sharma",
        "doctor@pulsecare.com",
        "Doctor@123",
        "doctor",
        "9876543211"
    );


    // =====================================================
    // DOCTOR PROFILE
    // =====================================================

    const doctorExists = db
        .prepare(
            "SELECT id FROM doctors WHERE user_id = ?"
        )
        .get(doctorUserId);


    if (!doctorExists) {

        const cardiology = db
            .prepare(
                "SELECT id FROM departments WHERE name = ?"
            )
            .get("Cardiology");


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
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            doctorUserId,
            cardiology.id,
            "MD, DM Cardiology",
            12,
            1200,
            "Cardiologist",
            "Active"
        );

    }


    // =====================================================
    // PATIENT
    // =====================================================

    const patientUserId = await createUser(
        "Rahul Kumar",
        "patient@pulsecare.com",
        "Patient@123",
        "patient",
        "9876543212"
    );


    // =====================================================
    // PATIENT PROFILE
    // =====================================================

    const patientExists = db
        .prepare(
            "SELECT id FROM patients WHERE user_id = ?"
        )
        .get(patientUserId);


    if (!patientExists) {

        db.prepare(`
            INSERT INTO patients
            (
                user_id,
                gender,
                blood_group,
                address
            )
            VALUES (?, ?, ?, ?)
        `).run(
            patientUserId,
            "Male",
            "O+",
            "Vellore, Tamil Nadu"
        );

    }


    console.log("");
    console.log("======================================");
    console.log("🎉 DATABASE SEED COMPLETED");
    console.log("======================================");
    console.log("");
    console.log("ADMIN");
    console.log("Email: admin@pulsecare.com");
    console.log("Password: Admin@123");
    console.log("");
    console.log("DOCTOR");
    console.log("Email: doctor@pulsecare.com");
    console.log("Password: Doctor@123");
    console.log("");
    console.log("PATIENT");
    console.log("Email: patient@pulsecare.com");
    console.log("Password: Patient@123");
    console.log("");
    console.log("======================================");


    db.close();

}


seedDatabase().catch((error) => {

    console.error("❌ Seed failed:", error);

    process.exit(1);

});