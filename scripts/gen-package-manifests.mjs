// Refreshes the package-manager manifests in packaging/ for a release.
// Reads signed artifacts from a directory, computes SHA-256 and writes winget, Scoop,
// Chocolatey and Homebrew manifests. Missing artifacts keep a __SHA256_*__ placeholder.
// Usage: node scripts/gen-package-manifests.mjs [--version 0.1.0] [--artifacts <dir>] [--repo AkkilMG/Stratum]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};

const conf = JSON.parse(fs.readFileSync("src-tauri/tauri.conf.json", "utf8"));
const version = arg("version", conf.version);
const repo = arg("repo", "AkkilMG/Stratum");
const tag = arg("tag", `v${version}`);
const base = `https://github.com/${repo}/releases/download/${tag}`;
const dir = path.resolve(arg("artifacts", "dist-artifacts"));
const pkgId = "Arkynox.Stratum";

const find = (re) => {
  if (!fs.existsSync(dir)) return null;
  const f = fs.readdirSync(dir).find((x) => re.test(x) && fs.statSync(path.join(dir, x)).isFile());
  return f ? path.join(dir, f) : null;
};
const sha = (file) => (file ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") : null);

const artifacts = {
  nsis: find(new RegExp(`^Stratum_${version}_.*-setup\\.exe$`)),
  msi: find(new RegExp(`^Stratum_${version}_x64_en-US\\.msi$`)),
  dmgArm: find(new RegExp(`^Stratum_${version}_aarch64\\.dmg$`)),
  dmgIntel: find(new RegExp(`^Stratum_${version}_x64\\.dmg$`)),
  appimage: find(new RegExp(`^Stratum_${version}_.*\\.AppImage$`)),
  deb: find(new RegExp(`^Stratum_${version}_.*\\.deb$`)),
};

const name = (file) => (file ? path.basename(file) : null);
const url = (file) => (file ? `${base}/${name(file)}` : null);
const h = (file) => sha(file);

const write = (rel, body) => {
  const p = path.join("packaging", rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body);
  console.log("wrote", p);
};

const winUrl = url(artifacts.nsis) || `${base}/Stratum_${version}_x64-setup.exe`;
const winSha = h(artifacts.nsis) || "__SHA256__";
const armUrl = url(artifacts.dmgArm) || `${base}/Stratum_${version}_aarch64.dmg`;
const armSha = h(artifacts.dmgArm) || "__SHA256_ARM__";
const intelUrl = url(artifacts.dmgIntel) || `${base}/Stratum_${version}_x64.dmg`;
const intelSha = h(artifacts.dmgIntel) || "__SHA256_INTEL__";

const desc = "Local-first, versioned, searchable asset vault for game studios.";

// --- winget -----------------------------------------------------------------
write("winget/Arkynox.Stratum.yaml", `PackageIdentifier: ${pkgId}
PackageVersion: ${version}
DefaultLocale: en-US
ManifestType: version
ManifestVersion: 1.6.0
`);

write("winget/Arkynox.Stratum.installer.yaml", `PackageIdentifier: ${pkgId}
PackageVersion: ${version}
InstallerLocale: en-US
Platform:
  - Windows.Desktop
MinimumOSVersion: 10.0.17763.0
InstallerType: nullsoft
Scope: user
InstallModes:
  - interactive
  - silent
  - silentWithProgress
UpgradeBehavior: install
Installers:
  - Architecture: x64
    InstallerUrl: ${winUrl}
    InstallerSha256: ${winSha.toUpperCase()}
ManifestType: installer
ManifestVersion: 1.6.0
`);

write("winget/Arkynox.Stratum.locale.en-US.yaml", `PackageIdentifier: ${pkgId}
PackageVersion: ${version}
PackageLocale: en-US
Publisher: Arkynox
PublisherUrl: https://arkynox.com
PublisherSupportUrl: https://github.com/${repo}/issues
Author: Akkil M G
PackageName: Stratum
PackageUrl: https://arkynox.com
License: Apache-2.0 OR Stratum Community License
LicenseUrl: https://github.com/${repo}/blob/main/LICENSING.md
Copyright: \u00a9 2026 Arkynox
ShortDescription: ${desc}
Description: >
  Stratum keeps every version of every texture, map, model and source file,
  finds assets by what they look like, and works fully offline. It is a local
  first, searchable asset vault for game studios and a product of Arkynox.
Moniker: stratum
Tags:
  - game-development
  - asset-management
  - version-control
  - search
  - local-first
  - tauri
ReleaseNotesUrl: https://github.com/${repo}/releases/tag/${tag}
ManifestType: defaultLocale
ManifestVersion: 1.6.0
`);

// --- Scoop ------------------------------------------------------------------
const nsisName = name(artifacts.nsis) || `Stratum_${version}_x64-setup.exe`;
const autoBase = `https://github.com/${repo}/releases/download/v$version`;
write("scoop/stratum.json", `${JSON.stringify({
  $schema: "https://raw.githubusercontent.com/ScoopInstaller/Scoop/master/schema.json",
  version,
  description: desc,
  homepage: "https://arkynox.com",
  license: "Apache-2.0 OR LicenseRef-Stratum-Community-1.0",
  architecture: { "64bit": { url: winUrl, hash: winSha } },
  installer: {
    script: [
      `$f = "$dir\\${nsisName}"`,
      "Start-Process -Wait -FilePath $f -ArgumentList '/S'",
      "Remove-Item $f",
    ],
  },
  checkver: { github: `https://github.com/${repo}` },
  autoupdate: {
    architecture: { "64bit": { url: `${autoBase}/Stratum_$version_x64-setup.exe` } },
  },
}, null, 2) + "\n"}`);

// --- Chocolatey -------------------------------------------------------------
write("chocolatey/stratum.nuspec", `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2015/06/nuspec.xsd">
  <metadata>
    <id>stratum</id>
    <version>${version}</version>
    <title>Stratum</title>
    <authors>Akkil M G</authors>
    <owners>Arkynox</owners>
    <projectUrl>https://arkynox.com</projectUrl>
    <packageSourceUrl>https://github.com/${repo}/tree/main/packaging/chocolatey</packageSourceUrl>
    <projectSourceUrl>https://github.com/${repo}</projectSourceUrl>
    <docsUrl>https://github.com/${repo}/blob/main/README.md</docsUrl>
    <bugTrackerUrl>https://github.com/${repo}/issues</bugTrackerUrl>
    <tags>stratum game-development asset-management version-control local-first</tags>
    <summary>${desc}</summary>
    <description>Stratum keeps every version of every texture, map, model and source file, finds assets by what they look like, and works fully offline.</description>
    <licenseUrl>https://github.com/${repo}/blob/main/LICENSING.md</licenseUrl>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <releaseNotes>https://github.com/${repo}/releases/tag/${tag}</releaseNotes>
    <copyright>\u00a9 2026 Arkynox</copyright>
  </metadata>
  <files>
    <file src="tools\\**" target="tools" />
  </files>
</package>
`);

write("chocolatey/tools/chocolateyinstall.ps1", `$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'stratum'
  fileType       = 'exe'
  url64bit       = '${winUrl}'
  checksum64     = '${winSha}'
  checksumType64 = 'sha256'
  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
`);

// --- Homebrew Cask ----------------------------------------------------------
write("homebrew/stratum.rb", `cask "stratum" do
  version "${version}"

  on_arm do
    sha256 "${armSha}"
    url "${armUrl}",
        verified: "github.com/${repo}/"
  end
  on_intel do
    sha256 "${intelSha}"
    url "${intelUrl}",
        verified: "github.com/${repo}/"
  end

  name "Stratum"
  desc "${desc}"
  homepage "https://arkynox.com"

  livecheck do
    url :url
    strategy :github_latest
  end

  depends_on macos: ">= :big_sur"

  app "Stratum.app"

  zap trash: [
    "~/Library/Application Support/com.arkynox.stratum",
    "~/Library/Caches/com.arkynox.stratum",
    "~/Library/Preferences/com.arkynox.stratum.plist",
    "~/Library/Saved Application State/com.arkynox.stratum.savedState",
  ]
end
`);

console.log(`\nmanifests refreshed for v${version} (${repo})`);
if (!artifacts.nsis) console.log("no artifacts found in", dir, "- placeholder hashes written; re-run after downloading release assets with --artifacts <dir>");
