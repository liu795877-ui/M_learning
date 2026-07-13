param(
    [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME ".codex" }),
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repoRoot "literature-reading"
$skillsRoot = Join-Path $CodexHome "skills"
$destination = Join-Path $skillsRoot "literature-reading"

$skillsRootFull = [System.IO.Path]::GetFullPath($skillsRoot).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
$destinationFull = [System.IO.Path]::GetFullPath($destination)
if (-not $destinationFull.StartsWith($skillsRootFull + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to write outside the configured Skills directory: $destinationFull"
}

if (-not (Test-Path -LiteralPath (Join-Path $source "SKILL.md"))) {
    throw "Skill source is missing: $source"
}

if ($DryRun) {
    Write-Output "Source: $source"
    Write-Output "Destination: $destination"
    Write-Output "Dry run only; no files changed."
    exit 0
}

New-Item -ItemType Directory -Force -Path $skillsRoot | Out-Null

$staging = Join-Path $skillsRoot ".literature-reading-staging"
$stagingFull = [System.IO.Path]::GetFullPath($staging)
if (-not $stagingFull.StartsWith($skillsRootFull + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Unsafe staging path: $stagingFull"
}
if (Test-Path -LiteralPath $staging) {
    Remove-Item -LiteralPath $staging -Recurse -Force
}

Copy-Item -LiteralPath $source -Destination $staging -Recurse

if (Test-Path -LiteralPath $destination) {
    $backup = Join-Path $skillsRoot ".literature-reading-backup"
    $backupFull = [System.IO.Path]::GetFullPath($backup)
    if (-not $backupFull.StartsWith($skillsRootFull + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Unsafe backup path: $backupFull"
    }
    if (Test-Path -LiteralPath $backup) {
        Remove-Item -LiteralPath $backup -Recurse -Force
    }
    Move-Item -LiteralPath $destination -Destination $backup
    try {
        Move-Item -LiteralPath $staging -Destination $destination
        Remove-Item -LiteralPath $backup -Recurse -Force
    }
    catch {
        if (Test-Path -LiteralPath $destination) {
            Remove-Item -LiteralPath $destination -Recurse -Force
        }
        Move-Item -LiteralPath $backup -Destination $destination
        throw
    }
}
else {
    Move-Item -LiteralPath $staging -Destination $destination
}

Write-Output "Installed literature-reading to: $destination"
