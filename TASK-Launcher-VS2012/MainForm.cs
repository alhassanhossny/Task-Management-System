using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Windows.Forms;
using Microsoft.Win32;

namespace TASK_Launcher
{
    public partial class MainForm : Form
    {
        private readonly ConfigManager _config;

        public MainForm()
        {
            InitializeComponent();
            _config = new ConfigManager();
            Text = "TASK - Hospital IT Task Management";
        }

        private void MainForm_Shown(object sender, EventArgs e)
        {
            if (TryPingServer(_config.ServerUrl))
            {
                LaunchKiosk(_config.ServerUrl);
                Close();
            }
            else
            {
                using (var errorForm = new ConnectionErrorForm())
                {
                    var result = errorForm.ShowDialog(this);
                    if (result == DialogResult.Retry)
                    {
                        MainForm_Shown(sender, e);
                    }
                    else
                    {
                        Application.Exit();
                    }
                }
            }
        }

        private static void LaunchKiosk(string url)
        {
            string browserPath = GetDefaultBrowserPath();

            if (browserPath != null)
            {
                string name = Path.GetFileNameWithoutExtension(browserPath).ToLower();

                if (name.Contains("chrome") || name.Contains("supermium"))
                {
                    Process.Start(browserPath, "--kiosk --no-first-run --no-default-browser-check \"" + url + "\"");
                    return;
                }

                if (name.Contains("firefox") || name.Contains("mozilla"))
                {
                    Process.Start(browserPath, "--kiosk \"" + url + "\"");
                    return;
                }

                if (name.Contains("edge") || name.Contains("msedge"))
                {
                    Process.Start(browserPath, "--kiosk \"" + url + "\"");
                    return;
                }

                if (name.Contains("iexplore") || name.Contains("internet"))
                {
                    Process.Start(new ProcessStartInfo { FileName = url, UseShellExecute = true });
                    return;
                }
            }

            // Fallback: scan known browsers
            string programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            string programFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            string desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            string userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

            string supermium = FindInFolder("Supermium", programFiles)
                            ?? FindInFolder("Supermium", programFilesX86)
                            ?? FindInFolder("Supermium", localAppData)
                            ?? FindInFolder("Supermium", desktop)
                            ?? FindInFolder("Supermium", Environment.GetFolderPath(Environment.SpecialFolder.CommonDesktopDirectory))
                            ?? FindExe(desktop, "supermium.exe")
                            ?? FindExe(desktop, "chrome.exe")
                            ?? FindExe(userProfile, "supermium.exe");
            if (supermium != null)
            {
                Process.Start(supermium, "--kiosk --no-first-run --no-default-browser-check \"" + url + "\"");
                return;
            }

            string chrome = FindExe(programFiles, @"Google\Chrome\Application\chrome.exe")
                         ?? FindExe(programFilesX86, @"Google\Chrome\Application\chrome.exe")
                         ?? FindExe(localAppData, @"Google\Chrome\Application\chrome.exe");
            if (chrome != null)
            {
                Process.Start(chrome, "--kiosk --no-first-run --no-default-browser-check \"" + url + "\"");
                return;
            }

            string firefox = FindExe(programFiles, @"Mozilla Firefox\firefox.exe")
                          ?? FindExe(programFilesX86, @"Mozilla Firefox\firefox.exe");
            if (firefox != null)
            {
                Process.Start(firefox, "--kiosk \"" + url + "\"");
                return;
            }

            Process.Start(new ProcessStartInfo { FileName = url, UseShellExecute = true });
        }

        private static string GetDefaultBrowserPath()
        {
            try
            {
                using (var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice"))
                {
                    if (key == null) return null;
                    string progId = key.GetValue("Progid") as string;
                    if (string.IsNullOrEmpty(progId)) return null;

                    using (var cmdKey = Registry.ClassesRoot.OpenSubKey(progId + @"\shell\open\command"))
                    {
                        if (cmdKey == null) return null;
                        string cmd = cmdKey.GetValue("") as string;
                        if (string.IsNullOrEmpty(cmd)) return null;

                        cmd = cmd.Trim();
                        if (cmd.StartsWith("\""))
                        {
                            return cmd.Substring(1, cmd.IndexOf("\"", 1) - 1);
                        }
                        else if (cmd.Contains(" "))
                        {
                            return cmd.Substring(0, cmd.IndexOf(" "));
                        }
                        return cmd;
                    }
                }
            }
            catch
            {
                return null;
            }
        }

        private static string FindInFolder(string folderName, string basePath)
        {
            if (basePath == null) return null;
            string dir = Path.Combine(basePath, folderName);
            if (!Directory.Exists(dir)) return null;

            foreach (string exeName in new[] { "supermium.exe", "chrome.exe", "browser.exe" })
            {
                string full = Path.Combine(dir, exeName);
                if (File.Exists(full)) return full;
            }

            foreach (string sub in new[] { "Application", "app", "bin" })
            {
                string subDir = Path.Combine(dir, sub);
                if (Directory.Exists(subDir))
                {
                    foreach (string exeName in new[] { "supermium.exe", "chrome.exe", "browser.exe" })
                    {
                        string full = Path.Combine(subDir, exeName);
                        if (File.Exists(full)) return full;
                    }
                }
            }

            return null;
        }

        private static string FindExe(string basePath, string relativePath)
        {
            if (basePath == null) return null;
            string full = Path.Combine(basePath, relativePath);
            return File.Exists(full) ? full : null;
        }

        private static bool TryPingServer(string url)
        {
            try
            {
                var request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "HEAD";
                request.Timeout = 5000;
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    return response.StatusCode == HttpStatusCode.OK;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
