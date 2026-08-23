const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Path to database folder
const databaseDirectory = path.join(__dirname, "../../database");

// Create database directory if it doesn't exist
if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

// Database file
const databasePath = path.join(
    databaseDirectory,
    "pulsecare.db"
);

// Connect to SQLite
const db = new Database(databasePath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Improve SQLite performance
db.pragma("journal_mode = WAL");

console.log("✅ PulseCare SQLite database connected");

module.exports = db;