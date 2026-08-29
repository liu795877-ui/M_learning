param(
    [Parameter(Mandatory = $true)]
    [string]$PaperDirectory,

    [ValidateSet("Initialize", "Status", "Publish", "Capture")]
    [string]$Action = "Status",

    [string]$MasterName = "full-note.master.md",
    [string]$MirrorName = "full-note.md"
)

$ErrorActionPreference = "Stop"
$paperDir = [System.IO.Path]::GetFullPath($PaperDirectory)
if (-not (Test-Path -LiteralPath $paperDir -PathType Container)) {
    throw "Paper directory does not exist: $paperDir"
}

$master = Join-Path $paperDir $MasterName
$mirror = Join-Path $paperDir $MirrorName
$stateFile = Join-Path $paperDir ".zotero-sync-state.json"
$backupDir = Join-Path $paperDir ".zotero-sync-backups"
$captureDir = Join-Path $paperDir ".zotero-sync-captures"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

function Get-FileHashValue([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { return $null }
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash
}

function Get-NoteInfo([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        return [ordered]@{ exists = $false; hash = $null; bytes = 0; lines = 0; headings = 0; valid = $false; errors = @("missing") }
    }

    $text = [System.IO.File]::ReadAllText($Path)
    $errors = [System.Collections.Generic.List[string]]::new()
    $lines = ($text -split "`r?`n").Count
    $headings = ([regex]::Matches($text, "(?m)^#{1,3}\s+")).Count
    $frontmatterMarks = ([regex]::Matches($text, "(?m)^---\s*$" )).Count

    if ($text.Length -lt 256) { $errors.Add("too_small") }
    if ($lines -lt 10) { $errors.Add("too_few_lines") }
    if ($headings -lt 1) { $errors.Add("no_headings") }
    if ($text -match "(?i)TypeError|serialization error|cannot use 'in' operator") { $errors.Add("serialization_error_text") }
    if ($text.StartsWith("---") -and $frontmatterMarks -lt 2) { $errors.Add("unclosed_frontmatter") }

    return [ordered]@{
        exists = $true
        hash = Get-FileHashValue $Path
        bytes = (Get-Item -LiteralPath $Path).Length
        lines = $lines
        headings = $headings
        valid = ($errors.Count -eq 0)
        errors = @($errors)
    }
}

function Read-State {
    if (-not (Test-Path -LiteralPath $stateFile -PathType Leaf)) { return $null }
    return Get-Content -LiteralPath $stateFile -Raw -Encoding UTF8 | ConvertFrom-Json
}

function Write-State([string]$Reason) {
    $masterInfo = Get-NoteInfo $master
    $mirrorInfo = Get-NoteInfo $mirror
    $state = [ordered]@{
        schema_version = 1
        master_name = $MasterName
        mirror_name = $MirrorName
        master_hash = $masterInfo.hash
        mirror_hash = $mirrorInfo.hash
        master_bytes = $masterInfo.bytes
        mirror_bytes = $mirrorInfo.bytes
        updated_at = (Get-Date).ToString("o")
        reason = $Reason
    }
    [System.IO.File]::WriteAllText($stateFile, ($state | ConvertTo-Json -Depth 4) + "`n", $utf8NoBom)
}

function Backup-Mirror([string]$Label) {
    if (-not (Test-Path -LiteralPath $mirror -PathType Leaf)) { return $null }
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $target = Join-Path $backupDir "$stamp-$Label-$MirrorName"
    Copy-Item -LiteralPath $mirror -Destination $target
    return $target
}

function Build-MirrorText {
    $masterText = [System.IO.File]::ReadAllText($master)
    $syncLines = @()
    if (Test-Path -LiteralPath $mirror -PathType Leaf) {
        $mirrorText = [System.IO.File]::ReadAllText($mirror)
        $syncLines = [regex]::Matches($mirrorText, '(?m)^\$(?:version|libraryID|itemKey):.*$') | ForEach-Object Value
    }

    $clean = [regex]::Replace($masterText, '(?m)^\$(?:version|libraryID|itemKey):.*\r?\n?', '')
    if ($syncLines.Count -eq 0 -or -not $clean.StartsWith("---")) { return $clean }

    $lines = [System.Collections.Generic.List[string]]::new()
    ($clean -split "`r?`n") | ForEach-Object { $lines.Add($_) }
    $closing = -1
    for ($i = 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i].Trim() -eq "---") { $closing = $i; break }
    }
    if ($closing -lt 0) { throw "Master frontmatter is not closed: $master" }
    for ($i = $syncLines.Count - 1; $i -ge 0; $i--) { $lines.Insert($closing, $syncLines[$i]) }
    return ($lines -join "`n")
}

$masterInfo = Get-NoteInfo $master
$mirrorInfo = Get-NoteInfo $mirror
$state = Read-State

switch ($Action) {
    "Initialize" {
        if (-not $masterInfo.exists) { throw "Canonical master is missing: $master" }
        if (-not $masterInfo.valid) { throw "Canonical master failed validation: $($masterInfo.errors -join ', ')" }
        if ($mirrorInfo.exists) { Backup-Mirror "initialize" | Out-Null }
        Write-State "initialized"
        Write-Output "Initialized isolated Zotero mirror tracking."
    }

    "Status" {
        $masterChanged = $null
        $mirrorChanged = $null
        if ($null -ne $state) {
            $masterChanged = ($masterInfo.hash -ne $state.master_hash)
            $mirrorChanged = ($mirrorInfo.hash -ne $state.mirror_hash)
        }
        [ordered]@{
            paper_directory = $paperDir
            initialized = ($null -ne $state)
            master = $masterInfo
            mirror = $mirrorInfo
            master_changed_since_baseline = $masterChanged
            mirror_changed_since_baseline = $mirrorChanged
            safe_to_edit_master = $masterInfo.valid
            safe_to_publish = ($masterInfo.valid -and ($null -ne $state) -and -not $mirrorChanged)
        } | ConvertTo-Json -Depth 6
    }

    "Capture" {
        if (-not $mirrorInfo.exists) { throw "Zotero mirror is missing: $mirror" }
        New-Item -ItemType Directory -Force -Path $captureDir | Out-Null
        $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $target = Join-Path $captureDir "$stamp-zotero-side-$MirrorName"
        Copy-Item -LiteralPath $mirror -Destination $target
        Write-Output "Captured Zotero-side mirror for manual merge: $target"
    }

    "Publish" {
        if (-not $masterInfo.exists) { throw "Canonical master is missing: $master" }
        if (-not $masterInfo.valid) { throw "Canonical master failed validation: $($masterInfo.errors -join ', ')" }
        if ($null -eq $state) { throw "Bridge is not initialized. Run -Action Initialize first." }
        if ($mirrorInfo.hash -ne $state.mirror_hash) {
            $capture = & $PSCommandPath -PaperDirectory $paperDir -Action Capture -MasterName $MasterName -MirrorName $MirrorName
            throw "Zotero mirror changed since the baseline. Publishing stopped. $capture"
        }
        if ($state.master_bytes -gt 0 -and $masterInfo.bytes -lt [math]::Floor($state.master_bytes * 0.7)) {
            throw "Canonical master shrank by more than 30 percent. Publishing stopped."
        }

        $backup = Backup-Mirror "pre-publish"
        $published = Build-MirrorText
        [System.IO.File]::WriteAllText($mirror, $published, $utf8NoBom)
        $writtenInfo = Get-NoteInfo $mirror
        if (-not $writtenInfo.valid) {
            if ($backup) { Copy-Item -LiteralPath $backup -Destination $mirror -Force }
            throw "Published mirror failed validation and was rolled back: $($writtenInfo.errors -join ', ')"
        }
        Write-State "published_from_master"
        Write-Output "Published canonical master to Zotero mirror: $mirror"
        if ($backup) { Write-Output "Previous mirror backup: $backup" }
    }
}
