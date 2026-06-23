import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function TaskTitlesPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ titleAr: '', titleEn: '', sortOrder: 0, isActive: true });
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchTitles = async () => {
    try {
      const res = await api.get('/task-titles');
      setTitles(res.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTitles(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ titleAr: '', titleEn: '', sortOrder: titles.length + 1, isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (title: any) => {
    setEditing(title);
    setForm({ titleAr: title.titleAr, titleEn: title.titleEn, sortOrder: title.sortOrder, isActive: title.isActive });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/task-titles/${editing.id}`, form);
      } else {
        await api.post('/task-titles', form);
      }
      toast.success(t('common.success'));
      setDialogOpen(false);
      fetchTitles();
    } catch { toast.error(t('common.error')); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/task-titles/${deleteTarget.id}`);
      toast.success(t('common.success'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchTitles();
    } catch { toast.error(t('common.error')); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('taskTitle.management')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('taskTitle.create')}
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('taskTitle.titleAr')}</TableCell>
                  <TableCell>{t('taskTitle.titleEn')}</TableCell>
                  <TableCell>{t('taskTitle.sortOrder')}</TableCell>
                  <TableCell>{t('taskTitle.isActive')}</TableCell>
                  <TableCell align="center">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {titles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">{t('taskTitle.noTitles')}</TableCell>
                  </TableRow>
                ) : titles.map((title) => (
                  <TableRow key={title.id}>
                    <TableCell>{title.titleAr}</TableCell>
                    <TableCell>{title.titleEn}</TableCell>
                    <TableCell>{title.sortOrder}</TableCell>
                    <TableCell>
                      <Chip label={title.isActive ? t('common.active') : t('common.inactive')} color={title.isActive ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => openEdit(title)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => { setDeleteTarget(title); setDeleteDialogOpen(true); }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? t('taskTitle.edit') : t('taskTitle.create')}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label={t('taskTitle.titleAr')} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} margin="normal" required />
          <TextField fullWidth label={t('taskTitle.titleEn')} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} margin="normal" required />
          <TextField fullWidth label={t('taskTitle.sortOrder')} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} margin="normal" />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2">{t('taskTitle.isActive')}</Typography>
            <Switch checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSave}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          <Typography>{t('taskTitle.confirmDelete')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
