#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PORT=8080

echo "🎹 Starting Keyboard Practice..."

lsof -ti:$PORT | xargs kill -9 2>/dev/null

cd "$PROJECT_DIR"
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

echo $SERVER_PID > /tmp/keyboard-practice-server.pid

sleep 1

open "http://localhost:$PORT/index.html"

echo "🚀 Server running at http://localhost:$PORT"
echo "📝 Press any key to stop..."
echo ""

read -n 1
./stop.sh