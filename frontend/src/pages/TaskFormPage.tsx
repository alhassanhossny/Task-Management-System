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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../hooks/useDirection';
import { useAuth } from '../store/auth.context';
import { toast } from 'react-toastify';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { arrowFlip } = useDirection();
  const { user } = useAuth();
  const isEdit = !!id;
  const lang = i18n.language;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [taskTitles, setTaskTitles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [form, setForm] = useState({
    taskTitleId: '',
    descriptionAr: '',
    descriptionEn: '',
    sourceDepartmentId: '',
    targetDepartmentId: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [titleRes, deptRes] = await Promise.all([
          api.get('/task-titles/active'),
          api.get('/departments/active'),
        ]);
        setTaskTitles(titleRes.data?.data || titleRes.data || []);
        setDepartments(deptRes.data?.data || []);
      } catch { }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    if (user?.departmentId) {
      setForm((f) => ({ ...f, sourceDepartmentId: String(user.departmentId!) }));
    }
  }, [user]);

  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        try {
          const res = await api.get(`/tasks/${id}`);
          const task = res.data.data;
          setForm({
            taskTitleId: task.taskTitleId ? String(task.taskTitleId) : '',
            descriptionAr: task.descriptionAr || '',
            descriptionEn: task.descriptionEn || '',
            sourceDepartmentId: task.sourceDepartmentId ? String(task.sourceDepartmentId) : '',
            targetDepartmentId: task.targetDepartmentId ? String(task.targetDepartmentId) : '',
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
      taskTitleId: Number(form.taskTitleId),
      descriptionAr: form.descriptionAr || undefined,
      descriptionEn: form.descriptionEn || undefined,
      sourceDepartmentId: form.sourceDepartmentId ? Number(form.sourceDepartmentId) : undefined,
      targetDepartmentId: form.targetDepartmentId ? Number(form.targetDepartmentId) : undefined,
    };

    try {
      let taskId: string;
      if (isEdit) {
        await api.put(`/tasks/${id}`, payload);
        taskId = id!;
        toast.success(t('common.success'));
      } else {
        const res = await api.post('/tasks', payload);
        taskId = res.data.data?.id || res.data.id;
        toast.success(t('common.success'));

        if (files?.length) {
          const formData = new FormData();
          Array.from(files).forEach(f => formData.append('files', f));
          try {
            await api.post(`/tasks/${taskId}/attachments`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          } catch { }
        }
      }
      navigate(`/tasks/${taskId}`);
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
          <ArrowBackIcon sx={{ transform: arrowFlip }} />
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
                  select
                  label={lang === 'ar' ? t('task.titleAr') : t('task.titleEn')}
                  name="taskTitleId"
                  value={form.taskTitleId}
                  onChange={handleChange}
                >
                  <MenuItem value="">--</MenuItem>
                  {taskTitles.map((tt: any) => (
                    <MenuItem key={tt.id} value={tt.id}>
                      {lang === 'ar' ? tt.titleAr : tt.titleEn}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={lang === 'ar' ? t('task.descriptionAr') : t('task.descriptionEn')}
                  name="descriptionAr"
                  value={form.descriptionAr}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button variant="outlined" component="label" startIcon={<AttachFileIcon />}>
                    {t('attachment.upload')}
                    <input type="file" hidden multiple onChange={(e) => setFiles(e.target.files)} />
                  </Button>
                  {files?.length ? (
                    <Typography variant="body2" color="text.secondary">
                      {files.length} {t('attachment.files') || 'files'} selected
                    </Typography>
                  ) : null}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('task.sourceDepartment')}
                  value={user?.departmentId
                    ? (lang === 'ar' ? user.departmentNameAr : user.departmentNameEn)
                    : '--'}
                  InputProps={{ readOnly: true }}
                  disabled
                />
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
                  {departments
                    .filter((d) => d.id !== user?.departmentId)
                    .map((dept: any) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {lang === 'ar' ? dept.nameAr : dept.nameEn}
                      </MenuItem>
                    ))}
                </TextField>
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
