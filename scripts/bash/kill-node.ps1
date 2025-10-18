# Script for closing all Node.js processes

Write-Host ""
Write-Host "==================================================" -ForegroundColor Red
Write-Host "     Closing all Node.js processes" -ForegroundColor Red
Write-Host "==================================================" -ForegroundColor Red
Write-Host ""

$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Node.js processes found: $($nodeProcesses.Count)" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($proc in $nodeProcesses) {
        Write-Host "  PID: $($proc.Id)" -ForegroundColor Yellow
        Write-Host "  Name: $($proc.ProcessName)" -ForegroundColor Yellow
        Write-Host "  CPU: $($proc.CPU)" -ForegroundColor Yellow
        Write-Host "  Memory: $([math]::Round($proc.WorkingSet / 1MB, 2)) MB" -ForegroundColor Yellow
        Write-Host ""
    }
    
    Write-Host "WARNING: This will close all Node.js processes" -ForegroundColor Red
    Write-Host "Including development servers, npm, etc." -ForegroundColor Red
    Write-Host ""
    
    $confirm = Read-Host "Are you sure? (type 'YES' to confirm)"
    
    if ($confirm -eq 'YES') {
        Write-Host ""
        Write-Host "Closing processes..." -ForegroundColor Red
        
        foreach ($proc in $nodeProcesses) {
            try {
                Stop-Process -Id $proc.Id -Force
                Write-Host "  OK - Process $($proc.Id) closed" -ForegroundColor Green
            }
            catch {
                Write-Host "  ERROR - Could not close process $($proc.Id): $_" -ForegroundColor Red
            }
        }
        
        Write-Host ""
        Write-Host "Node.js processes closed" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "Operation cancelled" -ForegroundColor Yellow
    }
    
}
else {
    Write-Host "No Node.js processes running" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"

