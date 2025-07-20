import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { adminAPI } from '../api/admin';
import { collegeFormService } from '../services/formService';
import AdminLayout from './AdminLayout';

const CollegeManagement = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    subscription_plan: 'basic',
    subscription_status: 'active',
    max_users: 100,
    description: ''
  });

  useEffect(() => {
    loadColleges();
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  const loadColleges = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading colleges...');
      const response = await adminAPI.getColleges();
      console.log('API Response:', response);
      
      let collegesData = response.colleges || [];
      console.log('Colleges data:', collegesData);
      
      // Apply filters
      let filteredColleges = collegesData;
      
      if (searchTerm) {
        filteredColleges = filteredColleges.filter(college =>
          college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          college.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        filteredColleges = filteredColleges.filter(college => college.subscription_status === statusFilter);
      }

      console.log('Filtered colleges:', filteredColleges);
      setColleges(filteredColleges);
    } catch (error) {
      console.error('College loading error:', error);
      setError('Failed to load colleges. Please try again.');
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollege = () => {
    setEditingCollege(null);
    setFormData({
      name: '',
      domain: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      subscription_plan: 'basic',
      subscription_status: 'active',
      max_users: 100,
      description: ''
    });
    setDialogOpen(true);
  };

  const handleEditCollege = (college) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      domain: college.domain,
      contact_email: college.contact_email,
      contact_phone: college.contact_phone,
      address: college.address,
      subscription_plan: college.subscription_plan,
      subscription_status: college.subscription_status,
      max_users: college.max_users,
      description: college.description
    });
    setDialogOpen(true);
  };

  const handleDeleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        setSaving(true);
        const result = await collegeFormService.deleteCollege(collegeId);
        
        if (result.success) {
          setNotification({
            open: true,
            message: result.message,
            severity: 'success'
          });
          await loadColleges(); // Reload the list
        } else {
          setNotification({
            open: true,
            message: result.message,
            severity: 'error'
          });
        }
      } catch (error) {
        setNotification({
          open: true,
          message: 'Failed to delete college',
          severity: 'error'
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSaveCollege = async () => {
    try {
      setSaving(true);
      setError('');
      
      let result;
      if (editingCollege) {
        // Update college
        result = await collegeFormService.updateCollege(editingCollege.id, formData);
      } else {
        // Create new college
        result = await collegeFormService.createCollege(formData);
      }
      
      if (result.success) {
        setNotification({
          open: true,
          message: result.message,
          severity: 'success'
        });
        setDialogOpen(false);
        await loadColleges(); // Reload the list
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Save college error:', error);
      setError('Failed to save college. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'enterprise':
        return 'error';
      case 'premium':
        return 'warning';
      case 'basic':
        return 'info';
      default:
        return 'default';
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">College Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCollege}
        >
          Add College
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Debug Info */}
      <Alert severity="info" sx={{ mb: 2 }}>
        Debug: Colleges count: {colleges.length}, Loading: {loading.toString()}
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Colleges
                  </Typography>
                  <Typography variant="h4">
                    {colleges.length}
                  </Typography>
                </Box>
                <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Subscriptions
                  </Typography>
                  <Typography variant="h4">
                    {colleges.filter(c => c.subscription_status === 'active').length}
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {colleges.reduce((sum, college) => sum + (college.current_users || 0), 0)}
                  </Typography>
                </Box>
                <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(colleges.reduce((sum, college) => sum + (college.revenue || 0), 0))}
                  </Typography>
                </Box>
                <MoneyIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Search Colleges"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Colleges Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>College</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colleges
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((college) => (
                <TableRow key={college.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <SchoolIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {college.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {college.contact_email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{college.domain}</TableCell>
                  <TableCell>
                    <Chip
                      label={college.subscription_plan}
                      color={getPlanColor(college.subscription_plan)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={college.subscription_status}
                      color={getStatusColor(college.subscription_status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {college.current_users || 0}/{college.max_users}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(college.revenue || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(college.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditCollege(college)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteCollege(college.id)}
                        color="error"
                        disabled={saving}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={colleges.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Add/Edit College Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" component="div">
            {editingCollege ? 'Edit College' : 'Add New College'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {editingCollege ? 'Update college information and settings' : 'Create a new college institution'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Box component="form" noValidate>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3, color: 'primary.main', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="College/Institution Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  error={!formData.name && formData.name !== ''}
                  helperText={!formData.name && formData.name !== '' ? 'College name is required' : 'Enter the full name of the institution'}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  required
                  error={!formData.domain && formData.domain !== ''}
                  helperText={!formData.domain && formData.domain !== '' ? 'Domain is required' : 'e.g., university.edu'}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  required
                  error={!formData.contact_email && formData.contact_email !== ''}
                  helperText={!formData.contact_email && formData.contact_email !== '' ? 'Contact email is required' : 'Primary contact email'}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                  helperText="Optional contact phone number"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Maximum Users"
                  type="number"
                  value={formData.max_users}
                  onChange={(e) => setFormData({...formData, max_users: parseInt(e.target.value) || 0})}
                  required
                  error={formData.max_users <= 0}
                  helperText={formData.max_users <= 0 ? 'Maximum users must be greater than 0' : 'Maximum number of users allowed'}
                  InputProps={{
                    sx: { borderRadius: 1 },
                    inputProps: { min: 1, max: 10000 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  helperText="Physical address of the institution"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>

              {/* Subscription & Status Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3, mt: 4, color: 'primary.main', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  Subscription & Status
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <FormControl fullWidth required error={!formData.subscription_plan && formData.subscription_plan !== ''} size="medium">
                  <InputLabel>Subscription Plan</InputLabel>
                  <Select
                    value={formData.subscription_plan}
                    label="Subscription Plan"
                    onChange={(e) => setFormData({...formData, subscription_plan: e.target.value})}
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="basic">
                      <Box display="flex" alignItems="center">
                        <Chip label="Basic" color="default" size="small" sx={{ mr: 1 }} />
                        Basic Plan - Up to 200 users
                      </Box>
                    </MenuItem>
                    <MenuItem value="premium">
                      <Box display="flex" alignItems="center">
                        <Chip label="Premium" color="primary" size="small" sx={{ mr: 1 }} />
                        Premium Plan - Up to 500 users
                      </Box>
                    </MenuItem>
                    <MenuItem value="enterprise">
                      <Box display="flex" alignItems="center">
                        <Chip label="Enterprise" color="secondary" size="small" sx={{ mr: 1 }} />
                        Enterprise Plan - Up to 1000+ users
                      </Box>
                    </MenuItem>
                  </Select>
                  {!formData.subscription_plan && formData.subscription_plan !== '' && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      Subscription plan is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <FormControl fullWidth required error={!formData.subscription_status && formData.subscription_status !== ''} size="medium">
                  <InputLabel>Subscription Status</InputLabel>
                  <Select
                    value={formData.subscription_status}
                    label="Subscription Status"
                    onChange={(e) => setFormData({...formData, subscription_status: e.target.value})}
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="active">
                      <Box display="flex" alignItems="center">
                        <Chip label="Active" color="success" size="small" sx={{ mr: 1 }} />
                        Active Subscription
                      </Box>
                    </MenuItem>
                    <MenuItem value="inactive">
                      <Box display="flex" alignItems="center">
                        <Chip label="Inactive" color="error" size="small" sx={{ mr: 1 }} />
                        Inactive Subscription
                      </Box>
                    </MenuItem>
                  </Select>
                  {!formData.subscription_status && formData.subscription_status !== '' && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      Subscription status is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Additional Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3, mt: 4, color: 'primary.main', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  Additional Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  helperText="Brief description of the institution (optional)"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>

              {/* Plan Information Alert */}
              <Grid size={{ xs: 12 }}>
                <Alert severity="info" sx={{ borderRadius: 1, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Plan Limits:</strong> Basic (200 users), Premium (500 users), Enterprise (1000+ users)
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            disabled={saving}
            sx={{ borderRadius: 1, minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCollege} 
            variant="contained"
            disabled={
              saving ||
              !formData.name || 
              !formData.domain || 
              !formData.contact_email || 
              !formData.subscription_plan || 
              !formData.subscription_status ||
              formData.max_users <= 0
            }
            sx={{ borderRadius: 1, minWidth: 120 }}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              editingCollege ? 'Update College' : 'Create College'
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
  );
};

const CollegeManagementPage = () => (
  <AdminLayout title="College Management" subtitle="Manage colleges and institutions">
    <CollegeManagement />
  </AdminLayout>
);

export default CollegeManagementPage; 