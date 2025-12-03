import React from 'react';
import RoomCard from './RoomCard';

const RoomList = ({ rooms, onBook, onManage }) => {
    if (!rooms || rooms.length === 0) {
        return <div className="empty-state">No rooms available. Add one to get started!</div>;
    }

    return (
        <div className="room-list">
            {rooms.map(room => (
                <RoomCard
                    key={room.id}
                    room={room}
                    onBook={onBook}
                    onManage={onManage}
                />
            ))}
        </div>
    );
};

export default RoomList;
