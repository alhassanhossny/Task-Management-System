using System.Drawing;
using System.Windows.Forms;

namespace TASK_Launcher
{
    partial class ConnectionErrorForm
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
            var iconLabel = new Label();
            var messageLabel = new Label();
            var retryButton = new Button();
            var exitButton = new Button();

            SuspendLayout();

            iconLabel.AutoSize = false;
            iconLabel.Font = new Font("Segoe UI", 48, FontStyle.Regular);
            iconLabel.ForeColor = Color.FromArgb(244, 67, 54);
            iconLabel.Text = "\u26A0";
            iconLabel.TextAlign = ContentAlignment.MiddleCenter;
            iconLabel.Size = new Size(80, 80);
            iconLabel.Location = new Point(110, 20);

            messageLabel.AutoSize = false;
            messageLabel.Font = new Font("Segoe UI", 12, FontStyle.Regular);
            messageLabel.ForeColor = Color.FromArgb(33, 33, 33);
            messageLabel.Text = "Unable to connect to TASK server.";
            messageLabel.TextAlign = ContentAlignment.MiddleCenter;
            messageLabel.Size = new Size(300, 40);
            messageLabel.Location = new Point(0, 110);

            retryButton.Font = new Font("Segoe UI", 10, FontStyle.Regular);
            retryButton.Size = new Size(100, 36);
            retryButton.Location = new Point(70, 170);
            retryButton.Text = "Retry";
            retryButton.UseVisualStyleBackColor = true;
            retryButton.Click += OnRetryClick;

            exitButton.Font = new Font("Segoe UI", 10, FontStyle.Regular);
            exitButton.Size = new Size(100, 36);
            exitButton.Location = new Point(190, 170);
            exitButton.Text = "Exit";
            exitButton.UseVisualStyleBackColor = true;
            exitButton.Click += OnExitClick;

            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(360, 230);
            Controls.Add(iconLabel);
            Controls.Add(messageLabel);
            Controls.Add(retryButton);
            Controls.Add(exitButton);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            Name = "ConnectionErrorForm";
            StartPosition = FormStartPosition.CenterParent;
            Text = "Connection Error";
            ResumeLayout(false);
        }
    }
}
