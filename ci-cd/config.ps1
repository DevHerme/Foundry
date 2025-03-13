# Configuration File for Standalone CI/CD Versioning System

$Config = @{

    # General Paths
    GitRepositoryPath  = "C:/Website/Foundry"          # Local repository path
    LiveServerPath     = "C:/Website/Foundry-live"     # Live server deployment path
    ServerScriptsPath  = "C:/Website/server-scripts"   # Path to this CI/CD management system

    # Git Settings
    GitHubRepoURL      = "https://github.com/DevHerme/Foundry"  # GitHub Repository
    VersionFilePath    = "C:/Website/Foundry/version.txt"       # Path to track the current version
    VersionPattern     = 'v\d+\.\d+\.\d+(-beta\.\d+)?'          # Regex pattern for version validation

    # Branches
    MainBranch        = "main"         # Production branch
    BetaBranch        = "beta"         # Beta testing branch
    HotfixBranch      = "hotfix"       # Emergency bug fixes
    FeaturePrefix     = "feature"      # Prefix for feature branches
    ArchivePrefix     = "archived"     # Prefix for archived feature branches

    # PM2 Instance Management
    PM2LiveInstance    = "foundry-live-server"
    PM2LocalInstance   = "foundry-local-backend"
    PM2FrontendInstance = "foundry-local-frontend"
    PM2RestartCommand  = "pm2 reload"   # Reload for zero-downtime

    # Logging
    MasterLogFilePath  = "C:/Website/server-scripts/master-log.txt"  # Default log location
    FoundryLogFilePath = "C:/Website/Foundry/foundry-log.txt"        # Project log file
    LogToBoth          = $true  # If true, logs to both locations
    LogLevel           = "INFO" # Default logging level (INFO, WARN, ERROR)
}
