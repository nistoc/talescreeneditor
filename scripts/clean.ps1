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
