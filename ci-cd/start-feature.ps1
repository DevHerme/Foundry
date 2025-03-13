# start-feature.ps1
# This script handles the creation of a new feature branch for local development.
# It reads project settings from the configuration file (project-config.json),
# changes the working directory to the Foundry project,
# checks for active branches, handles uncommitted changes,
# commits (if chosen) and pushes those changes to remote,
# and finally creates a new feature branch and pushes it.
# At the end, it returns to the directory from which the script was originally run.

# Save the original working directory
$originalDir = Get-Location

# Load project configuration
$configFile = Join-Path $PSScriptRoot "project-config.json"
if (Test-Path $configFile) {
    $configContent = Get-Content $configFile -Raw
    $config = $configContent | ConvertFrom-Json
    Write-Host "Project: $($config.projectName)"
    $stableBranch = $config.stableBranch
    $projectPath = $config.projectPath
    # Change to the Foundry project directory so Git commands operate there.
    if (Test-Path $projectPath) {
        Set-Location $projectPath
        Write-Host "Changed working directory to $projectPath"
    } else {
        Write-Host "Project path '$projectPath' does not exist. Please check your configuration."
        exit
    }
} else {
    Write-Host "No configuration file found. Using default settings."
    $stableBranch = "main"
}

# Get the current branch name
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "Current branch: $currentBranch"

if ($currentBranch -eq $stableBranch) {
    # No active feature branch exists (we're on the stable branch)
    Write-Host "No active feature branch detected. You are on the '$stableBranch' branch."

    # Check if working directory has uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "Local changes detected in your working directory."
        $resetChoice = Read-Host "Your working directory has changes that do not match the last stable version. Would you like to reset and download the latest stable version? (Y/N)"
        if ($resetChoice -eq "Y" -or $resetChoice -eq "y") {
            Write-Host "Fetching latest stable version and resetting your working directory..."
            git fetch origin
            git reset --hard origin/$stableBranch
        }
        else {
            Write-Host "Keeping your current work. It will become part of the new feature branch."
        }
    }
    else {
        Write-Host "Working directory is clean."
    }
}
else {
    # Active feature branch detected (not on the stable branch)
    Write-Host "Active feature branch detected: $currentBranch"

    # Check for uncommitted changes in the active feature branch
    $status = git status --porcelain
    if ($status) {
        Write-Host "Uncommitted changes detected in the current feature branch."
        $commitChoice = Read-Host "Would you like to commit these changes before switching? (Y/N)"
        if ($commitChoice -eq "Y" -or $commitChoice -eq "y") {
            $commitMessage = Read-Host "Enter commit message"
            # Stage all changes
            git add .
            # Check if there are staged changes
            $staged = git diff --cached
            if (![string]::IsNullOrWhiteSpace($staged)) {
                git commit -m "$commitMessage"
                Write-Host "Changes committed."
                # Push the committed changes to remote
                git push -u origin $currentBranch
                Write-Host "Changes pushed to remote branch $currentBranch."
            }
            else {
                Write-Host "No changes were staged for commit. Proceeding with the current branch."
            }
        }
        else {
            Write-Host "Rolling back uncommitted changes..."
            git reset --hard HEAD
        }
    }
    else {
        Write-Host "No uncommitted changes in the current feature branch."
    }
}

# Prompt for new feature branch name and sanitize input (replace spaces with hyphens)
$featureName = Read-Host "Enter the new feature branch name"
$featureNameSanitized = $featureName.Trim() -replace "\s+", "-"
$newFeatureBranch = "feature/$featureNameSanitized"

# Create and switch to the new feature branch
Write-Host "Creating and switching to new feature branch: $newFeatureBranch"
git checkout -b $newFeatureBranch

Write-Host "Feature branch '$newFeatureBranch' created successfully."

# Push the new feature branch to remote
Write-Host "Pushing feature branch '$newFeatureBranch' to remote."
git push -u origin $newFeatureBranch
Write-Host "Feature branch '$newFeatureBranch' pushed to remote."

# Return to the original working directory
Set-Location $originalDir
Write-Host "Returned to original directory: $originalDir"
