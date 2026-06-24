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
import FormControlLabel from '@mui/material/FormControlLabel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DepartmentsPage() {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ nameAr: '', nameEn: '', code: '', isActive: true });
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetch = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nameAr: '', nameEn: '', code: '', isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (dept: any) => {
    setEditing(dept);
    setForm({ nameAr: dept.nameAr, nameEn: dept.nameEn, code: dept.code, isActive: dept.isActive });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/departments/${editing.id}`, form);
      } else {
        await api.post('/departments', form);
      }
      toast.success(t('common.success'));
      setDialogOpen(false);
      fetch();
    } catch { toast.error(t('common.error')); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/departments/${deleteTarget.id}`);
      toast.success(t('common.success'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetch();
    } catch { toast.error(t('common.error')); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('department.management')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('department.create')}
        </Button>
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('department.nameAr')}</TableCell>
                <TableCell>{t('department.nameEn')}</TableCell>
                <TableCell>{t('department.code')}</TableCell>
                <TableCell>{t('taskTitle.isActive')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((dept: any) => (
                <TableRow key={dept.id} hover>
                  <TableCell>{dept.nameAr}</TableCell>
                  <TableCell>{dept.nameEn}</TableCell>
                  <TableCell><Chip label={dept.code} size="small" variant="outlined" /></TableCell>
                  <TableCell>
                    <Chip label={dept.isActive ? 'Active' : 'Inactive'} size="small" color={dept.isActive ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small" onClick={() => openEdit(dept)}><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error" onClick={() => { setDeleteTarget(dept); setDeleteDialogOpen(true); }}><DeleteIcon /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? t('department.edit') : t('department.create')}</DialogTitle>
        <DialogContent>
          <TextField fullWidth name="nameAr" label={t('department.nameAr')} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} margin="normal" required />
          <TextField fullWidth name="nameEn" label={t('department.nameEn')} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} margin="normal" required />
          <TextField fullWidth name="code" label={t('department.code')} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} margin="normal" required />
          <FormControlLabel
            control={<Switch checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />}
            label={t('taskTitle.isActive')}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSave}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent><Typography>{t('department.confirmDelete')}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
