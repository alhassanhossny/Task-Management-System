@echo off
title TASK - Hospital IT Task Management (Chrome Kiosk)
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --no-first-run --no-default-browser-check "http://172.16.1.10:8080"
exit
