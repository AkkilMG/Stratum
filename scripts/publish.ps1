# Publishes the built static site to the `gh-pages` branch so GitHub Pages can
# serve it via "Deploy from a branch". Run with: npm run publish
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "out"
$branch = "gh-pages"
$wt = Join-Path $env:TEMP "stratum-ghpages"

Write-Host "==> Building static site"
Push-Location $root
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }
}
finally {
  Pop-Location
}

if (-not (Test-Path (Join-Path $out "index.html"))) {
  throw "Build output not found at $out"
}

# Remove any stale worktree from a previous run
if (Test-Path $wt) {
  git worktree remove --force $wt | Out-Null
  if (Test-Path $wt) { Remove-Item -Recurse -Force $wt }
}

# Reuse the gh-pages branch if it exists (synced to origin), otherwise create an orphan
$hasBranch = $false
git -C $root show-ref --verify --quiet "refs/heads/$branch"
if ($LASTEXITCODE -eq 0) { $hasBranch = $true }

if ($hasBranch) {
  git -C $root worktree add --force $wt $branch
  git -C $wt fetch origin $branch | Out-Null
  git -C $wt reset --hard "origin/$branch" | Out-Null
}
else {
  git -C $root worktree add --orphan -b $branch $wt
}

# Replace the worktree contents with the fresh build (keep the .git pointer)
Get-ChildItem -Path $wt -Force |
  Where-Object { $_.Name -ne ".git" } |
  ForEach-Object { Remove-Item -Recurse -Force $_.FullName }

Copy-Item -Path (Join-Path $out "*") -Destination $wt -Recurse -Force
Copy-Item -Path (Join-Path $out ".nojekyll") -Destination $wt -Force

# Commit and push
git -C $wt add -A
$sha = git -C $root rev-parse --short HEAD
git -C $wt commit -m "deploy: static site from wiki @ $sha" | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "==> Nothing new to publish"
}
else {
  git -C $wt push origin $branch
}

git worktree remove --force $wt
Write-Host "==> Published $out to '$branch'"
