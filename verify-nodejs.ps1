# Verify Node.js Installation
# Run this script after restarting your terminal

Write-Host "Checking for Node.js installation..." -ForegroundColor Cyan
Write-Host ""

# Try to find Node.js
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "${env:ProgramFiles(x86)}\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
)

$found = $false
foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        Write-Host "✓ Node.js found at: $path" -ForegroundColor Green
        $version = & $path --version
        Write-Host "  Version: $version" -ForegroundColor Green
        
        $npmPath = Join-Path (Split-Path $path) "npm.cmd"
        if (Test-Path $npmPath) {
            $npmVersion = & $npmPath --version
            Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
        }
        
        $found = $true
        break
    }
}

if (-not $found) {
    Write-Host "✗ Node.js not found in standard locations" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try:" -ForegroundColor Yellow
    Write-Host "1. Restart your computer" -ForegroundColor White
    Write-Host "2. Or manually install from: https://nodejs.org/" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✓ Node.js is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run the setup script:" -ForegroundColor Cyan
    Write-Host "  .\run-setup.ps1" -ForegroundColor Yellow
}

