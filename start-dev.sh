#!/bin/bash

# DriftWatch Development Startup Script
# Starts both Next.js server and background worker

echo "🚀 Starting DriftWatch in development mode..."
echo ""

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    echo "❌ Redis is not running. Please start Redis first:"
    echo "   brew services start redis"
    exit 1
fi

echo "✅ Redis is running"
echo ""

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "⚠️  Warning: PostgreSQL might not be running"
    echo "   If you encounter database errors, start PostgreSQL with:"
    echo "   brew services start postgresql@14"
    echo ""
fi

# Start Next.js dev server in background
echo "📦 Starting Next.js server on http://localhost:3000..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Start worker process
echo "⚙️  Starting background worker..."
npm run worker:dev &
WORKER_PID=$!

echo ""
echo "✅ DriftWatch is running!"
echo ""
echo "   🌐 Frontend: http://localhost:3000"
echo "   📊 Database Studio: npm run db:studio"
echo ""
echo "Press Ctrl+C to stop all processes"
echo ""

# Trap Ctrl+C and kill both processes
trap "echo ''; echo '🛑 Stopping DriftWatch...'; kill $SERVER_PID $WORKER_PID 2>/dev/null; exit" INT

# Wait for both processes
wait
