@echo off
echo Starting Village Help Desk Application...
echo.

REM Change to the script's directory
cd /d "%~dp0"

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask application...
python app.py

pause
