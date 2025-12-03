const db = require('./database');

const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite'];
const PRICES = { 'Standard': 80, 'Deluxe': 150, 'Suite': 300 };

function seed() {
    console.log('🌱 Seeding database...');

    db.serialize(() => {
        // Clear existing data
        db.run('DELETE FROM rooms');
        db.run('DELETE FROM bookings');
        db.run('DELETE FROM users'); // Optional: clear users too

        // Seed Rooms
        const stmt = db.prepare('INSERT INTO rooms (name, type, price, image_url) VALUES (?, ?, ?, ?)');

        for (let i = 1; i <= 20; i++) {
            const type = ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)];
            const price = PRICES[type] + Math.floor(Math.random() * 20);
            const name = `Room ${100 + i}`;
            // Use placeholder images or leave null
            const imageUrl = null;

            stmt.run(name, type, price, imageUrl);
        }

        stmt.finalize();
        console.log('✅ Added 20 sample rooms.');

        // Seed a default user
        const bcrypt = require('bcryptjs');
        const password = bcrypt.hashSync('password123', 8);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', ['admin@example.com', password], (err) => {
            if (err) console.log('User already exists or error:', err.message);
            else console.log('✅ Added admin user (admin@example.com / password123)');
        });
    });
}

// Wait for DB connection
setTimeout(seed, 1000);
