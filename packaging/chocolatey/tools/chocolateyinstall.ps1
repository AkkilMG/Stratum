$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'stratum'
  fileType       = 'exe'
  url64bit       = 'https://github.com/AkkilMG/Stratum/releases/download/v0.1.0/Stratum_0.1.0_x64-setup.exe'
  checksum64     = '__SHA256__'
  checksumType64 = 'sha256'
  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
