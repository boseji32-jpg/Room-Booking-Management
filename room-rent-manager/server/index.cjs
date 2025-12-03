const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database.cjs');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'super_secret_key_change_this_in_production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// --- Auth Routes ---

app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            return res.status(500).json({ error: err.message });
        }
        const token = jwt.sign({ id: this.lastID, email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ user: { id: this.lastID, email }, token });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ token: null, error: 'Invalid Password' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ user: { id: user.id, email: user.email }, token });
    });
});

// --- Room Routes ---

app.get('/api/rooms', (req, res) => {
    const sql = `
        SELECT r.*, 
        json_group_array(
            json_object(
                'id', b.id, 
                'checkIn', b.check_in, 
                'checkOut', b.check_out, 
                'guestName', b.guest_name,
                'status', b.status
            )
        ) as bookings 
        FROM rooms r 
        LEFT JOIN bookings b ON r.id = b.room_id 
        GROUP BY r.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Parse bookings JSON string back to object (SQLite returns string for json_group_array)
        const rooms = rows.map(row => {
            let bookings = [];
            try {
                bookings = JSON.parse(row.bookings);
                // Filter out nulls if left join produced [null]
                bookings = bookings.filter(b => b.id !== null);
            } catch (e) { }
            return { ...row, bookings };
        });

        res.json(rooms);
    });
});

app.post('/api/rooms', (req, res) => {
    const { name, type, price, imageUrl } = req.body;
    db.run(`INSERT INTO rooms (name, type, price, image_url) VALUES (?, ?, ?, ?)`,
        [name, type, price, imageUrl],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, type, price, imageUrl, bookings: [] });
        }
    );
});

app.put('/api/rooms/:id', (req, res) => {
    const { name, type, price, imageUrl } = req.body;
    // Dynamic update query could be better, but simple for now
    db.run(`UPDATE rooms SET name = COALESCE(?, name), type = COALESCE(?, type), price = COALESCE(?, price), image_url = COALESCE(?, image_url) WHERE id = ?`,
        [name, type, price, imageUrl, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Room updated', changes: this.changes });
        }
    );
});

app.delete('/api/rooms/:id', (req, res) => {
    db.run(`DELETE FROM rooms WHERE id = ?`, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Room deleted', changes: this.changes });
    });
});

// --- Booking Routes ---

app.post('/api/bookings', (req, res) => {
    const { roomId, guestName, email, checkIn, checkOut, totalPrice } = req.body;
    db.run(`INSERT INTO bookings (room_id, guest_name, email, check_in, check_out, total_price) VALUES (?, ?, ?, ?, ?, ?)`,
        [roomId, guestName, email, checkIn, checkOut, totalPrice],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, roomId, guestName, email, checkIn, checkOut, totalPrice, status: 'confirmed' });
        }
    );
});

app.delete('/api/bookings/room/:roomId', (req, res) => {
    db.run(`DELETE FROM bookings WHERE room_id = ?`, req.params.roomId, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Bookings cleared', changes: this.changes });
    });
});

// --- Upload Route ---

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
