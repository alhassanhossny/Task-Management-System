import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function UsersPage() {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data.data || []);
      } catch { }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('nav.users')}</Typography>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('user.fullNameAr')}</TableCell>
                <TableCell>{t('user.username')}</TableCell>
                <TableCell>{t('user.email')}</TableCell>
                <TableCell>{t('user.role')}</TableCell>
                <TableCell>{t('user.department')}</TableCell>
                <TableCell>{t('user.isActive')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">{t('user.noUsers')}</TableCell></TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{i18n.language === 'ar' ? user.fullNameAr : user.fullNameEn}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? user.roleNameAr : user.roleNameEn}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? user.departmentNameAr : user.departmentNameEn}</TableCell>
                    <TableCell>
                      <Chip label={user.isActive ? t('common.yes') || 'Yes' : t('common.no') || 'No'} size="small"
                        color={user.isActive ? 'success' : 'error'} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
