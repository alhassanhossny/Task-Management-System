import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/auth.context';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const cards = [
    { label: t('dashboard.totalTasks'), value: stats?.total || 0, color: '#1976d2', status: '' },
    { label: t('dashboard.assignedTasks'), value: stats?.assignedTasks || 0, color: '#f5a623', status: 'assigned' },
    { label: t('dashboard.completedTasks'), value: stats?.completedTasks || 0, color: '#4caf50', status: 'completed' },
    { label: t('dashboard.cancelledTasks'), value: stats?.cancelledTasks || 0, color: '#f44336', status: 'cancelled' },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card
              sx={{ borderTop: `4px solid ${card.color}`, cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate(card.status ? `/tasks?status=${card.status}` : '/tasks')}
            >
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
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t('dashboard.tasksByDepartment')}
          </Typography>
          <Grid container spacing={2}>
            {stats.deptStats.map((dept: any) => (
              <Grid item xs={12} sm={6} md={4} key={dept.departmentNameAr}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                  onClick={() => navigate(`/tasks?departmentId=${dept.departmentId}`)}
                >
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {localStorage.getItem('i18nextLng') === 'ar' ? dept.departmentNameAr : dept.departmentNameEn}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {dept.count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            {t('dashboard.analytics')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {t('dashboard.tasksByStatus')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: t('task.statuses.assigned'), count: stats?.assignedTasks || 0, fill: '#f5a623' },
                      { name: t('task.statuses.completed'), count: stats?.completedTasks || 0, fill: '#4caf50' },
                      { name: t('task.statuses.cancelled'), count: stats?.cancelledTasks || 0, fill: '#f44336' },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {t('dashboard.tasksByDepartment')}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.deptStats.map((d: any) => ({
                      name: localStorage.getItem('i18nextLng') === 'ar' ? d.departmentNameAr : d.departmentNameEn,
                      count: parseInt(d.count),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
