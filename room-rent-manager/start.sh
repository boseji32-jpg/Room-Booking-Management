#!/bin/bash

# Function to find a free port
find_free_port() {
    local port=$(shuf -i 3000-9000 -n 1)
    while ss -tan | grep -q ":$port "; do
        port=$(sh

uf -i 3000-9000 -n 1)
    done
    echo $port
}

# Find ports
BACKEND_PORT=$(find_free_port)
FRONTEND_PORT=$(find_free_port)
while [ "$FRONTEND_PORT" == "$BACKEND_PORT" ]; do
    FRONTEND_PORT=$(find_free_port)
done

echo "🚀 Starting Room Rent Manager..."
echo "Backend Port: $BACKEND_PORT"
echo "Frontend Port: $FRONTEND_PORT"

# Change to project directory
cd ~/room-rent-manager

# Start Backend with setsid for true daemonization
export PORT=$BACKEND_PORT  
setsid node server/index.cjs > backend.log 2>&1 < /dev/null &
BACKEND_PID=$!
echo "Backend starting (PID: $BACKEND_PID)..."
sleep 2

# Start Frontend
export VITE_API_URL="http://localhost:$BACKEND_PORT/api"
setsid npm run dev -- --port $FRONTEND_PORT --host > frontend.log 2>&1 < /dev/null &
FRONTEND_PID=$!
echo "Frontend starting (PID: $FRONTEND_PID)..."
sleep 4

# Save PIDs
echo "$BACKEND_PID" > .pids
echo "$FRONTEND_PID" >> .pids

# Check if processes are running
echo ""
echo "Checking process status..."
if ps -p $BACKEND_PID > /dev/null 2>&1; then
    echo "✅ Backend (PID $BACKEND_PID): RUNNING on http://localhost:$BACKEND_PORT"
else
    echo "❌ Backend (PID $BACKEND_PID): STOPPED"
    echo "Last 10 lines of backend.log:"
    tail -10 backend.log
fi

if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    echo "✅ Frontend (PID $FRONTEND_PID): RUNNING on http://localhost:$FRONTEND_PORT"
else
    echo "❌ Frontend (PID $FRONTEND_PID): STOPPED"
    echo "Last 10 lines of frontend.log:"
    tail -10 frontend.log
fi

echo ""
echo "📝 Logs: ~/room-rent-manager/backend.log, ~/room-rent-manager/frontend.log"
echo "💡 Use 'bash status.sh' to check status, 'bash stop.sh' to stop"
