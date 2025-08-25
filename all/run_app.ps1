Write-Host "Starting Village Help Desk Application..." -ForegroundColor Green
Write-Host ""

# Check if we're in the correct directory
if (Test-Path "app.py") {
    Write-Host "Found app.py in current directory" -ForegroundColor Green
} else {
    Write-Host "Error: app.py not found in current directory" -ForegroundColor Red
    Write-Host "Please run this script from the 'all' directory" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host ""
Write-Host "Starting Flask application..." -ForegroundColor Yellow
Write-Host "Application will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python app.py
