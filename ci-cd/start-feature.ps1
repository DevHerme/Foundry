# start-feature.ps1
# This script handles the creation of a new feature branch.
# It checks for active branches, handles uncommitted changes,
# and ensures the working directory is in sync with the stable version.

# Get the current branch name
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "Current branch: $currentBranch"

if ($currentBranch -eq "main") {
    # No active feature branch exists (we're on the stable branch)
    Write-Host "No active feature branch detected. You are on the 'main' branch."

    # Check if working directory has uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "Local changes detected in your working directory."
        $resetChoice = Read-Host "Your working directory has changes that do not match the last stable version. Would you like to reset and download the latest stable version? (Y/N)"
        if ($resetChoice -eq "Y" -or $resetChoice -eq "y") {
            Write-Host "Fetching latest stable version and resetting your working directory..."
            git fetch origin
            git reset --hard origin/main
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
    # Active feature branch detected (not on 'main')
    Write-Host "Active feature branch detected: $currentBranch"

    # Check for uncommitted changes in the active feature branch
    $status = git status --porcelain
    if ($status) {
        Write-Host "Uncommitted changes detected in the current feature branch."
        $commitChoice = Read-Host "Would you like to commit these changes before switching? (Y/N)"
        if ($commitChoice -eq "Y" -or $commitChoice -eq "y") {
            $commitMessage = Read-Host "Enter commit message"
            git add .
            git commit -m "$commitMessage"
            Write-Host "Changes committed."
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

# Prompt for new feature branch name
$featureName = Read-Host "Enter the new feature branch name"
$newFeatureBranch = "feature/$featureName"

# Create and switch to the new feature branch
Write-Host "Creating and switching to new feature branch: $newFeatureBranch"
git checkout -b $newFeatureBranch

Write-Host "Feature branch '$newFeatureBranch' created successfully."
