@echo off
echo Installing dependencies...
call npm install

echo.
echo Starting development server on http://localhost:3000
call npm run dev

pause
