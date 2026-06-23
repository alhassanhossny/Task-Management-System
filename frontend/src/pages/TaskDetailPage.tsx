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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDirection } from '../hooks/useDirection';
import { useAuth } from '../store/auth.context';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusColors: Record<string, string> = {
  assigned: '#2196f3',
  completed: '#4caf50',
  cancelled: '#f44336',
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { arrowFlip } = useDirection();
  const { user } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  const fetchTask = useCallback(async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data.data);
    } catch {
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTask(); }, [fetchTask]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.put(`/tasks/${id}/status`, { status: newStatus });
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
  const canChangeStatus = (user?.departmentId === task.targetDepartmentId || user?.permissions?.includes('*'))
    && task.status === 'assigned';
  const isCreator = user?.id === task.createdBy;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/tasks')}>
          <ArrowBackIcon sx={{ transform: arrowFlip }} />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {t('task.view')} - {task.taskNumber}
        </Typography>
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

              {canChangeStatus && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>{t('task.status')}</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleStatusChange('completed')}
                    >
                      {t('task.setCompleted')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleStatusChange('cancelled')}
                    >
                      {t('task.setCancelled')}
                    </Button>
                  </Box>
                </>
              )}

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
                    sx={{ backgroundColor: statusColors[task.status] || '#9e9e9e', color: '#fff', mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.sourceDepartment')}</Typography>
                  <Typography variant="body2">
                    {isRtl ? task.sourceDepartment?.nameAr : task.sourceDepartment?.nameEn}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.targetDepartment')}</Typography>
                  <Typography variant="body2">
                    {isRtl ? task.targetDepartment?.nameAr : task.targetDepartment?.nameEn}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.createdBy')}</Typography>
                  <Typography variant="body2">
                    {isRtl ? task.createdByUser?.fullNameAr : task.createdByUser?.fullNameEn}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('task.createdAt')}</Typography>
                  <Typography variant="body2">
                    {task.createdAt ? new Date(task.createdAt).toLocaleString() : '--'}
                  </Typography>
                </Box>
                {task.submittedAt && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t('task.submittedAt')}</Typography>
                    <Typography variant="body2">
                      {new Date(task.submittedAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
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