const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Rooms Table
        db.run(`CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            price REAL NOT NULL,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Bookings Table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id INTEGER NOT NULL,
            guest_name TEXT NOT NULL,
            email TEXT NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            total_price REAL,
            status TEXT DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms (id)
        )`);

        console.log('Database tables initialized.');
    });
}

module.exports = db;
