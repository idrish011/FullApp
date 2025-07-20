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
  Switch,
  Grid,
  Snackbar,
  Avatar,
  Divider,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { adminAPI } from '../api/admin';
import { userFormService } from '../services/formService';
import AdminLayout from './AdminLayout';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: '',
    college_id: '',
    phone: '',
    status: 'active'
  });
  const [viewingUser, setViewingUser] = useState(null);
  const [collegeFilter, setCollegeFilter] = useState('all');

  useEffect(() => {
    loadUsers();
    loadColleges();
  }, [page, rowsPerPage, searchTerm, roleFilter, statusFilter, collegeFilter]);

  const loadColleges = async () => {
    try {
      setCollegesLoading(true);
      const response = await adminAPI.getColleges();
      console.log('Colleges response:', response);
      setColleges(response.colleges || []);
    } catch (error) {
      console.error('Failed to load colleges:', error);
      setError('Failed to load colleges. Please try again.');
    } finally {
      setCollegesLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading users...');
      const response = await adminAPI.getUsers();
      console.log('API Response:', response);
      
      let usersData = response.data?.users || response.users || [];
      console.log('Users data:', usersData);
      
      // Apply filters
      let filteredUsers = usersData;
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user =>
          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }

      if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
      }

      if (collegeFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.college_id === collegeFilter);
      }

      console.log('Filtered users:', filteredUsers);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('User loading error:', error);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: '',
      college_id: '',
      phone: '',
      status: 'active'
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      college_id: user.college_id,
      phone: user.phone,
      status: user.status
    });
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setSaving(true);
        const result = await userFormService.deleteUser(userId);
        
        if (result.success) {
          setNotification({
            open: true,
            message: result.message,
            severity: 'success'
          });
          await loadUsers(); // Reload the list
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
          message: 'Failed to delete user',
          severity: 'error'
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Add password for new users (generate a random one)
      const userData = { ...formData };
      if (!editingUser) {
        userData.password = Math.random().toString(36).slice(-8); // Generate random password
      }
      
      let result;
      if (editingUser) {
        // Update user
        result = await userFormService.updateUser(editingUser.id, userData);
      } else {
        // Create new user
        result = await userFormService.createUser(userData);
      }
      
      if (result.success) {
        setNotification({
          open: true,
          message: result.message,
          severity: 'success'
        });
        setDialogOpen(false);
        await loadUsers(); // Reload the list
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Save user error:', error);
      setError('Failed to save user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
    // Clear college_id if role is super_admin
    if (role === 'super_admin') {
      setFormData(prev => ({ ...prev, college_id: '' }));
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'error';
      case 'college_admin':
        return 'warning';
      case 'teacher':
        return 'info';
      case 'student':
        return 'success';
      case 'parent':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
  };

  const handleCloseViewUser = () => {
    setViewingUser(null);
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
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Debug Info */}
      <Alert severity="info" sx={{ mb: 2 }}>
        Debug: Users count: {users.length}, Loading: {loading.toString()}, Colleges count: {colleges.length}
      </Alert>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Search Users"
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
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="super_admin">Super Admin</MenuItem>
              <MenuItem value="college_admin">College Admin</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="parent">Parent</MenuItem>
            </Select>
          </FormControl>
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
          {/* College Filter - only for super admin */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>College</InputLabel>
            <Select
              value={collegeFilter}
              label="College"
              onChange={(e) => setCollegeFilter(e.target.value)}
            >
              <MenuItem value="all">All Colleges</MenuItem>
              {colleges.map((college) => (
                <MenuItem key={college.id} value={college.id}>{college.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>College</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.replace('_', ' ')}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.college_name || 'System'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.phone || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewUser(user)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditUser(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteUser(user.id)}
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
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
            {editingUser ? 'Edit User' : 'Add New User'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {editingUser ? 'Update user information and permissions' : 'Create a new user account'}
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
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  required
                  error={!formData.first_name && formData.first_name !== ''}
                  helperText={!formData.first_name && formData.first_name !== '' ? 'First name is required' : 'Enter user first name'}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  required
                  error={!formData.last_name && formData.last_name !== ''}
                  helperText={!formData.last_name && formData.last_name !== '' ? 'Last name is required' : 'Enter user last name'}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  error={!formData.username && formData.username !== ''}
                  helperText={!formData.username && formData.username !== '' ? 'Username is required' : 'Enter unique username'}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  error={!formData.email && formData.email !== ''}
                  helperText={!formData.email && formData.email !== '' ? 'Email is required' : 'Enter user email address'}
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  helperText="Optional phone number"
                  InputProps={{
                    sx: { borderRadius: 1 }
                  }}
                  size="medium"
                />
              </Grid>

              {/* Role & College Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3, mt: 4, color: 'primary.main', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  Role & College Assignment
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!formData.role && formData.role !== ''} size="medium">
                  <InputLabel>User Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="User Role"
                    onChange={(e) => handleRoleChange(e.target.value)}
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="super_admin">
                      <Box display="flex" alignItems="center">
                        <Chip label="Super Admin" color="error" size="small" sx={{ mr: 1 }} />
                        System Administrator
                      </Box>
                    </MenuItem>
                    <MenuItem value="college_admin">
                      <Box display="flex" alignItems="center">
                        <Chip label="College Admin" color="warning" size="small" sx={{ mr: 1 }} />
                        College Administrator
                      </Box>
                    </MenuItem>
                    <MenuItem value="teacher">
                      <Box display="flex" alignItems="center">
                        <Chip label="Teacher" color="info" size="small" sx={{ mr: 1 }} />
                        Faculty Member
                      </Box>
                    </MenuItem>
                    <MenuItem value="student">
                      <Box display="flex" alignItems="center">
                        <Chip label="Student" color="success" size="small" sx={{ mr: 1 }} />
                        Student
                      </Box>
                    </MenuItem>
                    <MenuItem value="parent">
                      <Box display="flex" alignItems="center">
                        <Chip label="Parent" color="default" size="small" sx={{ mr: 1 }} />
                        Parent/Guardian
                      </Box>
                    </MenuItem>
                  </Select>
                  {!formData.role && formData.role !== '' && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      User role is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="medium">
                  <InputLabel>College</InputLabel>
                  <Select
                    value={formData.college_id}
                    label="College"
                    onChange={(e) => setFormData({...formData, college_id: e.target.value})}
                    disabled={formData.role === 'super_admin'}
                    sx={{ borderRadius: 1 }}
                  >
                    {formData.role === 'super_admin' ? (
                      <MenuItem value="system">System (Super Admin)</MenuItem>
                    ) : (
                      colleges.map((college) => (
                        <MenuItem key={college.id} value={college.id}>
                          {college.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, ml: 1.5 }}>
                    {formData.role === 'super_admin' ? 'Super admins are system-wide' : 'Select the college for this user'}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Status Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3, mt: 4, color: 'primary.main', pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  Account Status
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!formData.status && formData.status !== ''} size="medium">
                  <InputLabel>Account Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Account Status"
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    sx={{ borderRadius: 1 }}
                  >
                    <MenuItem value="active">
                      <Box display="flex" alignItems="center">
                        <Chip label="Active" color="success" size="small" sx={{ mr: 1 }} />
                        Active Account
                      </Box>
                    </MenuItem>
                    <MenuItem value="inactive">
                      <Box display="flex" alignItems="center">
                        <Chip label="Inactive" color="error" size="small" sx={{ mr: 1 }} />
                        Inactive Account
                      </Box>
                    </MenuItem>
                  </Select>
                  {!formData.status && formData.status !== '' && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      Account status is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Information Alert */}
              <Grid size={{ xs: 12 }}>
                <Alert severity="info" sx={{ borderRadius: 1, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> {!editingUser ? 'A random password will be generated for new users. They can change it after first login.' : 'Password changes are handled separately for security.'}
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
            onClick={handleSaveUser} 
            variant="contained"
            disabled={
              saving ||
              !formData.username || 
              !formData.email || 
              !formData.first_name || 
              !formData.last_name || 
              !formData.role || 
              !formData.status ||
              (formData.role !== 'super_admin' && !formData.college_id)
            }
            sx={{ borderRadius: 1, minWidth: 120 }}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              editingUser ? 'Update User' : 'Create User'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User View Dialog */}
      <Dialog
        open={!!viewingUser}
        onClose={handleCloseViewUser}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 3 } }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 28 }} src={viewingUser?.profile_image || undefined}>
              {viewingUser && (viewingUser.first_name?.[0] || '') + (viewingUser.last_name?.[0] || '')}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {viewingUser ? `${viewingUser.first_name} ${viewingUser.last_name}` : 'User Details'}
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                {viewingUser && (
                  <Chip
                    label={viewingUser.role.replace('_', ' ')}
                    color={getRoleColor(viewingUser.role)}
                    size="small"
                    icon={<BadgeIcon fontSize="small" />}
                  />
                )}
                {viewingUser && (
                  <Chip
                    label={viewingUser.status}
                    color={getStatusColor(viewingUser.status)}
                    size="small"
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {viewingUser && (
            <Box>
              {/* Basic Info Section */}
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1, color: 'primary.main' }}>
                Basic Information
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonIcon color="action" />
                    <Typography variant="body2">Username:</Typography>
                    <Typography variant="body1" fontWeight="medium">{viewingUser.username}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <EmailIcon color="action" />
                    <Typography variant="body2">Email:</Typography>
                    <Typography variant="body1" fontWeight="medium">{viewingUser.email}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneIcon color="action" />
                    <Typography variant="body2">Phone:</Typography>
                    <Typography variant="body1" fontWeight="medium">{viewingUser.phone || 'N/A'}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BusinessIcon color="action" />
                    <Typography variant="body2">College:</Typography>
                    <Typography variant="body1" fontWeight="medium">{viewingUser.college_name || 'System'}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              {/* Account Section */}
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1, color: 'primary.main' }}>
                Account
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BadgeIcon color="action" />
                    <Typography variant="body2">Role:</Typography>
                    <Typography variant="body1" fontWeight="medium">{viewingUser.role.replace('_', ' ')}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarTodayIcon color="action" />
                    <Typography variant="body2">Created:</Typography>
                    <Typography variant="body1" fontWeight="medium">{new Date(viewingUser.created_at).toLocaleString()}</Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarTodayIcon color="action" />
                    <Typography variant="body2">Updated:</Typography>
                    <Typography variant="body1" fontWeight="medium">{new Date(viewingUser.updated_at).toLocaleString()}</Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              {/* Other Details Section */}
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1, color: 'primary.main' }}>
                Other Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2">Address:</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingUser.address || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">Date of Birth:</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingUser.date_of_birth || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2">Gender:</Typography>
                  <Typography variant="body1" fontWeight="medium">{viewingUser.gender || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={handleCloseViewUser} variant="outlined" sx={{ borderRadius: 1, minWidth: 100 }}>
            Close
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

const UserManagementPage = () => (
  <AdminLayout title="User Management" subtitle="Manage users, roles, and permissions">
    <UserManagement />
  </AdminLayout>
);

export default UserManagementPage; 