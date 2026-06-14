@echo off
REM scripts/stop_zestify.bat
REM This script kills the Node.js server that is running invisibly in the background.

echo Stopping all Node.js servers...
taskkill /F /IM node.exe /T
echo Zestify Server Stopped!
pause
