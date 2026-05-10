#!/bin/bash

PORT=8080

lsof -ti:$PORT | xargs kill -9 2>/dev/null
rm -f /tmp/keyboard-practice-server.pid

echo "🛑 Server stopped"