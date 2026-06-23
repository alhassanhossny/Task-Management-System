import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const DRAWER_WIDTH = 260;

export default function MainLayout() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header drawerWidth={DRAWER_WIDTH} onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: 'calc(100% - 24px)' },
          ...(isRtl ? { mr: '24px' } : { ml: '24px' }),
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
