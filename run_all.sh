#!/bin/bash

# ============================================
# Travel Assistant - Start Both Backend & Frontend (Mac/Linux)
# ============================================

echo ""
echo "========================================"
echo "  Travel Assistant - Quick Start"
echo "========================================"
echo ""

# Get the directory where this script is located
BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$BASEDIR"

echo "[1/2] Starting Backend (Spring Boot)..."
echo ""
cd travel-assistant/backend
mvn spring-boot:run &
BACKEND_PID=$!

# Wait 10 seconds for backend to start
echo "Waiting for backend to initialize..."
sleep 10

echo ""
echo "[2/2] Starting Frontend (Angular)..."
echo ""
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Services Starting..."
echo "========================================"
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:4200"
echo "Admin:    http://localhost:4200/admin"
echo ""
echo "Email:    admin@tripx.com"
echo "Password: Admin@Tripx2026"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID
wait $FRONTEND_PID
