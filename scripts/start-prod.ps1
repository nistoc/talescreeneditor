# Start in production mode
Write-Host "Starting Tales Screen Editor in production mode..." -ForegroundColor Cyan
docker-compose up -d tales-screen-editor
Write-Host "Application available at: http://localhost" -ForegroundColor Green
