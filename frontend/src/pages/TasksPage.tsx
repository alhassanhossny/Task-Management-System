import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/auth.context';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusColors: Record<string, string> = {
  assigned: '#f5a623',
  completed: '#4caf50',
  cancelled: '#f44336',
};

interface TasksPageProps {
  type?: 'all' | 'assigned' | 'requested';
}

export default function TasksPage({ type = 'all' }: TasksPageProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    keyword: '',
    dateFrom: '',
    dateTo: '',
  });
  const [departmentFilter, setDepartmentFilter] = useState(searchParams.get('departmentId') || '');
  const [searchKey, setSearchKey] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', String(page + 1));
        params.append('limit', String(rowsPerPage));
        if (filters.status) params.append('status', filters.status);
        if (filters.keyword) params.append('keyword', filters.keyword);
        if (filters.dateFrom) params.append('startDate', filters.dateFrom);
        if (filters.dateTo) params.append('endDate', filters.dateTo);
        if (departmentFilter) {
          params.append('departmentId', departmentFilter);
          if (type !== 'all') params.append('direction', type);
        } else if (user?.departmentId) {
          params.append('departmentId', String(user.departmentId));
          if (type !== 'all') params.append('direction', type);
        }

        const res = await api.get(`/tasks?${params.toString()}`);
        setTasks(res.data.data.data || []);
        setTotal(res.data.data.total || 0);
      } catch (err) {
        console.error('Failed to load tasks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [page, rowsPerPage, type, filters.status, departmentFilter, searchKey, user?.departmentId]);

  const handleSearch = () => {
    setPage(0);
    setSearchKey(k => k + 1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('nav.tasks')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/tasks/create')}>
          {t('task.create')}
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                name="keyword"
                label={t('common.search')}
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                select
                name="status"
                label={t('task.status')}
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">{t('common.all') || 'الكل'}</MenuItem>
                {Object.entries(t('task.statuses', { returnObjects: true }) || {}).map(([key, val]) => (
                  <MenuItem key={key} value={key}>{val as string}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                name="dateFrom"
                label={t('task.dateFrom')}
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                name="dateTo"
                label={t('task.dateTo')}
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button fullWidth variant="outlined" onClick={handleSearch}>
                {t('common.search')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('task.number')}</TableCell>
                  <TableCell>{t('task.title') || 'Title'}</TableCell>
                  <TableCell>{t('task.assignedTo')}</TableCell>
                  <TableCell>{t('task.createdAt')}</TableCell>
                  <TableCell>{t('task.status')}</TableCell>
                  <TableCell>{t('task.finishedAt')}</TableCell>
                  <TableCell>{t('task.createdBy')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">{t('task.noTasks')}</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task: any) => (
                    <TableRow
                      key={task.id}
                      hover
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {task.taskNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {i18n.language === 'ar' ? task.titleAr : task.titleEn}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {i18n.language === 'ar' ? task.targetDepartment?.nameAr || task.targetDepartmentNameAr : task.targetDepartment?.nameEn || task.targetDepartmentNameEn}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {task.submittedAt ? new Date(task.submittedAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-GB') + '\n' + new Date(task.submittedAt).toLocaleTimeString(i18n.language === 'ar' ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`task.statuses.${task.status}`)}
                          size="small"
                          sx={{
                            backgroundColor: statusColors[task.status] || '#9e9e9e',
                            color: '#fff',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {task.finishedAt ? new Date(task.finishedAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-GB') + '\n' + new Date(task.finishedAt).toLocaleTimeString(i18n.language === 'ar' ? 'ar-SA' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </TableCell>
                      <TableCell>
                        {i18n.language === 'ar' ? task.createdByUser?.fullNameAr : task.createdByUser?.fullNameEn}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage=""
          />
        </Card>
      )}
    </Box>
  );
}
