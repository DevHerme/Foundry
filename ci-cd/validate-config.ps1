# validate-config.ps1 - Ensures the CI/CD management system is correctly configured

# Load Configuration
. "$PSScriptRoot\config.ps1"

function Validate-Config {
    Write-Host "Validating configuration settings..." -ForegroundColor Cyan
    
    $errors = @()

    # Ensure required paths exist
    $requiredPaths = @("GitRepositoryPath", "LiveServerPath", "ServerScriptsPath", "VersionFilePath", "MasterLogFilePath")
    foreach ($pathKey in $requiredPaths) {
        $pathValue = $Config[$pathKey]
        if (!(Test-Path $pathValue)) {
            $errors += "Error: Missing path - $pathKey ($pathValue) does not exist."
        }
    }

    # Check for Foundry log file if logging to both locations
    if ($Config.LogToBoth -and -not (Test-Path $Config.FoundryLogFilePath)) {
        $errors += "Error: Foundry log file is missing - $Config.FoundryLogFilePath does not exist."
    }

    # Check GitHub repo URL
    if (-not $Config.GitHubRepoURL -or $Config.GitHubRepoURL -eq "") {
        $errors += "Error: GitHubRepoURL is not configured in config.ps1"
    }
    
    # Ensure required branches are set
    $requiredBranches = @("BetaBranch", "MainBranch", "HotfixBranch")
    foreach ($branchKey in $requiredBranches) {
        if (-not $Config[$branchKey] -or $Config[$branchKey] -eq "") {
            $errors += "Error: Missing branch configuration - $branchKey is not set in config.ps1"
        }
    }

    # Check PM2 instances (warn instead of fail)
    $requiredPM2Instances = @("PM2LiveInstance", "PM2LocalInstance")
    foreach ($pm2Instance in $requiredPM2Instances) {
        if (-not $Config[$pm2Instance] -or $Config[$pm2Instance] -eq "") {
            Write-Host "Warning: PM2 instance $pm2Instance is not set. Some deployment features may not work." -ForegroundColor Yellow
        }
    }

    # Validate version pattern
    if (-not $Config.VersionPattern -or $Config.VersionPattern -eq "") {
        $errors += "Error: VersionPattern is missing in config.ps1"
    }

    # Display results
    if ($errors.Count -gt 0) {
        Write-Host "Configuration validation failed with the following issues:" -ForegroundColor Red
        $errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
        exit 1
    } else {
        Write-Host "Configuration validation passed!" -ForegroundColor Green
    }
}

# Run validation when script is executed
Validate-Config
