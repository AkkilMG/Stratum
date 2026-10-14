cask "stratum" do
  version "0.1.0"

  on_arm do
    sha256 "__SHA256_ARM__"
    url "https://github.com/AkkilMG/Stratum/releases/download/v0.1.0/Stratum_0.1.0_aarch64.dmg",
        verified: "github.com/AkkilMG/Stratum/"
  end
  on_intel do
    sha256 "__SHA256_INTEL__"
    url "https://github.com/AkkilMG/Stratum/releases/download/v0.1.0/Stratum_0.1.0_x64.dmg",
        verified: "github.com/AkkilMG/Stratum/"
  end

  name "Stratum"
  desc "Local-first, versioned, searchable asset vault for game studios."
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
