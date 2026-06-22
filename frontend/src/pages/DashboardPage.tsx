import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/auth.context';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { isAdmin, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/tasks/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = isAdmin
    ? [
        { label: t('dashboard.totalTasks'), value: stats?.total || 0, color: '#1976d2' },
        { label: t('dashboard.openTasks'), value: stats?.openTasks || 0, color: '#ff9800' },
        { label: t('dashboard.closedTasks'), value: stats?.closedTasks || 0, color: '#4caf50' },
        { label: t('dashboard.cancelledTasks'), value: stats?.cancelledTasks || 0, color: '#f44336' },
      ]
    : [
        { label: t('dashboard.openTasks'), value: stats?.openTasks || 0, color: '#ff9800' },
        { label: t('dashboard.assignedTasks'), value: stats?.assignedTasks || 0, color: '#1976d2' },
        { label: t('dashboard.waitingTasks'), value: stats?.waitingTasks || 0, color: '#9c27b0' },
        { label: t('dashboard.completedTasks'), value: stats?.completedTasks || 0, color: '#4caf50' },
      ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.welcome')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {user?.fullNameAr || user?.fullNameEn}
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card sx={{ borderTop: `4px solid ${card.color}` }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: card.color }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isAdmin && stats?.deptStats && stats.deptStats.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.tasksByDepartment')}
            </Typography>
            <Grid container spacing={2}>
              {stats.deptStats.map((dept: any) => (
                <Grid item xs={12} sm={6} md={4} key={dept.departmentNameAr}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2">
                      {localStorage.getItem('i18nextLng') === 'ar' ? dept.departmentNameAr : dept.departmentNameEn}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {dept.count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
