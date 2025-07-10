# Backup data
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "backups"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host "Creating backup..." -ForegroundColor Yellow
Compress-Archive -Path ".\storage\*" -DestinationPath "$backupDir\backup_$date.zip"
Write-Host "[OK] Backup created: $backupDir\backup_$date.zip" -ForegroundColor Green
