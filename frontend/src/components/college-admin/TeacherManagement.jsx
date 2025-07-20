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
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';
import { collegeAdminAPI } from '../../api/collegeAdmin';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    status: 'active',
    username: '',
    password: 'defaultPassword123!',
    role: 'teacher',
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadTeachers();
  }, [page, rowsPerPage, searchTerm, filterStatus]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterStatus,
      };

      const response = await collegeAdminAPI.getTeachers(params);
      setTeachers(response.teachers || response.users || []);
    } catch (error) {
      console.error('Failed to load teachers:', error);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.first_name?.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name?.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Prepare user data with required fields
      const userData = {
        username: formData.username || formData.email, // Use provided username or email
        email: formData.email.trim(),
        password: formData.password || 'defaultPassword123!',
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: 'teacher',
        phone: formData.phone || '',
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || '',
        address: formData.address || '',
        status: formData.status || 'active',
      };

      if (editingTeacher) {
        await collegeAdminAPI.updateTeacher(editingTeacher.id, userData);
        setSuccess('Teacher updated successfully!');
      } else {
        await collegeAdminAPI.createTeacher(userData);
        setSuccess('Teacher created successfully!');
      }

      setOpenDialog(false);
      setEditingTeacher(null);
      resetForm();
      setFormErrors({});
      loadTeachers();
    } catch (error) {
      console.error('Failed to save teacher:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save teacher. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      await collegeAdminAPI.deleteTeacher(deletingTeacher.id);
      setSuccess('Teacher deleted successfully!');
      setOpenDeleteDialog(false);
      setDeletingTeacher(null);
      loadTeachers();
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      setError('Failed to delete teacher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      username: teacher.username || teacher.email,
      password: 'defaultPassword123!', // Don't show actual password
      role: 'teacher',
      phone: teacher.phone,
      date_of_birth: teacher.date_of_birth,
      gender: teacher.gender,
      address: teacher.address,
      status: teacher.status,
    });
    setOpenDialog(true);
  };

  const handleView = async (teacher) => {
    try {
      const response = await collegeAdminAPI.getTeacherDetails(teacher.id);
      setViewingTeacher(response.user);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Failed to load teacher details:', error);
      setError('Failed to load teacher details.');
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      address: '',
      status: 'active',
      username: '',
      password: 'defaultPassword123!',
      role: 'teacher',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on_leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? 'primary' : 'secondary';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Teacher Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'secondary.main' }}>
          Search & Filters
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Search Teachers"
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">
                  <Chip label="Active" color="success" size="small" />
                </MenuItem>
                <MenuItem value="inactive">
                  <Chip label="Inactive" color="error" size="small" />
                </MenuItem>
                <MenuItem value="on_leave">
                  <Chip label="On Leave" color="warning" size="small" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingTeacher(null);
                resetForm();
                setOpenDialog(true);
              }}
              sx={{ 
                height: 56,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Add Teacher
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Teachers Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Teacher</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Created Date</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No teachers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                          {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {teacher.first_name} {teacher.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {teacher.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={teacher.status}
                        color={getStatusColor(teacher.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(teacher)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Teacher">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(teacher)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Teacher">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDeletingTeacher(teacher);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon />
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
          count={teachers.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add/Edit Teacher Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon color="secondary" />
            <Typography variant="h6">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* Personal Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'secondary.main',
                  borderBottom: '2px solid',
                  borderColor: 'secondary.main',
                  pb: 0.5,
                  mb: 2
                }}>
                  Personal Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  variant="outlined"
                  size="medium"
                  error={!!formErrors.first_name}
                  helperText={formErrors.first_name || "Enter teacher's first name"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  variant="outlined"
                  size="medium"
                  error={!!formErrors.last_name}
                  helperText={formErrors.last_name || "Enter teacher's last name"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  variant="outlined"
                  size="medium"
                  error={!!formErrors.email}
                  helperText={formErrors.email || "Enter valid email address"}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  variant="outlined"
                  size="medium"
                  helperText="Leave empty to use email as username"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  variant="outlined"
                  size="medium"
                  helperText="Enter contact number"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="medium"
                  helperText="Select date of birth"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  variant="outlined"
                  size="medium"
                  helperText="Enter complete address"
                />
              </Grid>

              {/* Professional Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'secondary.main',
                  borderBottom: '2px solid',
                  borderColor: 'secondary.main',
                  pb: 0.5,
                  mb: 2,
                  mt: 2
                }}>
                  Professional Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }} >
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="active">
                      <Chip label="Active" color="success" size="small" />
                    </MenuItem>
                    <MenuItem value="inactive">
                      <Chip label="Inactive" color="error" size="small" />
                    </MenuItem>
                    <MenuItem value="on_leave">
                      <Chip label="On Leave" color="warning" size="small" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              size="large"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              size="large"
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Teacher Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Teacher Details</DialogTitle>
        <DialogContent>
          {viewingTeacher && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, width: 64, height: 64, bgcolor: 'secondary.main' }}>
                    {viewingTeacher.first_name?.[0]}{viewingTeacher.last_name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {viewingTeacher.first_name} {viewingTeacher.last_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Teacher ID: {viewingTeacher.id}
                    </Typography>
                    <Chip
                      label={viewingTeacher.status}
                      color={getStatusColor(viewingTeacher.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }} >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <EmailIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Email"
                          secondary={viewingTeacher.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <PhoneIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Phone"
                          secondary={viewingTeacher.phone || 'Not provided'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <CalendarIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Date of Birth"
                          secondary={viewingTeacher.date_of_birth ? 
                            new Date(viewingTeacher.date_of_birth).toLocaleDateString() : 'Not provided'
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <PersonIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Gender"
                          secondary={
                            <Chip
                              label={viewingTeacher.gender}
                              color={getGenderColor(viewingTeacher.gender)}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }} >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Professional Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <CalendarIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Created Date"
                          secondary={viewingTeacher.created_at ? 
                            new Date(viewingTeacher.created_at).toLocaleDateString() : 'Not available'
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <LocationIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Address"
                          secondary={viewingTeacher.address || 'Not provided'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deletingTeacher?.first_name} {deletingTeacher?.last_name}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherManagement; 