import React from 'react';

const RoomCard = ({ room, onBook, onManage }) => {
    const isBooked = room.bookings && room.bookings.length > 0;

    // Calculate days left to free if booked
    let daysLeft = null;
    if (isBooked) {
        const lastBooking = room.bookings[room.bookings.length - 1];
        const checkOutDate = new Date(lastBooking.checkOut);
        const today = new Date();
        const daysRemaining = Math.ceil((checkOutDate - today) / (1000 * 60 * 60 * 24));
        daysLeft = daysRemaining > 0 ? daysRemaining : 0;
    }

    return (
        <div className="room-card">
            <div className="room-image-container">
                {room.imageUrl ? (
                    <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="room-image"
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--primary-color)', fontSize: '4rem', opacity: 0.5 }}>
                        🏨
                    </div>
                )}
                <div className={`room-badge ${isBooked ? 'booked' : 'available'}`}>
                    {isBooked ? `Booked (${daysLeft}d left)` : 'Available'}
                </div>
            </div>

            <div className="room-content">
                <div className="room-header">
                    <div>
                        <h3 className="room-title">{room.name}</h3>
                        <div className="room-type">
                            {room.type === 'Suite' ? '👑' : room.type === 'Deluxe' ? '✨' : '🛏️'}
                            {room.type}
                        </div>
                    </div>
                    <div className="room-price">
                        ${room.price}<span>/night</span>
                    </div>
                </div>

                {isBooked && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '6px' }}>
                        👤 Guest: {room.bookings[room.bookings.length - 1].guestName}
                    </div>
                )}

                <div className="room-actions">
                    {isBooked ? (
                        <button onClick={() => onManage(room)} className="btn-manage">
                            Manage Booking
                        </button>
                    ) : (
                        <button onClick={() => onBook(room)} className="btn-book">
                            Book Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
