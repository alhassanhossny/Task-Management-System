# TASK Launcher - Build Instructions (Visual Studio 2012)

## Prerequisites

- Windows 7 SP1
- Visual Studio 2012 (any edition)
- .NET Framework 4.5 SDK (included with VS 2012)

## Build Steps

1. Open `TASK-Launcher.sln` in Visual Studio 2012
2. Select "Release" configuration
3. Build → Build Solution (F6)

No NuGet packages required. Zero external dependencies.

## Output

- `bin\Release\TASK Launcher.exe`
- `config.txt`

## How It Works

1. Shows splash screen
2. Pings the server URL
3. Launches browser in kiosk (full screen) mode:
   - **Chrome** → `--kiosk` (if installed)
   - **Firefox** → `--kiosk` (if installed)
   - **Internet Explorer** → `-k` (always available on Windows 7)
4. If server unreachable: error dialog with Retry/Exit

To change the server address, edit `config.txt`:
```
http://172.16.1.10:8080
```

## Kiosk Browser Navigation

| Browser | Exit Kiosk | Notes |
|---------|-----------|-------|
| Chrome | Alt+F4 or Esc | Most secure, modern rendering |
| Firefox | Alt+F4 | Requires Firefox installed |
| IE | Alt+F4 | Built-in on Windows 7, may not render modern apps well |

## Alternative: Direct Kiosk Shortcuts (No Build Required)

These batch files launch the browser in fullscreen directly:

| File | Browser |
|------|---------|
| `Chrome-Kiosk.bat` | Chrome fullscreen (if installed) |
| `IE-Kiosk.bat` | Internet Explorer fullscreen (built-in) |

Or create a Windows shortcut:
1. Right-click desktop → New → Shortcut
2. For Chrome: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://172.16.1.10:8080"`
3. For IE: `"C:\Program Files\Internet Explorer\iexplore.exe" -k "http://172.16.1.10:8080"`
4. Name: `TASK - Hospital IT Task Management`

## Creating Installer

Use Inno Setup with `installer\setup.iss`:
1. Install [Inno Setup](https://jrsoftware.org/isdl.php)
2. Open `installer\setup.iss`
3. Compile (Ctrl+F9)
