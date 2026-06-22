import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      {children}
    </Box>
  );
}
