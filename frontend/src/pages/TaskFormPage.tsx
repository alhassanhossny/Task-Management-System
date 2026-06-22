import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    sourceDepartmentId: '',
    targetDepartmentId: '',
    assignedTo: '',
    assignedToDepartmentId: '',
    dueDate: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptRes, userRes] = await Promise.all([
          api.get('/departments/active'),
          api.get('/users'),
        ]);
        setDepartments(deptRes.data.data || []);
        setUsers(userRes.data.data || []);
      } catch { }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        try {
          const res = await api.get(`/tasks/${id}`);
          const task = res.data.data;
          setForm({
            titleAr: task.titleAr || '',
            titleEn: task.titleEn || '',
            descriptionAr: task.descriptionAr || '',
            descriptionEn: task.descriptionEn || '',
            sourceDepartmentId: task.sourceDepartmentId || '',
            targetDepartmentId: task.targetDepartmentId || '',
            assignedTo: task.assignedTo || '',
            assignedToDepartmentId: task.assignedToDepartmentId || '',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          });
        } catch {
          toast.error('Failed to load task');
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      sourceDepartmentId: form.sourceDepartmentId ? Number(form.sourceDepartmentId) : null,
      targetDepartmentId: form.targetDepartmentId ? Number(form.targetDepartmentId) : null,
      assignedToDepartmentId: form.assignedToDepartmentId ? Number(form.assignedToDepartmentId) : null,
    };

    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, payload);
        toast.success(t('common.success'));
        navigate(`/tasks/${id}`);
      } else {
        const res = await api.post('/tasks', payload);
        toast.success(t('common.success'));
        navigate(`/tasks/${res.data.data.id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message?.[0] || 'Error saving task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{isEdit ? t('task.edit') : t('task.create')}</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={t('task.titleAr')}
                  name="titleAr"
                  value={form.titleAr}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={t('task.titleEn')}
                  name="titleEn"
                  value={form.titleEn}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('task.descriptionAr')}
                  name="descriptionAr"
                  value={form.descriptionAr}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('task.descriptionEn')}
                  name="descriptionEn"
                  value={form.descriptionEn}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('task.sourceDepartment')}
                  name="sourceDepartmentId"
                  value={form.sourceDepartmentId}
                  onChange={handleChange}
                >
                  <MenuItem value="">--</MenuItem>
                  {departments.map((dept: any) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.nameAr} - {dept.nameEn}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('task.targetDepartment')}
                  name="targetDepartmentId"
                  value={form.targetDepartmentId}
                  onChange={handleChange}
                >
                  <MenuItem value="">--</MenuItem>
                  {departments.map((dept: any) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.nameAr} - {dept.nameEn}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('task.assignedTo')}
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                >
                  <MenuItem value="">--</MenuItem>
                  {users.map((u: any) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.fullNameAr} - {u.fullNameEn}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t('task.assignedToDepartment')}
                  name="assignedToDepartmentId"
                  value={form.assignedToDepartmentId}
                  onChange={handleChange}
                >
                  <MenuItem value="">--</MenuItem>
                  {departments.map((dept: any) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.nameAr} - {dept.nameEn}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('task.dueDate')}
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => navigate(-1)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? t('common.loading') : t('common.save')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
