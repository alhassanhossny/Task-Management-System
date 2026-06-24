using System.IO;
using System.Windows.Forms;

namespace TASK_Launcher
{
    public class ConfigManager
    {
        private const string FileName = "config.txt";

        public string ServerUrl { get; private set; }

        public ConfigManager()
        {
            ServerUrl = "http://172.16.1.10:8080";
            Load();
        }

        private void Load()
        {
            string path = Path.Combine(Application.StartupPath, FileName);

            if (!File.Exists(path))
                return;

            try
            {
                string url = File.ReadAllText(path).Trim();

                if (!string.IsNullOrEmpty(url))
                    ServerUrl = url;
            }
            catch
            {
            }
        }
    }
}
