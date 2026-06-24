using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace TASK_Launcher
{
    public partial class SplashForm : Form
    {
        private readonly Timer _timer;

        public SplashForm()
        {
            InitializeComponent();

            _timer = new Timer();
            _timer.Interval = 2500;
            _timer.Tick += OnTimerTick;
            _timer.Start();
        }

        private void OnTimerTick(object sender, EventArgs e)
        {
            _timer.Stop();
            DialogResult = DialogResult.OK;
            Close();
        }

        protected override void OnPaintBackground(PaintEventArgs e)
        {
            using (var brush = new LinearGradientBrush(
                ClientRectangle,
                Color.FromArgb(25, 118, 210),
                Color.FromArgb(13, 71, 161),
                LinearGradientMode.Vertical))
            {
                e.Graphics.FillRectangle(brush, ClientRectangle);
            }
        }
    }
}
