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

export default function DepartmentsPage() {
  const { t, i18n } = useTranslation();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/departments');
        setDepartments(res.data.data || []);
      } catch { }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('nav.departments')}</Typography>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('department.nameAr')}</TableCell>
                <TableCell>{t('department.nameEn')}</TableCell>
                <TableCell>{t('department.code')}</TableCell>
                <TableCell>{t('department.isActive')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((dept: any) => (
                <TableRow key={dept.id} hover>
                  <TableCell>{dept.nameAr}</TableCell>
                  <TableCell>{dept.nameEn}</TableCell>
                  <TableCell><Chip label={dept.code} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Chip label={dept.isActive ? t('common.yes') || 'Yes' : t('common.no') || 'No'}
                      size="small" color={dept.isActive ? 'success' : 'error'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
