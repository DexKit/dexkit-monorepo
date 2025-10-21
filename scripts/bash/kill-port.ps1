# Script to kill processes on specific ports

param(
    [int]$Port = 3000
)

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "     Release Port $Port" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Searching for processes using port $Port..." -ForegroundColor Cyan

try {
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction Stop
    
    if ($connections) {
        Write-Host ""
        Write-Host "Processes found:" -ForegroundColor Yellow
        
        foreach ($conn in $connections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            
            if ($process) {
                Write-Host ""
                Write-Host "  PID: $($process.Id)" -ForegroundColor Yellow
                Write-Host "  Name: $($process.ProcessName)" -ForegroundColor Yellow
                Write-Host "  Port: $Port" -ForegroundColor Yellow
                Write-Host "  State: $($conn.State)" -ForegroundColor Yellow
                Write-Host ""
                $confirm = Read-Host "Kill this process? (y/n)"
                
                if ($confirm -eq 'y') {
                    try {
                        Stop-Process -Id $process.Id -Force
                        Write-Host "  OK - Process terminated" -ForegroundColor Green
                    }
                    catch {
                        Write-Host "  ERROR - Could not terminate process: $_" -ForegroundColor Red
                    }
                }
                else {
                    Write-Host "  Skipped" -ForegroundColor Yellow
                }
            }
        }
    }
    else {
        Write-Host ""
        Write-Host "No processes using port $Port" -ForegroundColor Green
    }
    
}
catch {
    Write-Host ""
    Write-Host "No processes using port $Port" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"

