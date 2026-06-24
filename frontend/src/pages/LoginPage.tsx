import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/auth.context';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message?.[0] || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 420, width: '100%', mx: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          {t('app.shortName')}
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          {t('auth.login')}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="username"
            label={t('auth.username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            name="password"
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {loading ? t('common.loading') : t('auth.login')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
