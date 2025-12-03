import React, { useRef } from 'react';
import RoomCard from './RoomCard';

const RoomSlider = ({ rooms, onBook, onManage }) => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            const scrollAmount = 340; // Card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (!rooms || rooms.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <h3>No properties found</h3>
                <p>Add a new property to get started.</p>
            </div>
        );
    }

    return (
        <div className="room-slider-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Featured Properties ({rooms.length})</h3>
                <div className="slider-controls">
                    <button className="slider-btn" onClick={() => scroll('left')} aria-label="Scroll Left">
                        ←
                    </button>
                    <button className="slider-btn" onClick={() => scroll('right')} aria-label="Scroll Right">
                        →
                    </button>
                </div>
            </div>

            <div className="room-slider" ref={sliderRef}>
                {rooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        onBook={onBook}
                        onManage={onManage}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomSlider;
