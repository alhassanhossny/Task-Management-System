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
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AuditPage() {
  const { t, i18n } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(50);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/audit?page=${page + 1}&limit=${rowsPerPage}`);
        setLogs(res.data.data.data || []);
        setTotal(res.data.data.total || 0);
      } catch { }
      finally { setLoading(false); }
    };
    fetch();
  }, [page, rowsPerPage]);

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('audit.title')}</Typography>
      <Card>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('audit.actionType')}</TableCell>
                <TableCell>{t('audit.entity')}</TableCell>
                <TableCell>{t('audit.entityId')}</TableCell>
                <TableCell>{t('audit.user')}</TableCell>
                <TableCell>{t('audit.ipAddress')}</TableCell>
                <TableCell>{t('audit.timestamp')}</TableCell>
                <TableCell>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log: any) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Chip label={log.actionType} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {log.entityId?.substring(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {log.user ? (i18n.language === 'ar' ? log.user.fullNameAr : log.user.fullNameEn) : '-'}
                  </TableCell>
                  <TableCell>{log.ipAddress || '-'}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Tooltip title={t('common.view')}>
                      <IconButton size="small" onClick={() => setSelectedLog(log)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Card>

      <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)} maxWidth="md" fullWidth>
        <DialogTitle>{t('audit.title')}</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ '& > div': { mb: 2 } }}>
              <Typography variant="body2"><strong>{t('audit.actionType')}:</strong> {selectedLog.actionType}</Typography>
              <Typography variant="body2"><strong>{t('audit.entity')}:</strong> {selectedLog.entity}</Typography>
              <Typography variant="body2"><strong>{t('audit.entityId')}:</strong> {selectedLog.entityId}</Typography>
              <Typography variant="body2"><strong>{t('audit.user')}:</strong> {selectedLog.user ? (i18n.language === 'ar' ? selectedLog.user.fullNameAr : selectedLog.user.fullNameEn) : '-'}</Typography>
              <Typography variant="body2"><strong>{t('audit.ipAddress')}:</strong> {selectedLog.ipAddress || '-'}</Typography>
              <Typography variant="body2"><strong>{t('audit.timestamp')}:</strong> {new Date(selectedLog.createdAt).toLocaleString()}</Typography>
              {selectedLog.oldValue && (
                <Box>
                  <Typography variant="body2"><strong>{t('audit.oldValue')}:</strong></Typography>
                  <Box component="pre" sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1, fontSize: 12, overflow: 'auto' }}>
                    {JSON.stringify(selectedLog.oldValue, null, 2)}
                  </Box>
                </Box>
              )}
              {selectedLog.newValue && (
                <Box>
                  <Typography variant="body2"><strong>{t('audit.newValue')}:</strong></Typography>
                  <Box component="pre" sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1, fontSize: 12, overflow: 'auto' }}>
                    {JSON.stringify(selectedLog.newValue, null, 2)}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLog(null)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
