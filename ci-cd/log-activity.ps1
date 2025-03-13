# log-activity.ps1 - Handles logging for the CI/CD management system

# Load Configuration
. "$PSScriptRoot\config.ps1"


function Log-Activity {
    param (
        [string]$Message,
        [string]$LogLevel = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$LogLevel] $Message"
    
    # Ensure log file exists
    if (!(Test-Path $Config.MasterLogFilePath)) {
        New-Item -Path $Config.MasterLogFilePath -ItemType File -Force | Out-Null
    }
    
    # Write to main log file in server-scripts
    Add-Content -Path $Config.MasterLogFilePath -Value $logEntry
    
    # If logging to Foundry's log file as well
    if ($Config.LogToBoth -and (Test-Path $Config.FoundryLogFilePath)) {
        Add-Content -Path $Config.FoundryLogFilePath -Value $logEntry
    }
}

# Example Usage
# Log-Activity "Deployment started successfully" "INFO"
# Log-Activity "Version bump failed" "ERROR"
