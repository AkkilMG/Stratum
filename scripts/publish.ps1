# Publishes the built static site to the `gh-pages` branch so GitHub Pages can
# serve it via "Deploy from a branch", then pushes the current (wiki) branch.
# Run with: npm run publish
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "out"
$branch = "gh-pages"
$wt = Join-Path $env:TEMP "stratum-ghpages"

$srcBranch = git -C $root rev-parse --abbrev-ref HEAD
if ($LASTEXITCODE -ne 0 -or -not $srcBranch -or $srcBranch -eq "HEAD") {
  throw "Unable to determine current branch (detached HEAD?)"
}
if ($srcBranch -ne "wiki") { throw "Checked out '$srcBranch'; run this from the 'wiki' branch" }

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
  git -C $root worktree remove --force $wt | Out-Null
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
  if ($LASTEXITCODE -ne 0) { throw "git push origin $branch failed" }
}

git -C $root worktree remove --force $wt

# Commit any pending changes on the source branch so they get pushed too
Write-Host "==> Committing pending changes on '$srcBranch'"
git -C $root add -A
$status = git -C $root status --porcelain
if ($status) {
  git -C $root commit -m "chore(wiki): publish snapshot @ $sha"
  if ($LASTEXITCODE -ne 0) { throw "git commit on $srcBranch failed" }
}
else {
  Write-Host "==> Nothing to commit on '$srcBranch'"
}

Write-Host "==> Pushing source branch '$srcBranch'"
git -C $root push origin $srcBranch
if ($LASTEXITCODE -ne 0) { throw "git push origin $srcBranch failed" }

Write-Host "==> Published $out to '$branch' and pushed '$srcBranch'"
