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
    <Box sx={{ display: 'flex', direction: isRtl ? 'rtl' : 'ltr', height: '100vh', overflow: 'hidden' }}>
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
          minWidth: 0,
          height: '100vh',
          overflow: 'auto',
          p: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
