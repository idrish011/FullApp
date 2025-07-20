import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  TextField,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  School as SchoolIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import AdminLayout from './AdminLayout';
import api from '../api/auth';

const LandingPageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading colleges for landing page management...');
      const response = await api.get('/colleges');
      console.log('API Response:', response);
      
      let collegesData = response.data.colleges || response.data || [];
      console.log('Colleges data:', collegesData);
      
      // Sort by landing_order, then by name
      collegesData.sort((a, b) => {
        if (a.landing_order !== b.landing_order) {
          return (a.landing_order || 0) - (b.landing_order || 0);
        }
        return a.name.localeCompare(b.name);
      });
      
      setColleges(collegesData);
    } catch (error) {
      console.error('College loading error:', error);
      setError('Failed to load colleges. Please try again.');
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLanding = async (collegeId, showOnLanding) => {
    try {
      setSaving(true);
      console.log('Toggling landing for college:', collegeId, 'showOnLanding:', showOnLanding);
      
      // Debug: Check auth token
      const authToken = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!authToken);
      if (authToken) {
        try {
          const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
          console.log('Token payload:', tokenPayload);
        } catch (e) {
          console.log('Could not decode token');
        }
      }
      
      const response = await api.patch(`/colleges/${collegeId}/landing`, {
        show_on_landing: showOnLanding,
        landing_order: colleges.find(c => c.id === collegeId)?.landing_order || 0
      });
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      setNotification({
        open: true,
        message: `College ${showOnLanding ? 'added to' : 'removed from'} landing page`,
        severity: 'success'
      });
      await loadColleges(); // Reload to get updated data
    } catch (error) {
      console.error('Toggle landing error:', error);
      setNotification({
        open: true,
        message: 'Failed to update landing page status',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOrder = async (collegeId, newOrder) => {
    try {
      setSaving(true);
      const response = await api.patch(`/colleges/${collegeId}/landing`, {
        show_on_landing: colleges.find(c => c.id === collegeId)?.show_on_landing || false,
        landing_order: newOrder
      });

      console.log('Response data:', response.data);
      
      setNotification({
        open: true,
        message: 'Landing order updated successfully',
        severity: 'success'
      });
      await loadColleges(); // Reload to get updated data
    } catch (error) {
      console.error('Update order error:', error);
      setNotification({
        open: true,
        message: 'Failed to update landing order',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'premium': return 'success';
      case 'basic': return 'primary';
      case 'enterprise': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout title="Landing Page Colleges" subtitle="Manage which colleges appear on the landing page">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Landing Page Colleges" subtitle="Manage which colleges appear on the landing page and their display order">
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      Total Colleges
                    </Typography>
                    <Typography variant="h4">
                      {colleges.length}
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      On Landing Page
                    </Typography>
                    <Typography variant="h4">
                      {colleges.filter(c => c.show_on_landing).length}
                    </Typography>
                  </Box>
                  <ViewIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      Active Colleges
                    </Typography>
                    <Typography variant="h4">
                      {colleges.filter(c => c.subscription_status === 'active').length}
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      Premium Colleges
                    </Typography>
                    <Typography variant="h4">
                      {colleges.filter(c => c.subscription_plan === 'premium').length}
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Colleges Table */}
        <Paper 
          elevation={0} 
          sx={{ 
            background: (theme) => theme.palette.card.background,
            border: (theme) => theme.palette.card.border,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>College Name</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Landing Order</TableCell>
                  <TableCell>Show on Landing</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {colleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <SchoolIcon sx={{ fontSize: 24, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {college.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {college.contact_email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {college.domain || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={college.subscription_status}
                        color={getStatusColor(college.subscription_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={college.subscription_plan}
                        color={getPlanColor(college.subscription_plan)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {editingCollege?.id === college.id ? (
                        <TextField
                          type="number"
                          size="small"
                          value={editingCollege.landing_order || 0}
                          onChange={(e) => setEditingCollege({
                            ...editingCollege,
                            landing_order: parseInt(e.target.value) || 0
                          })}
                          sx={{ width: 80 }}
                        />
                      ) : (
                        <Typography variant="body2">
                          {college.landing_order || 0}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={college.show_on_landing || false}
                        onChange={(e) => handleToggleLanding(college.id, e.target.checked)}
                        disabled={saving}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {editingCollege?.id === college.id ? (
                          <>
                            <Tooltip title="Save">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  handleUpdateOrder(college.id, editingCollege.landing_order);
                                  setEditingCollege(null);
                                }}
                                disabled={saving}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setEditingCollege(null)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Edit Order">
                            <IconButton
                              size="small"
                              onClick={() => setEditingCollege(college)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

const LandingPageCollegesPage = () => (
  <LandingPageColleges />
);

export default LandingPageCollegesPage; 