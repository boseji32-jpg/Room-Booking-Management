#!/bin/bash

if [ -f .pids ]; then
    echo "📊 App Status:"
    running=0
    while read pid; do
        if kill -0 $pid 2>/dev/null; then
            echo "Process $pid: RUNNING"
            running=$((running+1))
        else
            echo "Process $pid: STOPPED"
        fi
    done < .pids
    
    if [ $running -eq 2 ]; then
        echo "✅ System is healthy."
    else
        echo "⚠️  System is partially running or stopped."
    fi
else
    echo "⚪ App is not running (.pids file missing)."
fi
