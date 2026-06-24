; TASK Launcher - Inno Setup Installer
; Requires Inno Setup 6+ (https://jrsoftware.org/isdl.php)

#define MyAppName "TASK Launcher"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Hospital IT"
#define MyAppURL "http://172.16.1.10:8080"
#define MyAppExeName "TASK Launcher.exe"

[Setup]
AppId={{A8E3B2C1-5F4D-4A6E-9C8D-7E1F2B3C4A5D}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppSupportURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
UninstallDisplayIcon={app}\{#MyAppExeName}
Compression=lzma2
SolidCompression=yes
OutputDir=Output
OutputBaseFilename=TASK-Launcher-Setup-{#MyAppVersion}
DisableProgramGroupPage=yes
PrivilegesRequired=admin
MinVersion=6.1.7601
ArchitecturesInstallIn64BitMode=x64compatible

[Languages]
Name: "english"; MessagesFile: "compiler:Default.iso"
Name: "arabic"; MessagesFile: "compiler:Languages\Arabic.iso"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional shortcuts:"; Flags: checkedonce

[Files]
Source: "..\bin\Release\TASK Launcher.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\bin\Release\*.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\bin\Release\*.config"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\bin\Release\config.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\bin\Release\*.exe.config"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\task.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\task.ico"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\task.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent

[UninstallRun]
Filename: "{cmd}"; Parameters: "/C taskkill /f /im ""{#MyAppExeName}"""; Flags: runhidden

[Code]
function InitializeSetup: Boolean;
begin
  Result := True;
end;
