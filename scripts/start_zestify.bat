@echo off
REM scripts/start_zestify.bat
REM This script runs the PowerShell startup script invisibly in the background.

echo Starting Zestify invisibly...
powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0startup.ps1"
exit
