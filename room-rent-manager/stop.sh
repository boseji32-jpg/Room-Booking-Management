#!/bin/bash

if [ -f .pids ]; then
    echo "🛑 Stopping Room Rent Manager..."
    while read pid; do
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            echo "Killed process $pid"
        else
            echo "Process $pid not found"
        fi
    done < .pids
    rm .pids
    echo "✅ Stopped."
else
    echo "No .pids file found. Is the app running?"
fi
