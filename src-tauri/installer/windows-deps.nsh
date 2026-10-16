; Stratum Windows installer hooks.
; Requires Git (installed with the user's consent); offers optional Ollama.
; Silenced (unattended) installs skip all of this and rely on the in-app installer.

Function StratumHasGit
  ReadRegStr $0 HKLM "SOFTWARE\GitForWindows" "InstallPath"
  StrCmp $0 "" 0 stratum_git_found
  ReadRegStr $0 HKCU "SOFTWARE\GitForWindows" "InstallPath"
  StrCmp $0 "" 0 stratum_git_found
  IfFileExists "$PROGRAMFILES64\Git\cmd\git.exe" stratum_git_found
  IfFileExists "$PROGRAMFILES32\Git\cmd\git.exe" stratum_git_found
  IfFileExists "$LOCALAPPDATA\Programs\Git\cmd\git.exe" stratum_git_found
  Push 0
  Return
stratum_git_found:
  Push 1
FunctionEnd

Function StratumHasOllama
  IfFileExists "$LOCALAPPDATA\Programs\Ollama\ollama.exe" stratum_ollama_found
  ReadRegStr $0 HKCU "Software\Ollama" "InstallLocation"
  StrCmp $0 "" 0 stratum_ollama_found
  Push 0
  Return
stratum_ollama_found:
  Push 1
FunctionEnd

; Writes a small PowerShell helper to %TEMP% and runs it for $0 = git | lfs | ollama.
Function StratumInstallDep
  Pop $0
  FileOpen $9 "$TEMP\stratum-deps.ps1" w
  FileWrite $9 "param([string]$$dep)$\r$\n"
  FileWrite $9 "$$ErrorActionPreference='Stop'$\r$\n"
  FileWrite $9 "$$ua=@{'User-Agent'='Stratum'}$\r$\n"
  FileWrite $9 "function U($$repo,$$pat){ ((Invoke-RestMethod ('https://api.github.com/repos/'+$$repo+'/releases/latest') -Headers $$ua).assets | Where-Object { $$_.name -match $$pat } | Select-Object -First 1).browser_download_url }$\r$\n"
  FileWrite $9 "$$url = if($$dep -eq 'git'){ U 'git-for-windows/git' '64-bit\.exe$$' } elseif($$dep -eq 'lfs'){ U 'git-lfs/git-lfs' '^git-lfs-windows-v.*\.exe$$' } else { 'https://ollama.com/download/OllamaSetup.exe' }$\r$\n"
  FileWrite $9 "$$out = Join-Path $$env:TEMP ('stratum-'+$$dep+'-setup.exe')$\r$\n"
  FileWrite $9 "& curl.exe -L -s -o $$out $$url$\r$\n"
  FileWrite $9 "if((Get-AuthenticodeSignature $$out).Status -ne 'Valid'){ exit 3 }$\r$\n"
  FileWrite $9 "$$a=@('/VERYSILENT','/NORESTART','/SUPPRESSMSGBOXES','/NOCANCEL','/SP-')$\r$\n"
  FileWrite $9 "if($$dep -eq 'ollama'){ $$a=@('/VERYSILENT','/NORESTART','/SUPPRESSMSGBOXES') }$\r$\n"
  FileWrite $9 "$$p=Start-Process -FilePath $$out -ArgumentList $$a -Verb RunAs -Wait -PassThru$\r$\n"
  FileWrite $9 "exit $$p.ExitCode$\r$\n"
  FileClose $9
  nsExec::ExecToLog 'powershell -NoProfile -ExecutionPolicy Bypass -File "$TEMP\stratum-deps.ps1" $0'
  Pop $1
FunctionEnd

!macro NSIS_HOOK_PREINSTALL
  IfSilent stratum_pre_done
  StrCpy $R9 $INSTDIR 1
  StrCmp $R9 "C" stratum_pre_done
  StrCmp $R9 "c" stratum_pre_done
  StrCmp $R9 "" stratum_pre_done
  MessageBox MB_YESNO|MB_ICONQUESTION "Stratum runs fastest when it is installed on the C: drive.$\r$\n$\r$\nInstall to C: instead?" IDNO stratum_pre_done
  StrCpy $INSTDIR "$LOCALAPPDATA\Stratum"
stratum_pre_done:
!macroend

!macro NSIS_HOOK_POSTINSTALL
  IfSilent stratum_post_done

  Call StratumHasGit
  Pop $R9
  StrCmp $R9 "1" stratum_git_present
  MessageBox MB_YESNO|MB_ICONQUESTION "Stratum needs Git for version history, and it is not installed.$\r$\n$\r$\nDownload and install Git now? (about 60 MB, needs internet)" IDNO stratum_git_skip
  DetailPrint "Downloading and installing Git..."
  Push "git"
  Call StratumInstallDep
stratum_git_skip:
stratum_git_present:

  Call StratumHasOllama
  Pop $R9
  StrCmp $R9 "1" stratum_post_done
  MessageBox MB_YESNO|MB_ICONQUESTION "Optional: install Ollama for on-device AI tags and search by meaning?$\r$\n$\r$\n(This can also be done later in Stratum Settings.)" IDNO stratum_post_done
  DetailPrint "Downloading and installing Ollama..."
  Push "ollama"
  Call StratumInstallDep

stratum_post_done:
!macroend
