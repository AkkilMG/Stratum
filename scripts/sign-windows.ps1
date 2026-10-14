<#
  Code-signs a Windows binary or installer during `tauri build`.

  Tauri invokes this via bundle.windows.signCommand (see src-tauri/tauri.conf.json) and passes
  the file to sign as the first argument (%1).

  Signing is OPTIONAL. If WINDOWS_CERTIFICATE is not set, the script exits successfully and the
  build produces an unsigned installer, so contributors can build locally without a certificate.

  Environment variables:
    WINDOWS_CERTIFICATE           base64 of a .pfx (PKCS#12) file. Required to actually sign.
    WINDOWS_CERTIFICATE_PASSWORD  password for the .pfx, if it has one.
    WINDOWS_TIMESTAMP_URL         RFC 3161 timestamp server (default: http://timestamp.digicert.com).
    TAURI_WINDOWS_SIGNTOOL_PATH   explicit path to signtool.exe (optional).

  To enable signing in CI, set the two secrets above in the repository settings.
#>
param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$FilePath
)

$ErrorActionPreference = 'Stop'

$certB64 = $env:WINDOWS_CERTIFICATE
if ([string]::IsNullOrWhiteSpace($certB64)) {
  Write-Host "WINDOWS_CERTIFICATE is not set - building an UNSIGNED artifact."
  Write-Host "Set WINDOWS_CERTIFICATE (base64 .pfx) and WINDOWS_CERTIFICATE_PASSWORD to sign."
  exit 0
}

if (-not (Test-Path -LiteralPath $FilePath -PathType Leaf)) {
  Write-Warning "Signing target not found, skipping: $FilePath"
  exit 0
}

function Resolve-SignTool {
  if ($env:TAURI_WINDOWS_SIGNTOOL_PATH -and (Test-Path -LiteralPath $env:TAURI_WINDOWS_SIGNTOOL_PATH)) {
    return $env:TAURI_WINDOWS_SIGNTOOL_PATH
  }
  $onPath = Get-Command signtool.exe -ErrorAction SilentlyContinue
  if ($onPath) { return $onPath.Source }
  $bases = @()
  if (${env:ProgramFiles(x86)}) { $bases += (Join-Path ${env:ProgramFiles(x86)} 'Windows Kits\10\bin') }
  if ($env:ProgramFiles) { $bases += (Join-Path $env:ProgramFiles 'Windows Kits\10\bin') }
  foreach ($b in $bases) {
    if (Test-Path -LiteralPath $b) {
      $hit = Get-ChildItem -LiteralPath $b -Directory |
        Sort-Object Name -Descending |
        ForEach-Object { Join-Path $_.FullName 'x64\signtool.exe' } |
        Where-Object { Test-Path -LiteralPath $_ } |
        Select-Object -First 1
      if ($hit) { return $hit }
    }
  }
  return $null
}

$signtool = Resolve-SignTool
if (-not $signtool) {
  throw "signtool.exe not found. Install the Windows SDK or set TAURI_WINDOWS_SIGNTOOL_PATH."
}

$timestamp = if ($env:WINDOWS_TIMESTAMP_URL) { $env:WINDOWS_TIMESTAMP_URL } else { 'http://timestamp.digicert.com' }

$pfx = Join-Path ([System.IO.Path]::GetTempPath()) ("stratum-sign-" + [guid]::NewGuid().ToString('N') + ".pfx")
$thumbprint = $null
try {
  [System.IO.File]::WriteAllBytes($pfx, [System.Convert]::FromBase64String($certB64))

  if (Get-Command Import-PfxCertificate -ErrorAction SilentlyContinue) {
    $importArgs = @{ FilePath = $pfx; CertStoreLocation = 'Cert:\CurrentUser\My' }
    if (-not [string]::IsNullOrEmpty($env:WINDOWS_CERTIFICATE_PASSWORD)) {
      $importArgs.Password = ConvertTo-SecureString $env:WINDOWS_CERTIFICATE_PASSWORD -AsPlainText -Force
    }
    $thumbprint = (Import-PfxCertificate @importArgs).Thumbprint

    & $signtool sign /fd SHA256 /td SHA256 /tr $timestamp /sha1 $thumbprint $FilePath
    if ($LASTEXITCODE -ne 0) { throw "signtool failed with exit code $LASTEXITCODE for $FilePath" }
  }
  else {
    $signArgs = @('sign', '/fd', 'SHA256', '/td', 'SHA256', '/tr', $timestamp, '/f', $pfx)
    if (-not [string]::IsNullOrEmpty($env:WINDOWS_CERTIFICATE_PASSWORD)) {
      $signArgs += @('/p', $env:WINDOWS_CERTIFICATE_PASSWORD)
    }
    $signArgs += $FilePath

    & $signtool @signArgs
    if ($LASTEXITCODE -ne 0) { throw "signtool failed with exit code $LASTEXITCODE for $FilePath" }
  }

  Write-Host "Signed $(Split-Path -Leaf $FilePath)"
}
finally {
  if ($thumbprint) {
    Remove-Item -LiteralPath ("Cert:\CurrentUser\My\" + $thumbprint) -Force -ErrorAction SilentlyContinue
  }
  if (Test-Path -LiteralPath $pfx) { Remove-Item -LiteralPath $pfx -Force -ErrorAction SilentlyContinue }
}
