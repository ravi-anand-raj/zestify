# Zestify Auto-Startup Script
# Location: scripts/startup.ps1

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectDir = Join-Path $ScriptDir "..\apps\web"
$LogDir = Join-Path $ScriptDir "..\logs"
$LogFile = Join-Path $LogDir "server.log"

# Create logs directory if it doesn't exist
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
}

function Log-Message {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp] $Message" | Out-File -FilePath $LogFile -Append
}

Log-Message "=== Zestify Startup Script Triggered ==="

# 1. Environment Verification
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Log-Message "ERROR: Node.js is not installed or not in PATH."
    exit 1
}

if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Log-Message "ERROR: NPM is not installed or not in PATH."
    exit 1
}

Log-Message "Node and NPM verified."

# 2. Directory Detection
if (-not (Test-Path $ProjectDir)) {
    Log-Message "ERROR: Project directory not found at $ProjectDir"
    exit 1
}
Set-Location $ProjectDir
Log-Message "Working directory set to $ProjectDir"

# 3. Dependency Resolution
$NodeModulesDir = Join-Path $ProjectDir "node_modules"
if (-not (Test-Path $NodeModulesDir)) {
    Log-Message "node_modules not found. Running npm install..."
    npm install | Out-File -FilePath $LogFile -Append
    Log-Message "npm install complete."
} else {
    Log-Message "Dependencies found. Skipping npm install."
}

# 4. Port Auto-Detection
$TargetPort = 3000
$MaxPort = 3010
$FoundPort = 0

for ($port = $TargetPort; $port -le $MaxPort; $port++) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if (-not $connection) {
        $FoundPort = $port
        break
    }
}

if ($FoundPort -eq 0) {
    Log-Message "ERROR: No available ports found between $TargetPort and $MaxPort."
    exit 1
}

Log-Message "Binding server to port $FoundPort."

# 5. Browser Launch Async Trigger
$AppUrl = "http://localhost:$FoundPort"
$BrowserLauncher = {
    param($url, $logFile)
    Start-Sleep -Seconds 8
    Start-Process $url
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$timestamp] Opened browser automatically to $url" | Out-File -FilePath $logFile -Append
}
Start-Job -ScriptBlock $BrowserLauncher -ArgumentList $AppUrl, $LogFile | Out-Null

# 6. Auto-Recovery Server Loop
while ($true) {
    Log-Message "Starting Next.js Server on port $FoundPort..."
    
    # Run npm run dev and pipe output to log
    # Using 'dev' since it's the requested default. You can change this to 'start' if building for prod.
    cmd /c "npm run dev -- -p $FoundPort 2>&1" | Out-File -FilePath $LogFile -Append

    Log-Message "WARNING: Server crashed or stopped! Restarting in 5 seconds..."
    Start-Sleep -Seconds 5
}
