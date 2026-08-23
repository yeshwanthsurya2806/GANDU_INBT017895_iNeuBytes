const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../config/database");

const router = express.Router();


// =========================================================
// REGISTER
// =========================================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // CHECK EXISTING USER
        // ---------------------------------------------

        const existingUser = db
            .prepare(
                "SELECT id FROM users WHERE email = ?"
            )
            .get(normalizedEmail);


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });

        }


        // ---------------------------------------------
        // HASH PASSWORD
        // ---------------------------------------------

        const hashedPassword =
            await bcrypt.hash(password, 12);


        // ---------------------------------------------
        // CREATE USER
        // ---------------------------------------------

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
                VALUES (?, ?, ?, 'patient', ?)
            `)
            .run(
                name.trim(),
                normalizedEmail,
                hashedPassword,
                phone || null
            );


        // ---------------------------------------------
        // CREATE PATIENT PROFILE
        // ---------------------------------------------

        db.prepare(`
            INSERT INTO patients
            (
                user_id
            )
            VALUES (?)
        `).run(result.lastInsertRowid);


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        res.status(201).json({

            success: true,

            message: "Patient account created successfully",

            user: {
                id: result.lastInsertRowid,
                name: name.trim(),
                email: normalizedEmail,
                role: "patient"
            }

        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });

    }

});


// =========================================================
// LOGIN
// =========================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // VALIDATION
        // ---------------------------------------------

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // ---------------------------------------------
        // FIND USER
        // ---------------------------------------------

        const user = db
            .prepare(`
                SELECT
                    id,
                    name,
                    email,
                    password,
                    role,
                    phone,
                    profile_picture
                FROM users
                WHERE email = ?
            `)
            .get(normalizedEmail);


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        // ---------------------------------------------
        // VERIFY PASSWORD
        // ---------------------------------------------

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatches) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        // ---------------------------------------------
        // CREATE SESSION
        // ---------------------------------------------

        req.session.user = {

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role,

            phone: user.phone,

            profile_picture: user.profile_picture

        };


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        res.json({

            success: true,

            message: "Login successful",

            user: req.session.user

        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });

    }

});


// =========================================================
// CURRENT USER
// =========================================================

router.get("/me", (req, res) => {

    if (!req.session || !req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Not logged in"
        });

    }


    res.json({

        success: true,

        user: req.session.user

    });

});


// =========================================================
// LOGOUT
// =========================================================

router.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error("Logout error:", error);

            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });

        }


        res.clearCookie("connect.sid");


        res.json({

            success: true,

            message: "Logged out successfully"

        });

    });

});

// ==========================================
// GET CURRENT LOGGED-IN USER
// ==========================================

router.get("/me", (req, res) => {

    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    res.json({
        success: true,
        user: req.session.user
    });
});


// ==========================================
// LOGOUT
// ==========================================

router.post("/logout", (req, res) => {

    if (!req.session) {
        return res.json({
            success: true,
            message: "Already logged out"
        });
    }

    req.session.destroy((err) => {

        if (err) {
            console.error("Logout error:", err);

            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });
        }

        res.clearCookie("connect.sid");

        return res.json({
            success: true,
            message: "Logged out successfully"
        });
    });
});

// =========================================================
// EXPORT ROUTER
// =========================================================

module.exports = router;