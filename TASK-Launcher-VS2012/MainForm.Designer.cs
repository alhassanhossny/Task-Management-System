using System.Drawing;
using System.Windows.Forms;

namespace TASK_Launcher
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;
        private Label statusLabel;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
                components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            statusLabel = new Label();

            SuspendLayout();

            statusLabel.AutoSize = false;
            statusLabel.Size = new Size(1280, 800);
            statusLabel.Font = new Font("Segoe UI", 14, FontStyle.Regular);
            statusLabel.ForeColor = Color.FromArgb(33, 33, 33);
            statusLabel.Text = "Connecting to TASK server...";
            statusLabel.TextAlign = ContentAlignment.MiddleCenter;
            statusLabel.Dock = DockStyle.Fill;

            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1280, 800);
            Controls.Add(statusLabel);
            FormBorderStyle = FormBorderStyle.FixedSingle;
            MaximizeBox = false;
            MinimizeBox = true;
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            WindowState = FormWindowState.Minimized;
            ShowInTaskbar = false;
            Shown += MainForm_Shown;
            ResumeLayout(false);
        }
    }
}
