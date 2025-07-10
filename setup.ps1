# setup.ps1 - Script for initial project setup

param(
    [Parameter()]
    [string]$ProjectPath = "C:\github\talescreeneditor",
    
    [Parameter()]
    [switch]$SkipDependencies
)

Write-Host "Tales Screen Editor - Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check administrator privileges
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires administrator privileges!" -ForegroundColor Red
    Write-Host "Restart PowerShell as Administrator." -ForegroundColor Yellow
    exit 1
}

# Function to check installed software
function Test-Software {
    param([string]$Name, [string]$Command)
    
    try {
        $null = & $Command --version 2>&1
        Write-Host "[OK] $Name is installed" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[X] $Name is not installed" -ForegroundColor Red
        return $false
    }
}

# Check required software
Write-Host "`nChecking installed software:" -ForegroundColor Yellow
$dockerInstalled = Test-Software "Docker" "docker"
$nodeInstalled = Test-Software "Node.js" "node"
$npmInstalled = Test-Software "npm" "npm"

if (-not $dockerInstalled) {
    Write-Host "`nDocker Desktop is not installed!" -ForegroundColor Red
    Write-Host "Download and install from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "`nChecking Docker Desktop..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker Desktop is running" -ForegroundColor Green
}
catch {
    Write-Host "[X] Docker Desktop is not running" -ForegroundColor Red
    Write-Host "Start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

# Create directory structure
Write-Host "`nCreating project structure..." -ForegroundColor Yellow
try {
    Set-Location $ProjectPath
    
    # Create necessary directories
    $directories = @("storage", "scripts", "backups")
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "[OK] Created directory: $dir" -ForegroundColor Green
        } else {
            Write-Host "[OK] Directory exists: $dir" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "[X] Error creating directories: $_" -ForegroundColor Red
    exit 1
}

# Set permissions
Write-Host "`nSetting permissions..." -ForegroundColor Yellow
try {
    icacls ".\storage" /grant Everyone:F /T | Out-Null
    Write-Host "[OK] Permissions set" -ForegroundColor Green
}
catch {
    Write-Host "[!] Could not set permissions" -ForegroundColor Yellow
}

# Create .env file
Write-Host "`nCreating environment file..." -ForegroundColor Yellow
$envContent = @"
# Environment variables
REACT_APP_API_URL=http://localhost:3000
REACT_APP_STORAGE_PATH=./storage
NODE_ENV=development
"@

Set-Content -Path ".env" -Value $envContent
Write-Host "[OK] .env file created" -ForegroundColor Green

# Install Node.js dependencies
if ($nodeInstalled -and $npmInstalled -and -not $SkipDependencies) {
    Write-Host "`nInstalling Node.js dependencies..." -ForegroundColor Yellow
    try {
        npm install
        Write-Host "[OK] Dependencies installed" -ForegroundColor Green
    }
    catch {
        Write-Host "[!] Error installing dependencies" -ForegroundColor Yellow
    }
}

# Build Docker images
Write-Host "`nBuilding Docker images..." -ForegroundColor Yellow
try {
    docker-compose build
    Write-Host "[OK] Docker images built" -ForegroundColor Green
}
catch {
    Write-Host "[X] Error building Docker images" -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    exit 1
}

# Create additional scripts
Write-Host "`nCreating helper scripts..." -ForegroundColor Yellow

# start-dev.ps1
$startDevScript = @'
# Start in development mode
Write-Host "Starting Tales Screen Editor in development mode..." -ForegroundColor Cyan
docker-compose up tales-screen-editor-dev
'@
Set-Content -Path "scripts\start-dev.ps1" -Value $startDevScript

# start-prod.ps1
$startProdScript = @'
# Start in production mode
Write-Host "Starting Tales Screen Editor in production mode..." -ForegroundColor Cyan
docker-compose up -d tales-screen-editor
Write-Host "Application available at: http://localhost" -ForegroundColor Green
'@
Set-Content -Path "scripts\start-prod.ps1" -Value $startProdScript

# stop.ps1
$stopScript = @'
# Stop all containers
Write-Host "Stopping containers..." -ForegroundColor Yellow
docker-compose down
Write-Host "Containers stopped" -ForegroundColor Green
'@
Set-Content -Path "scripts\stop.ps1" -Value $stopScript

# backup.ps1
$backupScript = @'
# Backup data
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "backups"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host "Creating backup..." -ForegroundColor Yellow
Compress-Archive -Path ".\storage\*" -DestinationPath "$backupDir\backup_$date.zip"
Write-Host "[OK] Backup created: $backupDir\backup_$date.zip" -ForegroundColor Green
'@
Set-Content -Path "scripts\backup.ps1" -Value $backupScript

# logs.ps1
$logsScript = @'
param(
    [Parameter()]
    [string]$Container = "tales-screen-editor-dev",
    
    [Parameter()]
    [switch]$Follow
)

if ($Follow) {
    docker logs -f $Container
} else {
    docker logs $Container
}
'@
Set-Content -Path "scripts\logs.ps1" -Value $logsScript

# clean.ps1
$cleanScript = @'
# Clean Docker resources
Write-Host "Cleaning Docker resources..." -ForegroundColor Yellow

# Stop containers
docker-compose down

# Remove images
docker rmi talescreeneditor_tales-screen-editor 2>$null
docker rmi talescreeneditor_tales-screen-editor-dev 2>$null

# Clean unused resources
docker system prune -f

Write-Host "[OK] Cleanup completed" -ForegroundColor Green
'@
Set-Content -Path "scripts\clean.ps1" -Value $cleanScript

Write-Host "[OK] Helper scripts created in scripts\ folder" -ForegroundColor Green

# Final information
Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "Installation completed!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "`nAvailable commands:" -ForegroundColor Yellow
Write-Host "  .\scripts\start-dev.ps1  - Start in development mode" -ForegroundColor White
Write-Host "  .\scripts\start-prod.ps1 - Start in production mode" -ForegroundColor White
Write-Host "  .\scripts\stop.ps1       - Stop containers" -ForegroundColor White
Write-Host "  .\scripts\backup.ps1     - Create backup" -ForegroundColor White
Write-Host "  .\scripts\logs.ps1       - View logs" -ForegroundColor White
Write-Host "  .\scripts\clean.ps1      - Clean Docker resources" -ForegroundColor White
Write-Host "`nProject located at: $ProjectPath" -ForegroundColor Cyan