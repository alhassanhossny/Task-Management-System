import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../store/auth.context';
import { useDirection } from '../../hooks/useDirection';
import api from '../../services/api';

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

export default function Header({ drawerWidth, onDrawerToggle }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const { isRtl } = useDirection();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/notifications/unread-count');
        setUnreadCount(res.data.data.count);
      } catch { }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSwitchLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setLangAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
      style={{ [isRtl ? 'right' : 'left']: `${drawerWidth}px` }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge={isRtl ? 'end' : 'start'}
          onClick={onDrawerToggle}
          sx={{ [isRtl ? 'ml' : 'mr']: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ fontWeight: 600, mr: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          {i18n.language === 'ar'
            ? `${user?.departmentNameAr || ''} / ${user?.fullNameAr || ''}`
            : `${user?.departmentNameEn || ''} / ${user?.fullNameEn || ''}`}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={t('nav.notifications')}>
            <IconButton color="inherit" onClick={() => navigate('/notifications')}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={t('common.arabic') + ' / ' + t('common.english')}>
            <IconButton color="inherit" onClick={(e) => setLangAnchorEl(e.currentTarget)}>
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

          <Tooltip title={t('nav.profile')}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
                {user?.fullNameAr?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {i18n.language === 'ar' ? user?.fullNameAr : user?.fullNameEn}
              </Typography>
            </MenuItem>
            {isAdmin && (
              <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                {t('nav.settings')}
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              {t('nav.logout')}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
