# PowerShell Versioning System for Standalone CI/CD

# Load Configuration
. "$PSScriptRoot\config.ps1"
. "$PSScriptRoot\utils\log-activity.ps1"
. "$PSScriptRoot\utils\validate-config.ps1"

# Ensure Configuration is Valid
Validate-Config

# Paths
$versionFile = $Config.VersionFilePath
$BetaBranch = $Config.BetaBranch
$MainBranch = $Config.MainBranch
$HotfixBranch = $Config.HotfixBranch

function Get-LatestTag {
    return (git tag --sort=-v:refname | Select-Object -First 1)
}

function Get-NextVersion {
    param ([string]$baseVersion, [string]$incrementType)

    if ($baseVersion -match '^v(\d+)\.(\d+)\.(\d+)(-beta\.(\d+))?$') {
        $major = [int]$matches[1]
        $minor = [int]$matches[2]
        $patch = [int]$matches[3]
        $isBeta = $matches[4] -ne $null
        $betaCount = $matches[5]

        switch ($incrementType) {
            "major" { $major++; $minor = 0; $patch = 0 }
            "minor" { $minor++; $patch = 0 }
            "patch" { $patch++ }
            "beta" { $betaCount++ }
            default { Write-Host "Invalid release type." -ForegroundColor Red; exit 1 }
        }

        $newVersion = "v$major.$minor.$patch"
        if ($incrementType -eq "beta") {
            $newVersion += "-beta.$betaCount"
        }

        return $newVersion
    } else {
        Write-Host "Invalid version format: $baseVersion" -ForegroundColor Red
        exit 1
    }
}

function Get-UserSelection {
    $options = @("Major Release (vX.0.0)", "Minor Release (v0.X.0)", "Patch Release (v0.0.X)", "Beta Release (vX.Y.Z-beta)")
    $releaseTypes = @("major", "minor", "patch", "beta")
    $selectedIndex = 2  # Default: Patch

    while ($true) {
        Clear-Host
        Write-Host "Select a release type:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $options.Length; $i++) {
            if ($i -eq $selectedIndex) {
                Write-Host " > $($options[$i])" -ForegroundColor Green
            } else {
                Write-Host "   $($options[$i])" -ForegroundColor Gray
            }
        }

        $key = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown").VirtualKeyCode
        switch ($key) {
            38 { $selectedIndex = ($selectedIndex - 1) -lt 0 ? $options.Length - 1 : $selectedIndex - 1 }
            40 { $selectedIndex = ($selectedIndex + 1) % $options.Length }
            13 { return $releaseTypes[$selectedIndex] }
        }
    }
}

# Ensure repository is in the right directory
Set-Location -Path $Config.GitRepositoryPath
git fetch --tags  # Sync remote versions

# Get current version
$currentVersion = Get-LatestTag
if (!$currentVersion) {
    Write-Host "No existing tags found. Initializing v0.1.0..." -ForegroundColor Yellow
    $currentVersion = "v0.1.0"
}

# Determine release type
$releaseType = Get-UserSelection
Write-Host "You selected: $releaseType" -ForegroundColor Green

$newVersion = Get-NextVersion -baseVersion $currentVersion -incrementType $releaseType

# Ask user for additional details
$commitComment = Read-Host "Enter commit details"
$commitMessage = "Commit: $newVersion - $commitComment"

# Check for uncommitted changes
$uncommittedChanges = git status --porcelain
if ($uncommittedChanges) {
    Write-Host "Uncommitted changes detected. Staging changes..." -ForegroundColor Yellow
    git add .
    git commit -m "Temporary commit: Saving changes before version update."
}

# Ensure on correct branch
git checkout $BetaBranch *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error switching to beta branch." -ForegroundColor Red
    exit 1
}

# Update version file
Write-Host "Updating version to $newVersion..." -ForegroundColor Cyan
Set-Content -Path $versionFile -Value $newVersion

# Commit and push
git add .
git commit -m $commitMessage
git push origin $BetaBranch

# Tagging
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$tagName = "$newVersion-$timestamp"
git tag -a $tagName -m "Version $newVersion"
git push origin --tags

Write-Host "Version $newVersion committed and pushed successfully!" -ForegroundColor Green
Test