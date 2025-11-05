@echo off
echo 🚀 Starting Expo project with auto keypress (s + a)...
start cmd /k "npx expo start"
timeout /t 7 >nul
powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.AppActivate('cmd.exe'); Start-Sleep -Seconds 1; $wshell.SendKeys('s'); Start-Sleep -Seconds 2; $wshell.SendKeys('a')"
