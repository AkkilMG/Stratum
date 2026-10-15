<#
  Downloads the latest "build-installers" workflow artifacts into the release/ folder.

  The build-installers workflow runs on GitHub-hosted runners and uploads one combined
  artifact (all platforms). This script fetches that artifact so you can keep the built
  installers locally without having Linux/macOS machines.

  Requires the GitHub CLI (gh), authenticated:  gh auth login

  Usage:
    pwsh scripts/fetch-artifacts.ps1
    pwsh scripts/fetch-artifacts.ps1 -Artifact stratum-Windows
#>
[CmdletBinding()]
param(
  [string]$Repo = 'AkkilMG/Stratum',
  [string]$Workflow = 'build-installers.yml',
  [string]$Artifact = 'stratum-installers-all',
  [string]$OutDir
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) not found. Install it from https://cli.github.com/ and run 'gh auth login'."
}

if (-not $OutDir) {
  $OutDir = Join-Path (Split-Path -Parent $PSScriptRoot) 'release'
}

$runId = gh run list --repo $Repo --workflow $Workflow --status success --limit 1 --json databaseId --jq '.[0].databaseId'
if ([string]::IsNullOrWhiteSpace($runId)) {
  throw "No successful '$Workflow' run found for $Repo. Run the workflow from the Actions tab first."
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
Write-Host "Downloading '$Artifact' from run $runId into $OutDir ..."
gh run download $runId --repo $Repo --name $Artifact --dir $OutDir
Write-Host "Done."
