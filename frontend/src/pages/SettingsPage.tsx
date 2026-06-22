import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function SettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data.data || []);
      } catch { }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSave = async (key: string, value: string) => {
    try {
      await api.put(`/settings/${key}`, { value });
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('nav.settings')}</Typography>
      <Card>
        <CardContent>
          {settings.map((setting: any) => (
            <Box key={setting.key} sx={{ mb: 2 }}>
              <SettingRow setting={setting} onSave={handleSave} />
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}

function SettingRow({ setting, onSave }: { setting: any; onSave: (key: string, value: string) => void }) {
  const [value, setValue] = React.useState(setting.value);
  const [dirty, setDirty] = React.useState(false);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={5}>
        <Typography variant="body2" color="text.secondary">{setting.key}</Typography>
        <Typography variant="body2">{setting.description}</Typography>
      </Grid>
      <Grid item xs={12} sm={5}>
        <TextField
          fullWidth
          size="small"
          value={value}
          onChange={(e) => { setValue(e.target.value); setDirty(true); }}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          disabled={!dirty}
          onClick={() => { onSave(setting.key, value); setDirty(false); }}
        >
          {t('common.save')}
        </Button>
      </Grid>
    </Grid>
  );
}
