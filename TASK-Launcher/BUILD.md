# TASK Launcher - Build Instructions

## Prerequisites

- Windows 7 SP1 or later
- Visual Studio 2022 (Community Edition is free)
- .NET Framework 4.8 SDK (installed with VS 2022)
- WebView2 Runtime (optional - app falls back to browser if missing)

## Build Steps

### Using Visual Studio 2022

1. Open `TASK-Launcher.sln` in Visual Studio 2022
2. Restore NuGet packages:
   - Right-click solution → "Restore NuGet Packages"
   - Or: Tools → NuGet Package Manager → Package Manager Console → `dotnet restore`
3. Build:
   - Select "Release" configuration
   - Build → Build Solution (Ctrl+Shift+B)
4. Output: `bin\Release\TASK Launcher.exe`

### Using Command Line

```cmd
cd TASK-Launcher
nuget restore TASK-Launcher.sln
msbuild TASK-Launcher.sln /p:Configuration=Release
```

## Output Files

After build, the release folder (`bin\Release\`) contains:

| File | Description |
|------|-------------|
| `TASK Launcher.exe` | Main executable |
| `config.json` | Server URL configuration (edit to change target) |
| `Microsoft.Web.WebView2.Core.dll` | WebView2 runtime wrapper |
| Other DLLs | Dependencies |

## Running

Double-click `TASK Launcher.exe`.

To change the server URL, edit `config.json` in the same folder:
```json
{
  "server_url": "http://YOUR_SERVER_IP:8080"
}
```

## Creating Installer

### Option 1: Inno Setup (Recommended)

1. Download and install [Inno Setup](https://jrsoftware.org/isdl.php)
2. Open `installer\setup.iss` in Inno Setup
3. Compile (Ctrl+F9)
4. Output: `installer\Output\TASK-Launcher-Setup.exe`

### Option 2: Manual Deployment

Copy the entire `bin\Release\` folder to the target machine.

## WebView2 on Windows 7

- WebView2 Runtime supports Windows 7 SP1 with KB4490628 and KB4474419
- If WebView2 is not detected, the app automatically opens the system's default browser
- Download WebView2 Runtime: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
