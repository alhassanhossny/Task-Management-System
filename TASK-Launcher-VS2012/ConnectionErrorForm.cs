using System;
using System.Windows.Forms;

namespace TASK_Launcher
{
    public partial class ConnectionErrorForm : Form
    {
        public ConnectionErrorForm()
        {
            InitializeComponent();
        }

        private void OnRetryClick(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Retry;
            Close();
        }

        private void OnExitClick(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }
    }
}
