using System.Drawing;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;

namespace TASK_Launcher
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;
        private WebView2 webView;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
                components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            webView = new WebView2();

            SuspendLayout();

            webView.AllowExternalDrop = true;
            webView.BackColor = Color.White;
            webView.CreationProperties = null;
            webView.DefaultBackgroundColor = Color.White;
            webView.Dock = DockStyle.Fill;
            webView.Location = new Point(0, 0);
            webView.Name = "webView";
            webView.TabIndex = 0;
            webView.ZoomFactor = 1.0;

            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1280, 800);
            Controls.Add(webView);
            FormBorderStyle = FormBorderStyle.FixedSingle;
            Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
            MaximizeBox = false;
            MinimizeBox = true;
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Shown += MainForm_Shown;
            ResumeLayout(false);
        }
    }
}
