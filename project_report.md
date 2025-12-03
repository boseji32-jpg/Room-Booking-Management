# Room Rent Manager - Full Project Report

## 1. Executive Summary
This project is a **Fullstack Web Application** for managing room rentals. It features a modern, responsive frontend built with **React** and a robust custom backend using **Node.js, Express, and SQLite**. The application allows users to browse rooms via an interactive slider, manage bookings, and administer room listings.

## 2. Technology Stack
-   **Frontend**: React (Vite), CSS3 (Custom Variables), JavaScript (ES6+)
-   **Backend**: Node.js, Express.js
-   **Database**: SQLite (Relational DB)
-   **Authentication**: JWT (JSON Web Tokens) with bcrypt hashing
-   **File Storage**: Local file system (via Multer)

## 3. Database Schema
The SQLite database (`server/database.sqlite`) consists of three main tables:

### `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PK | Unique User ID |
| `email` | TEXT UNIQUE | User Email |
| `password` | TEXT | Hashed Password |
| `created_at` | DATETIME | Timestamp |

### `rooms`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PK | Unique Room ID |
| `name` | TEXT | Room Name (e.g., "Ocean View") |
| `type` | TEXT | Type (Standard, Deluxe, Suite) |
| `price` | REAL | Price per night |
| `image_url` | TEXT | URL to room image |

### `bookings`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PK | Unique Booking ID |
| `room_id` | INTEGER FK | Links to `rooms.id` |
| `guest_name` | TEXT | Name of the guest |
| `check_in` | DATE | Start Date |
| `check_out` | DATE | End Date |
| `status` | TEXT | Booking Status |

## 4. API Documentation
The backend exposes the following RESTful endpoints at `http://localhost:3001/api`:

### Authentication
-   `POST /auth/register`: Register a new user.
-   `POST /auth/login`: Authenticate and receive a JWT token.

### Rooms
-   `GET /rooms`: Retrieve all rooms (includes booking data).
-   `POST /rooms`: Add a new room.
-   `PUT /rooms/:id`: Update room details.
-   `DELETE /rooms/:id`: Delete a room.

### Bookings
-   `POST /bookings`: Create a new booking.
-   `DELETE /bookings/room/:roomId`: Clear bookings for a specific room.

### Uploads
-   `POST /upload`: Upload an image file (returns URL).

## 5. Frontend Features
-   **Interactive Dashboard**: Features a horizontal **Room Slider** for browsing.
-   **Dynamic Stats**: Real-time cards showing Total Rooms, Availability, and Occupancy.
-   **Theme System**: Toggle between Light and Dark modes (Teal & Coral palette).
-   **Booking Management**: Modal interface for booking rooms with date validation.
-   **Responsive Design**: Fully functional on desktop and mobile devices.

## 6. Verification Report
An automated verification script (`verify_api.js`) was executed to validate the backend.

**Test Results:**
```
1. Testing Registration... ✅ Success
2. Testing Login...        ✅ Success
3. Testing Create Room...  ✅ Success
4. Testing Get Rooms...    ✅ Success
5. Testing Book Room...    ✅ Success
6. Verifying Booking...    ✅ Success
7. Cleaning up...          ✅ Success
```

## 7. How to Run
### Prerequisites
-   Node.js installed.

### Steps
1.  **Start Backend**:
    ```bash
    cd room-rent-manager
    node server/index.cjs
    ```
2.  **Start Frontend** (in a new terminal):
    ```bash
    cd room-rent-manager
    npm run dev
    ```
3.  **Access App**: Open `http://localhost:5173`
4.  **Login**:
    -   Email: `admin@example.com`
    -   Password: `password123`
