import React, { useState } from 'react';

const BookingModal = ({ room, onClose, onConfirm }) => {
    const [guestName, setGuestName] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guestName || !checkIn || !checkOut) return;

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            setError('Check-in date cannot be in the past');
            return;
        }

        if (checkOutDate <= checkInDate) {
            setError('Check-out date must be after check-in date');
            return;
        }

        setError('');
        onConfirm({
            roomId: room.id,
            guestName,
            checkIn,
            checkOut,
            status: 'Confirmed'
        });
    };

    // Get today's date for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📅 Book {room.name}</h3>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: '12px',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label>👤 Guest Name</label>
                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => {
                                setGuestName(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter guest name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>📆 Check-in Date</label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => {
                                setCheckIn(e.target.value);
                                setError('');
                            }}
                            min={today}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>📆 Check-out Date</label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => {
                                setCheckOut(e.target.value);
                                setError('');
                            }}
                            min={checkIn || today}
                            required
                        />
                    </div>

                    {checkIn && checkOut && !error && (
                        <div style={{
                            padding: '12px',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            ✓ Duration: {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights
                            <br />
                            💵 Total: ${(room.price * Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))).toFixed(2)}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            ❌ Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            ✅ Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
