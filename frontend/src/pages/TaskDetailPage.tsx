import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDirection } from '../hooks/useDirection';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusColors: Record<string, string> = {
  draft: '#9e9e9e', new: '#2196f3', assigned: '#ff9800',
  in_progress: '#1976d2', waiting_for_response: '#9c27b0',
  completed: '#4caf50', closed: '#2e7d32', cancelled: '#f44336',
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { arrowFlip } = useDirection();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const fetchTask = useCallback(async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data.data);
      setStatus(res.data.data.status);
    } catch {
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTask(); }, [fetchTask]);

  const handleStatusChange = async () => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      toast.success(t('common.success'));
      fetchTask();
    } catch (err: any) {
      toast.error(err.response?.data?.message?.[0] || 'Error');
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(`/tasks/${id}/comments`, { content: comment });
      setComment('');
      toast.success(t('common.success'));
      fetchTask();
    } catch {
      toast.error('Error adding comment');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append('files', f));

    try {
      await api.post(`/tasks/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(t('common.success'));
      fetchTask();
    } catch {
      toast.error('Error uploading file');
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await api.delete(`/tasks/${id}/attachments/${attachmentId}`);
      toast.success(t('common.success'));
      fetchTask();
    } catch {
      toast.error('Error deleting attachment');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!task) return <Typography>{t('common.noData')}</Typography>;

  const isRtl = i18n.language === 'ar';

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/tasks')}>
          <ArrowBackIcon sx={{ transform: arrowFlip }} />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {t('task.view')} - {task.taskNumber}
        </Typography>
        {['draft', 'new'].includes(task.status) && (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/tasks/${id}/edit`)}>
            {t('common.edit')}
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {isRtl ? task.titleAr : task.titleEn}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {isRtl ? task.descriptionAr : task.descriptionEn}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>{t('task.status')}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  select
                  size="small"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  {Object.entries(t('task.statuses', { returnObjects: true }) || {}).map(([key, val]) => (
                    <MenuItem key={key} value={key}>{val as string}</MenuItem>
                  ))}
                </TextField>
                <Button variant="contained" onClick={handleStatusChange}>
                  {t('common.save')}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>{t('task.comments')}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  maxRows={4}
                  placeholder={t('comment.placeholder')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddComment} sx={{ minWidth: 100 }}>
                  <SendIcon />
                </Button>
              </Box>

              {task.comments?.length === 0 ? (
                <Typography variant="body2" color="text.secondary">{t('comment.noComments')}</Typography>
              ) : (
                <List>
                  {task.comments
                    ?.filter((c: any) => !c.parentId)
                    .map((comment: any) => (
                      <Box key={comment.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                              {comment.user?.fullNameAr?.charAt(0) || 'U'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography variant="subtitle2">
                                  {isRtl ? comment.user?.fullNameAr : comment.user?.fullNameEn}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </Typography>
                                {comment.isEdited && (
                                  <Chip label={t('common.edit')} size="small" variant="outlined" />
                                )}
                              </Box>
                            }
                            secondary={comment.content}
                          />
                        </ListItem>
                        {comment.replies?.map((reply: any) => (
                          <ListItem key={reply.id} sx={{ pl: 6 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                                {reply.user?.fullNameAr?.charAt(0) || 'U'}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Typography variant="subtitle2">
                                    {isRtl ? reply.user?.fullNameAr : reply.user?.fullNameEn}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(reply.createdAt).toLocaleString()}
                                  </Typography>
                                </Box>
                              }
                              secondary={reply.content}
                            />
                          </ListItem>
                        ))}
                        <Divider />
                      </Box>
                    ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('common.details')}</Typography>
              <Box sx={{ '& > div': { py: 1 } }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.number')}</Typography>
                  <Typography variant="body2" fontWeight={600}>{task.taskNumber}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.status')}</Typography>
                  <Chip
                    label={t(`task.statuses.${task.status}`)}
                    size="small"
                    sx={{ backgroundColor: statusColors[task.status], color: '#fff', mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.createdBy')}</Typography>
                  <Typography variant="body2">{isRtl ? task.createdByUser?.fullNameAr : task.createdByUser?.fullNameEn}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.dueDate')}</Typography>
                  <Typography variant="body2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.createdAt')}</Typography>
                  <Typography variant="body2">{new Date(task.createdAt).toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{t('task.attachments')}</Typography>
                <Tooltip title={t('attachment.upload')}>
                  <IconButton component="label" size="small">
                    <AttachFileIcon />
                    <input type="file" hidden multiple onChange={handleFileUpload} />
                  </IconButton>
                </Tooltip>
              </Box>

              {task.attachments?.length === 0 ? (
                <Typography variant="body2" color="text.secondary">{t('attachment.noAttachments')}</Typography>
              ) : (
                <List dense>
                  {task.attachments?.map((att: any) => (
                    <ListItem key={att.id} secondaryAction={
                      <Box>
                        <Tooltip title={t('common.download')}>
                          <IconButton edge="end" size="small" href={`/api/v1/tasks/${id}/attachments/${att.id}/download`}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')}>
                          <IconButton edge="end" size="small" onClick={() => handleDeleteAttachment(att.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }>
                      <ListItemText
                        primary={att.originalName}
                        secondary={`${(att.size / 1024).toFixed(1)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
