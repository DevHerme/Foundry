# deployment.ps1 - Manages Git operations, PM2 restarts, and live deployment

# Load Configuration and Utilities
. "$PSScriptRoot\config.ps1"
. "$PSScriptRoot\log-activity.ps1"
. "$PSScriptRoot\validate-config.ps1"

# Ensure Configuration is Valid
Validate-Config

function Deploy-Version {
    param (
        [string]$CommitMessage = "Deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    )
    
    Write-Host "Starting deployment process..." -ForegroundColor Cyan
    Log-Activity "Deployment process started." "INFO"
    
    # Ensure repository is in the correct directory
    Set-Location -Path $Config.GitRepositoryPath
    
    # Fetch latest changes
    git fetch --tags
    
    # Check for uncommitted changes
    $uncommittedChanges = git status --porcelain
    if ($uncommittedChanges) {
        Write-Host "Uncommitted changes detected. Staging changes..." -ForegroundColor Yellow
        git add .
        git commit -m "Temporary commit: Saving changes before deployment."
    }
    
    # Push changes to remote repository
    Write-Host "Pushing changes to remote repository..." -ForegroundColor Cyan
    git push origin $Config.MainBranch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to push changes to repository." -ForegroundColor Red
        Log-Activity "Error: Failed to push changes to repository." "ERROR"
        exit 1
    }
    
    # Tag the release
    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $tagName = "release-$(Get-Content $Config.VersionFilePath)-$timestamp"
    Write-Host "Creating and pushing tag: $tagName" -ForegroundColor Cyan
    git tag -a $tagName -m "Deployment Version $(Get-Content $Config.VersionFilePath)"
    git push origin --tags
    
    # Restart PM2 instances
    Write-Host "Restarting live server using PM2..." -ForegroundColor Cyan
    Log-Activity "Restarting PM2 instance: $Config.PM2LiveInstance" "INFO"
    Write-Host "Restarting PM2 instance: $($Config.PM2LiveInstance)" -ForegroundColor Cyan
    Log-Activity "Restarting PM2 instance: $($Config.PM2LiveInstance)" "INFO"
    Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c pm2 restart $($Config.PM2LiveInstance)"
        
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Log-Activity "Deployment completed successfully." "INFO"
}

# Run deployment
Deploy-Version
