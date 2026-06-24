using System;
using System.Diagnostics;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace TASK_Launcher
{
    public partial class MainForm : Form
    {
        private readonly ConfigManager _config;
        private bool _fallbackMode;
        private bool _isFirstNavigation = true;

        public MainForm()
        {
            InitializeComponent();
            _config = new ConfigManager();
            Text = "TASK - Hospital IT Task Management";
        }

        private async void MainForm_Shown(object sender, EventArgs e)
        {
            try
            {
                await webView.EnsureCoreWebView2Async();
                webView.CoreWebView2.NavigationCompleted += OnNavigationCompleted;
                webView.CoreWebView2.Navigate(_config.ServerUrl);
            }
            catch
            {
                _fallbackMode = true;
                Process.Start(new ProcessStartInfo
                {
                    FileName = _config.ServerUrl,
                    UseShellExecute = true
                });
                Close();
            }
        }

        private void OnNavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            if (_isFirstNavigation && !e.IsSuccess)
            {
                _isFirstNavigation = false;
                BeginInvoke(new Action(ShowConnectionError));
            }
            _isFirstNavigation = false;
        }

        private void ShowConnectionError()
        {
            using (var errorForm = new ConnectionErrorForm())
            {
                var result = errorForm.ShowDialog(this);
                if (result == DialogResult.Retry)
                {
                    _isFirstNavigation = true;
                    webView.CoreWebView2.Navigate(_config.ServerUrl);
                }
                else
                {
                    Application.Exit();
                }
            }
        }
    }
}
