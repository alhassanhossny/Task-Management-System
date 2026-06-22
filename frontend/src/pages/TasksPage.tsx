import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusColors: Record<string, string> = {
  draft: '#9e9e9e',
  new: '#2196f3',
  assigned: '#ff9800',
  in_progress: '#1976d2',
  waiting_for_response: '#9c27b0',
  completed: '#4caf50',
  closed: '#2e7d32',
  cancelled: '#f44336',
};

export default function TasksPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    status: '',
    keyword: '',
    taskNumber: '',
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page + 1));
      params.append('limit', String(rowsPerPage));
      if (filters.status) params.append('status', filters.status);
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.taskNumber) params.append('taskNumber', filters.taskNumber);

      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.data.data || []);
      setTotal(res.data.data.total || 0);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchTasks();
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
                label={t('task.number')}
                value={filters.taskNumber}
                onChange={(e) => setFilters({ ...filters, taskNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                select
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label={t('common.search')}
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
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
                  <TableCell>{t('task.titleAr')}</TableCell>
                  <TableCell>{t('task.status')}</TableCell>
                  <TableCell>{t('task.createdBy')}</TableCell>
                  <TableCell>{t('task.dueDate')}</TableCell>
                  <TableCell>{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">{t('task.noTasks')}</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task: any) => (
                    <TableRow key={task.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {task.taskNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {i18n.language === 'ar' ? task.titleAr : task.titleEn}
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
                      <TableCell>
                        {i18n.language === 'ar' ? task.createdByUser?.fullNameAr : task.createdByUser?.fullNameEn}
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={t('task.view')}>
                          <IconButton size="small" onClick={() => navigate(`/tasks/${task.id}`)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
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
