@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18+ is required before starting the PCA Browser UI.
  echo Install Node.js from https://nodejs.org/ and run this script again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is required before starting the PCA Browser UI.
  echo Reinstall Node.js so npm is available, then run this script again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing local dependencies for the PCA Browser UI...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting PCA Browser UI on http://localhost:4173 ...
start "PCA Browser UI" http://localhost:4173
call npm run ui:start

endlocal