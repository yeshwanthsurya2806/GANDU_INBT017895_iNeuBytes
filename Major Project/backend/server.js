const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const db = require("./config/database");

require("./config/initDatabase");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const doctorRoutes = require("./routes/doctor");
const patientRoutes = require("./routes/patient");
const notificationRoutes = require("./routes/notifications");

const app = express();

const PORT = process.env.PORT || 5000;


// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));



// =========================================================
// SESSION
// =========================================================

app.use(
    session({
        secret: "pulsecare-development-secret",
        resave: false,
        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60 * 4,
            httpOnly: true,
            secure: false
        }
    })
);

// =========================================================
// API ROUTES
// =========================================================

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/notifications", notificationRoutes);


// =========================================================
// STATIC FILES
// =========================================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);

app.use(
    "/",
    express.static(
        path.join(__dirname, "../frontend")
    )
);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../frontend/login.html"
        )
    );
});


// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "PulseCare API is running",
        timestamp: new Date().toISOString()
    });

});


// =========================================================
// DATABASE TEST
// =========================================================

app.get("/api/database-test", (req, res) => {

    try {

        const result = db
            .prepare("SELECT 1 AS connected")
            .get();

        res.json({
            success: true,
            message: "Database connection successful",
            database: result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });

    }

});


// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});


// =========================================================
// ERROR HANDLER
// =========================================================

app.use((error, req, res, next) => {

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// =========================================================
// START SERVER
// =========================================================

app.listen(PORT, () => {

    console.log("");
    console.log("==========================================");
    console.log("🏥 PULSECARE HEALTHCARE MANAGEMENT SYSTEM");
    console.log("==========================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database test: http://localhost:${PORT}/api/database-test`);
    console.log("==========================================");
    console.log("");

});