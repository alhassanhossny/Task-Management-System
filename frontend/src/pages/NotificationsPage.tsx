import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all');
    fetchNotifications();
  };

  const handleMarkRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('notification.title')}</Typography>
        <Button variant="outlined" size="small" onClick={handleMarkAllRead}>
          {t('notification.markAllRead')}
        </Button>
      </Box>

      <Card>
        {notifications.length === 0 ? (
          <CardContent>
            <Typography color="text.secondary" align="center">{t('notification.noNotifications')}</Typography>
          </CardContent>
        ) : (
          <List>
            {notifications.map((notif: any, idx: number) => (
              <Box key={notif.id}>
                {idx > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!notif.isRead && (
                        <Button size="small" onClick={() => handleMarkRead(notif.id)}>
                          {t('notification.markRead')}
                        </Button>
                      )}
                      <Button size="small" color="error" onClick={() => handleDelete(notif.id)}>
                        {t('common.delete')}
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {i18n.language === 'ar' ? notif.titleAr : notif.titleEn}
                        </Typography>
                        {!notif.isRead && (
                          <Chip label={t('notification.unread')} size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          {i18n.language === 'ar' ? notif.messageAr : notif.messageEn}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notif.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
}
