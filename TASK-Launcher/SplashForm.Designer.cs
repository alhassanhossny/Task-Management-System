using System.Drawing;
using System.Windows.Forms;

namespace TASK_Launcher
{
    partial class SplashForm
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
                components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            var titleLabel = new Label();
            var subtitleLabel = new Label();
            var versionLabel = new Label();

            SuspendLayout();

            titleLabel.AutoSize = false;
            titleLabel.Font = new Font("Segoe UI", 36, FontStyle.Bold);
            titleLabel.ForeColor = Color.White;
            titleLabel.Text = "TASK";
            titleLabel.TextAlign = ContentAlignment.MiddleCenter;
            titleLabel.Size = new Size(400, 70);
            titleLabel.Location = new Point(50, 90);

            subtitleLabel.AutoSize = false;
            subtitleLabel.Font = new Font("Segoe UI", 14, FontStyle.Regular);
            subtitleLabel.ForeColor = Color.FromArgb(187, 222, 251);
            subtitleLabel.Text = "Hospital IT Task Management";
            subtitleLabel.TextAlign = ContentAlignment.MiddleCenter;
            subtitleLabel.Size = new Size(400, 30);
            subtitleLabel.Location = new Point(50, 170);

            versionLabel.AutoSize = false;
            versionLabel.Font = new Font("Segoe UI", 9, FontStyle.Italic);
            versionLabel.ForeColor = Color.FromArgb(144, 202, 249);
            versionLabel.Text = "v1.0.0";
            versionLabel.TextAlign = ContentAlignment.MiddleCenter;
            versionLabel.Size = new Size(400, 20);
            versionLabel.Location = new Point(50, 210);

            ClientSize = new Size(500, 300);
            Controls.Add(titleLabel);
            Controls.Add(subtitleLabel);
            Controls.Add(versionLabel);
            FormBorderStyle = FormBorderStyle.None;
            StartPosition = FormStartPosition.CenterScreen;
            ShowInTaskbar = false;
            TopMost = true;
            ResumeLayout(false);
        }
    }
}
