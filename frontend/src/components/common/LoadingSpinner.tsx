import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export default function LoadingSpinner() {
  const { t } = useTranslation();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t('common.loading')}
      </Typography>
    </Box>
  );
}
