const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const subscribeToRooms = (callback) => {
    const fetchRooms = async () => {
        try {
            const response = await fetch(`${API_URL}/rooms`);
            if (response.ok) {
                const rooms = await response.json();
                callback(rooms);
            }
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };

    fetchRooms();
    // Poll every 2 seconds for updates
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
};

export const addRoom = async (roomData) => {
    const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
    });
    if (!response.ok) throw new Error('Failed to add room');
    const data = await response.json();
    return data.id;
};

export const updateRoom = async (roomId, updates) => {
    const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update room');
};

export const deleteRoom = async (roomId) => {
    const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete room');
};

export const addBooking = async (roomId, bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookingData, roomId })
    });
    if (!response.ok) throw new Error('Failed to add booking');
};

export const clearBookings = async (roomId) => {
    const response = await fetch(`${API_URL}/bookings/room/${roomId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to clear bookings');
};

export const migrateRoomsToFirestore = async (rooms) => {
    // No-op for now, or implement migration to SQLite if needed
    console.log('Migration not implemented for SQLite');
    return Promise.resolve();
};
