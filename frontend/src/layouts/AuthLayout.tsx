import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleSwitchLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setLangAnchorEl(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, insetInlineEnd: 16 }}>
        <Tooltip title={t('common.arabic') + ' / ' + t('common.english')}>
          <IconButton color="primary" onClick={(e) => setLangAnchorEl(e.currentTarget)}>
            <LanguageIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={langAnchorEl}
          open={Boolean(langAnchorEl)}
          onClose={() => setLangAnchorEl(null)}
        >
          <MenuItem onClick={() => handleSwitchLang('ar')} selected={i18n.language === 'ar'}>
            {t('common.arabic')}
          </MenuItem>
          <MenuItem onClick={() => handleSwitchLang('en')} selected={i18n.language === 'en'}>
            {t('common.english')}
          </MenuItem>
        </Menu>
      </Box>
      {children}
    </Box>
  );
}
