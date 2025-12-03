import React, { useState, useEffect } from 'react';
import RoomSlider from './components/RoomSlider';
import AddRoomForm from './components/AddRoomForm';
import BookingModal from './components/BookingModal';
import Login from './components/Login';
import {
    subscribeToRooms,
    addRoom as addRoomToFirestore,
    updateRoom,
    addBooking,
    clearBookings,
    migrateRoomsToFirestore
} from './services/roomService';
import { subscribeToAuth, logout } from './services/authService';
import { uploadRoomImage } from './services/storageService';

function App() {
    const [rooms, setRooms] = useState([]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });
    const [loading, setLoading] = useState(true);
    const [migrated, setMigrated] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showAddRoom, setShowAddRoom] = useState(false);

    // Theme effect
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Auth subscription
    useEffect(() => {
        const unsubscribe = subscribeToAuth((user) => {
            setUser(user);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Firestore real-time subscription
    useEffect(() => {
        const unsubscribe = subscribeToRooms((firestoreRooms) => {
            if (firestoreRooms.length === 0 && !migrated) {
                const localRooms = localStorage.getItem('rooms');
                if (localRooms) {
                    try {
                        const parsedRooms = JSON.parse(localRooms);
                        if (parsedRooms.length > 0) {
                            migrateRoomsToFirestore(parsedRooms)
                                .then(() => {
                                    localStorage.removeItem('rooms');
                                    setMigrated(true);
                                })
                                .catch((error) => {
                                    console.error('Migration failed:', error);
                                    setRooms(parsedRooms);
                                    setLoading(false);
                                });
                            return;
                        }
                    } catch (error) {
                        console.error('Error parsing localStorage rooms:', error);
                    }
                }
                setMigrated(true);
            }
            setRooms(firestoreRooms);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [migrated]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const addRoom = async (roomData) => {
        try {
            const { imageFile, ...roomDetails } = roomData;
            const roomId = await addRoomToFirestore(roomDetails);

            if (imageFile) {
                const imageUrl = await uploadRoomImage(imageFile, roomId);
                if (imageUrl) {
                    await updateRoom(roomId, { imageUrl });
                }
            }
            setShowAddRoom(false);
        } catch (error) {
            console.error('Failed to add room:', error);
            alert('Failed to add room. Please try again.');
        }
    };

    const openBookingModal = (room) => {
        setSelectedRoom(room);
        setIsBookingModalOpen(true);
    };

    const closeBookingModal = () => {
        setIsBookingModalOpen(false);
        setSelectedRoom(null);
    };

    const handleBooking = async (bookingData) => {
        try {
            const room = rooms.find(r => r.id === bookingData.roomId);
            if (room) {
                await addBooking(bookingData.roomId, bookingData, room.bookings || []);
                closeBookingModal();
            }
        } catch (error) {
            console.error('Failed to add booking:', error);
            alert('Failed to add booking. Please try again.');
        }
    };

    const handleManage = async (room) => {
        if (confirm(`Release room ${room.name}? This will clear all bookings.`)) {
            try {
                await clearBookings(room.id);
            } catch (error) {
                console.error('Failed to clear bookings:', error);
                alert('Failed to clear bookings. Please try again.');
            }
        }
    };

    // Calculate statistics
    const totalRooms = rooms.length;
    const bookedRooms = rooms.filter(r => r.bookings && r.bookings.length > 0).length;
    const availableRooms = totalRooms - bookedRooms;
    const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

    if (loading || authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>🏨 RoomManager</h1>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item active">
                        <span>📊</span> Dashboard
                    </div>
                    <div className="nav-item" onClick={() => setShowAddRoom(!showAddRoom)}>
                        <span>➕</span> Add Room
                    </div>
                    <div className="nav-item">
                        <span>📅</span> Bookings
                    </div>
                    <div className="nav-item">
                        <span>⚙️</span> Settings
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <div className="nav-item" onClick={logout}>
                        <span>🚪</span> Logout
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <div className="page-title">
                        <h2>Dashboard</h2>
                        <p>Welcome back, {user.email}</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-icon" onClick={toggleTheme}>
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <div className="user-avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user.email[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                            🏠
                        </div>
                        <div className="stat-info">
                            <h3>Total Rooms</h3>
                            <div className="stat-value">{totalRooms}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            ✅
                        </div>
                        <div className="stat-info">
                            <h3>Available</h3>
                            <div className="stat-value">{availableRooms}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                            🔒
                        </div>
                        <div className="stat-info">
                            <h3>Booked</h3>
                            <div className="stat-value">{bookedRooms}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                            📈
                        </div>
                        <div className="stat-info">
                            <h3>Occupancy</h3>
                            <div className="stat-value">{occupancyRate}%</div>
                        </div>
                    </div>
                </div>

                {/* Add Room Section (Toggleable) */}
                {showAddRoom && (
                    <div className="add-room-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3>Add New Property</h3>
                            <button onClick={() => setShowAddRoom(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                        </div>
                        <AddRoomForm onAddRoom={addRoom} />
                    </div>
                )}

                {/* Room Grid */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Property Listings</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
                                <option>All Types</option>
                                <option>Standard</option>
                                <option>Deluxe</option>
                                <option>Suite</option>
                            </select>
                        </div>
                    </div>

                    <RoomSlider
                        rooms={rooms}
                        onBook={openBookingModal}
                        onManage={handleManage}
                    />
                </section>
            </main>

            {isBookingModalOpen && selectedRoom && (
                <BookingModal
                    room={selectedRoom}
                    onClose={closeBookingModal}
                    onConfirm={handleBooking}
                />
            )}
        </div>
    );
}

export default App;
