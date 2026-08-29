$ErrorActionPreference = "Stop"

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$buildRoot = Join-Path $projectRoot "build"
$stagingRoot = Join-Path $buildRoot "staging"
$zipPath = Join-Path $buildRoot "zotero-gpt-math-paste.zip"
$xpiPath = Join-Path $buildRoot "zotero-gpt-math-paste-0.1.3.xpi"

if (-not $stagingRoot.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
	throw "Refusing to use a staging directory outside the plugin project"
}

if (Test-Path -LiteralPath $stagingRoot) {
	Remove-Item -LiteralPath $stagingRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingRoot -Force | Out-Null

$packageEntries = @(
	"manifest.json",
	"bootstrap.js",
	"content",
	"prefs.js"
)
foreach ($entry in $packageEntries) {
	Copy-Item -LiteralPath (Join-Path $projectRoot $entry) -Destination $stagingRoot -Recurse -Force
}

if (Test-Path -LiteralPath $zipPath) {
	Remove-Item -LiteralPath $zipPath -Force
}
if (Test-Path -LiteralPath $xpiPath) {
	Remove-Item -LiteralPath $xpiPath -Force
}

Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $zipPath -CompressionLevel Optimal
Move-Item -LiteralPath $zipPath -Destination $xpiPath
Write-Output $xpiPath
