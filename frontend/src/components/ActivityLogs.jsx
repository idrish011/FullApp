import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../api/auth';
import AdminLayout from './AdminLayout';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    user_id: '',
    user_role: '',
    action: '',
    entity: '',
    start_date: '',
    end_date: '',
    search: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    users: [],
    roles: [],
    actions: [],
    entities: []
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      };

      console.log('Fetching logs with params:', params);
      console.log('Auth token:', localStorage.getItem('authToken'));
      console.log('User:', localStorage.getItem('user'));
      
      const response = await api.get('/admin/logs', { params });
      console.log('Response received:', response.data);
      
      if (!response.data.pagination) {
        console.error('No pagination in response:', response.data);
        throw new Error('Invalid response structure');
      }
      
      setLogs(response.data.logs);
      setTotal(response.data.pagination.total);
      setFilterOptions(response.data.filters);
      setError('');
    } catch (error) {
      console.error('Error fetching logs:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      console.error('Full error object:', error);
      setError('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      user_id: '',
      user_role: '',
      action: '',
      entity: '',
      start_date: '',
      end_date: '',
      search: ''
    });
    setPage(0);
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setViewDialogOpen(true);
  };

  const handleExportLogs = async () => {
    try {
      const params = {
        start_date: filters.start_date,
        end_date: filters.end_date,
        format: 'csv'
      };

      const response = await api.get('/admin/logs/export', {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting logs:', error);
      setError('Failed to export logs');
    }
  };

  const getActionColor = (action) => {
    const actionColors = {
      'LOGIN': 'success',
      'LOGOUT': 'info',
      'CREATE_USER': 'primary',
      'UPDATE_USER': 'warning',
      'DELETE_USER': 'error',
      'CREATE_COLLEGE': 'primary',
      'UPDATE_COLLEGE': 'warning',
      'DELETE_COLLEGE': 'error',
      'CREATE_COURSE': 'primary',
      'UPDATE_COURSE': 'warning',
      'DELETE_COURSE': 'error',
      'DASHBOARD_ACCESS': 'info',
      'GENERATE_REPORT': 'secondary',
      'CHANGE_PASSWORD': 'warning'
    };
    return actionColors[action] || 'default';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>User Role</InputLabel>
              <Select
                value={filters.user_role}
                onChange={(e) => handleFilterChange('user_role', e.target.value)}
                label="User Role"
              >
                <MenuItem value="">All Roles</MenuItem>
                {filterOptions.roles.map((role) => (
                  <MenuItem key={role.user_role} value={role.user_role}>
                    {role.user_role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                label="Action"
              >
                <MenuItem value="">All Actions</MenuItem>
                {filterOptions.actions.map((action) => (
                  <MenuItem key={action.action} value={action.action}>
                    {action.action}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Entity</InputLabel>
              <Select
                value={filters.entity}
                onChange={(e) => handleFilterChange('entity', e.target.value)}
                label="Entity"
              >
                <MenuItem value="">All Entities</MenuItem>
                {filterOptions.entities.map((entity) => (
                  <MenuItem key={entity.entity} value={entity.entity}>
                    {entity.entity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleClearFilters}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportLogs}
              fullWidth
            >
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Logs Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Timestamp</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Entity</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>IP Address</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No activity logs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {formatTimestamp(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {log.user_email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.user_role}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        size="small"
                        color={getActionColor(log.action)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.entity || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {log.ip_address}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewLog(log)}
                        >
                          <ViewIcon />
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
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Log Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Activity Log Details
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Timestamp
                  </Typography>
                  <Typography variant="body1">
                    {formatTimestamp(selectedLog.timestamp)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    User Email
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.user_email}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    User Role
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.user_role}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Action
                  </Typography>
                  <Chip
                    label={selectedLog.action}
                    color={getActionColor(selectedLog.action)}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Entity
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.entity || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Entity ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.entity_id || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    IP Address
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.ip_address}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    College ID
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.college_id || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Details
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    backgroundColor: 'grey.100', 
                    p: 2, 
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}>
                    {selectedLog.details}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ActivityLogsPage = () => (
  <AdminLayout title="Activity Logs" subtitle="View and audit system activity logs">
    <ActivityLogs />
  </AdminLayout>
);

export default ActivityLogsPage; 