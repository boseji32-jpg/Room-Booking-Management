const API_URL = 'http://localhost:3001/api';

async function runTests() {
    console.log('🚀 Starting API Verification...');
    let token = '';
    let userId = '';
    let roomId = '';

    // 1. Test Register
    try {
        console.log('\n1. Testing Registration...');
        const email = `test_${Date.now()}@example.com`;
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        console.log('✅ Registration successful:', data.user.email);
    } catch (e) {
        console.error('❌ Registration failed:', e.message);
    }

    // 2. Test Login
    try {
        console.log('\n2. Testing Login...');
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'password123' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        token = data.token;
        userId = data.user.id;
        console.log('✅ Login successful. Token received.');
    } catch (e) {
        console.error('❌ Login failed:', e.message);
        return; // Cannot proceed without token
    }

    // 3. Test Create Room
    try {
        console.log('\n3. Testing Create Room...');
        const res = await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // If we add auth middleware later
            },
            body: JSON.stringify({
                name: 'API Test Room',
                type: 'Deluxe',
                price: 999,
                imageUrl: ''
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        roomId = data.id;
        console.log('✅ Room created:', data.name, `(ID: ${roomId})`);
    } catch (e) {
        console.error('❌ Create Room failed:', e.message);
    }

    // 4. Test Get Rooms
    try {
        console.log('\n4. Testing Get Rooms...');
        const res = await fetch(`${API_URL}/rooms`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const createdRoom = data.find(r => r.id === roomId);
        if (createdRoom) console.log('✅ Created room found in list.');
        else console.error('❌ Created room NOT found in list.');
    } catch (e) {
        console.error('❌ Get Rooms failed:', e.message);
    }

    // 5. Test Book Room
    try {
        console.log('\n5. Testing Book Room...');
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: roomId,
                guestName: 'API Tester',
                email: 'tester@api.com',
                checkIn: '2025-01-01',
                checkOut: '2025-01-05',
                totalPrice: 4000
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        console.log('✅ Booking created for guest:', data.guestName);
    } catch (e) {
        console.error('❌ Book Room failed:', e.message);
    }

    // 6. Verify Booking in Room Details
    try {
        console.log('\n6. Verifying Booking...');
        const res = await fetch(`${API_URL}/rooms`);
        const data = await res.json();
        const room = data.find(r => r.id === roomId);
        if (room && room.bookings && room.bookings.length > 0) {
            console.log('✅ Booking confirmed in room details.');
        } else {
            console.error('❌ Booking NOT found in room details.');
        }
    } catch (e) {
        console.error('❌ Verify Booking failed:', e.message);
    }

    // 7. Cleanup
    try {
        console.log('\n7. Cleaning up...');
        // Delete bookings first (foreign key)
        await fetch(`${API_URL}/bookings/room/${roomId}`, { method: 'DELETE' });
        // Delete room
        await fetch(`${API_URL}/rooms/${roomId}`, { method: 'DELETE' });
        console.log('✅ Cleanup successful.');
    } catch (e) {
        console.error('❌ Cleanup failed:', e.message);
    }

    console.log('\n✨ Verification Complete.');
}

runTests();
