using System.IO;
using Newtonsoft.Json;

namespace TASK_Launcher
{
    public class ConfigManager
    {
        private const string FileName = "config.json";

        public string ServerUrl { get; private set; } = "http://172.16.1.10:8080";

        public ConfigManager()
        {
            Load();
        }

        private void Load()
        {
            var path = Path.Combine(Application.StartupPath, FileName);
            if (!File.Exists(path)) return;

            try
            {
                var json = File.ReadAllText(path);
                var data = JsonConvert.DeserializeObject<ConfigData>(json);
                if (data != null && !string.IsNullOrWhiteSpace(data.ServerUrl))
                {
                    ServerUrl = data.ServerUrl;
                }
            }
            catch
            {
            }
        }

        private class ConfigData
        {
            [JsonProperty("server_url")]
            public string ServerUrl { get; set; }
        }
    }
}
