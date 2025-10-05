#!/bin/bash

# Test Onboarding Flow Script
# This script helps you test the onboarding implementation

echo "🧪 DriftWatch Onboarding Test Helper"
echo "======================================"
echo ""

# Database connection
DB_URL="postgresql://priyasingh@localhost:5432/driftwatch"

# Function to show current users
show_users() {
  echo "📋 Current Users:"
  psql $DB_URL -c "SELECT email, \"onboardingCompleted\", \"onboardingStep\", \"emailVerified\", role FROM \"User\";"
  echo ""
}

# Function to enable email verification for a user
verify_email() {
  local email=$1
  echo "✅ Verifying email for: $email"
  psql $DB_URL -c "UPDATE \"User\" SET \"emailVerified\" = true WHERE email = '$email';"
  echo ""
}

# Function to reset onboarding for a user
reset_onboarding() {
  local email=$1
  echo "🔄 Resetting onboarding for: $email"
  psql $DB_URL -c "UPDATE \"User\" SET \"onboardingCompleted\" = false, \"onboardingStep\" = NULL, \"onboardingSkippedAt\" = NULL, role = NULL WHERE email = '$email';"
  echo ""
}

# Menu
echo "Choose an option:"
echo "1) Show all users"
echo "2) Enable onboarding test (verify email for as567687@gmail.com)"
echo "3) Reset onboarding for a user"
echo "4) Show current users and exit"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    show_users
    ;;
  2)
    verify_email "as567687@gmail.com"
    show_users
    echo "✨ Now sign in at http://localhost:3000 with as567687@gmail.com"
    echo "   You should be redirected to /onboarding"
    ;;
  3)
    read -p "Enter email to reset: " email
    reset_onboarding "$email"
    show_users
    ;;
  4)
    show_users
    ;;
  *)
    echo "Invalid choice"
    ;;
esac

echo "======================================"
echo "🎯 Testing Tips:"
echo "  1. Sign in at http://localhost:3000"
echo "  2. If emailVerified=true AND onboardingCompleted=false"
echo "     → You'll be redirected to /onboarding"
echo "  3. Complete the 4-step wizard"
echo "  4. After completion, you'll be redirected to /dashboard"
echo ""
