# Automated Setup Script for RoyalMatch ATS
# This script will complete all setup steps automatically

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RoyalMatch ATS - Automated Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "  1. Go to: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "  2. Download the LTS version" -ForegroundColor Cyan
    Write-Host "  3. Run the installer" -ForegroundColor Cyan
    Write-Host "  4. Restart your terminal" -ForegroundColor Cyan
    Write-Host "  5. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Step 1/4: Verifying .env file..." -ForegroundColor Cyan
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "GEMINI_API_KEY") {
        Write-Host "✓ Gemini API key is configured" -ForegroundColor Green
    }
} else {
    Write-Host "✗ .env file not found. Creating it..." -ForegroundColor Yellow
    @"
# Database
DATABASE_URL="file:./dev.db"

# AI Provider Configuration
AI_PROVIDER="gemini"
OPENAI_API_KEY=""
GEMINI_API_KEY="AIzaSyAaMdD3AiNBBsfpHW7_2_QROsVWHXfy2T8"

# NextAuth (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✓ .env file created" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2/4: Installing dependencies (this may take a few minutes)..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3/4: Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4/4: Creating database..." -ForegroundColor Cyan
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to create database" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Database created" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Setup Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "The app will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev

