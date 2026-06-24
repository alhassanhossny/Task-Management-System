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
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function UsersPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    fullNameAr: '', fullNameEn: '',
    roleId: '', departmentId: '', isActive: true,
  });
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [userRes, roleRes, deptRes] = await Promise.all([
        api.get('/users'),
        api.get('/roles'),
        api.get('/departments/active'),
      ]);
      setUsers(userRes.data.data || []);
      setRoles(roleRes.data.data || []);
      setDepartments(deptRes.data.data || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ username: '', email: '', password: '', fullNameAr: '', fullNameEn: '', roleId: '', departmentId: '', isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (user: any) => {
    setEditing(user);
    setForm({
      username: user.username, email: user.email, password: '',
      fullNameAr: user.fullNameAr, fullNameEn: user.fullNameEn,
      roleId: String(user.roleId), departmentId: user.departmentId ? String(user.departmentId) : '', isActive: user.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        username: form.username,
        email: form.email,
        fullNameAr: form.fullNameAr,
        fullNameEn: form.fullNameEn,
        roleId: Number(form.roleId),
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        isActive: form.isActive,
      };
      if (!editing) payload.password = form.password;

      if (editing) {
        await api.put(`/users/${editing.id}`, { ...payload, password: form.password || undefined });
      } else {
        await api.post('/users', payload);
      }
      toast.success(t('common.success'));
      setDialogOpen(false);
      fetchData();
    } catch { toast.error(t('common.error')); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      toast.success(t('common.success'));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch { toast.error(t('common.error')); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('userManagement.management')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('userManagement.create')}
        </Button>
      </Box>
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
                <TableCell>{t('taskTitle.isActive')}</TableCell>
                <TableCell align="center">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">{t('user.noUsers')}</TableCell></TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{lang === 'ar' ? user.fullNameAr : user.fullNameEn}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{lang === 'ar' ? user.roleNameAr : user.roleNameEn}</TableCell>
                    <TableCell>{lang === 'ar' ? user.departmentNameAr : user.departmentNameEn}</TableCell>
                    <TableCell>
                      <Chip label={user.isActive ? 'Active' : 'Inactive'} size="small" color={user.isActive ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => openEdit(user)}><EditIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => { setDeleteTarget(user); setDeleteDialogOpen(true); }}><DeleteIcon /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? t('userManagement.edit') : t('userManagement.create')}</DialogTitle>
        <DialogContent>
          <TextField fullWidth name="fullNameAr" label={t('user.fullNameAr')} value={form.fullNameAr} onChange={(e) => setForm({ ...form, fullNameAr: e.target.value })} margin="normal" required />
          <TextField fullWidth name="fullNameEn" label={t('user.fullNameEn')} value={form.fullNameEn} onChange={(e) => setForm({ ...form, fullNameEn: e.target.value })} margin="normal" required />
          <TextField fullWidth name="username" label={t('user.username')} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} margin="normal" required />
          <TextField fullWidth name="email" type="email" label={t('user.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} margin="normal" required />
          <TextField fullWidth name="password" type="password" label={t('user.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} margin="normal" required={!editing} />
          <TextField fullWidth name="roleId" select label={t('user.role')} value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} margin="normal" required>
            <MenuItem value="">--</MenuItem>
            {roles.map((r: any) => (
              <MenuItem key={r.id} value={r.id}>{lang === 'ar' ? r.nameAr : r.nameEn}</MenuItem>
            ))}
          </TextField>
          <TextField fullWidth name="departmentId" select label={t('user.department')} value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} margin="normal">
            <MenuItem value="">--</MenuItem>
            {departments.map((d: any) => (
              <MenuItem key={d.id} value={d.id}>{lang === 'ar' ? d.nameAr : d.nameEn}</MenuItem>
            ))}
          </TextField>
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
        <DialogContent><Typography>{t('userManagement.confirmDelete')}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
