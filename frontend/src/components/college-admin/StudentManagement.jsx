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
  Tabs,
  Tab,
  Container,
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
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { collegeAdminAPI } from '../../api/collegeAdmin';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);

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
    role: 'student',
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadStudents();
  }, [page, rowsPerPage, searchTerm, filterStatus]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterStatus,
      };

      const response = await collegeAdminAPI.getStudents(params);
      setStudents(response.students || response.users || []);
    } catch (error) {
      console.error('Failed to load students:', error);
      setError('Failed to load students. Please try again.');
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
        role: 'student',
        phone: formData.phone || '',
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || '',
        address: formData.address || '',
        status: formData.status || 'active',
      };

      if (editingStudent) {
        await collegeAdminAPI.updateStudent(editingStudent.id, userData);
        setSuccess('Student updated successfully!');
      } else {
        await collegeAdminAPI.createStudent(userData);
        setSuccess('Student created successfully!');
      }

      setOpenDialog(false);
      setEditingStudent(null);
      resetForm();
      setFormErrors({});
      loadStudents();
    } catch (error) {
      console.error('Failed to save student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save student. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      await collegeAdminAPI.deleteStudent(deletingStudent.id);
      setSuccess('Student deleted successfully!');
      setOpenDeleteDialog(false);
      setDeletingStudent(null);
      loadStudents();
    } catch (error) {
      console.error('Failed to delete student:', error);
      setError('Failed to delete student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      username: student.username || student.email,
      password: 'defaultPassword123!', // Don't show actual password
      role: 'student',
      phone: student.phone,
      date_of_birth: student.date_of_birth,
      gender: student.gender,
      address: student.address,
      status: student.status,
    });
    setOpenDialog(true);
  };

  const handleView = async (student) => {
    try {
      const response = await collegeAdminAPI.getStudentDetails(student.id);
      setViewingStudent(response.user);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Failed to load student details:', error);
      setError('Failed to load student details.');
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: 'defaultPassword123!',
      role: 'student',
      phone: '',
      date_of_birth: '',
      gender: '',
      address: '',
      status: 'active',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'graduated':
        return 'info';
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
        Student Management
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
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
          Search & Filters
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }} >
            <TextField
              fullWidth
              label="Search Students"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} >
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
                <MenuItem value="graduated">
                  <Chip label="Graduated" color="info" size="small" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }} >
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingStudent(null);
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
              Add Student
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Student</TableCell>
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
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {student.first_name?.[0]}{student.last_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {student.first_name} {student.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {student.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        color={getStatusColor(student.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(student)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Student">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(student)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Student">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDeletingStudent(student);
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
          count={students.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add/Edit Student Dialog */}
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
            <PersonIcon color="primary" />
            <Typography variant="h6">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* Personal Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
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
                  helperText={formErrors.first_name || "Enter student's first name"}
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
                  helperText={formErrors.last_name || "Enter student's last name"}
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

              {/* Academic Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 0.5,
                  mb: 2,
                  mt: 2
                }}>
                  Account Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
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
                    <MenuItem value="graduated">
                      <Chip label="Graduated" color="info" size="small" />
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
              {editingStudent ? 'Update Student' : 'Create Student'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Student Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          {viewingStudent && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, width: 64, height: 64, bgcolor: 'primary.main' }}>
                    {viewingStudent.first_name?.[0]}{viewingStudent.last_name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {viewingStudent.first_name} {viewingStudent.last_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Student ID: {viewingStudent.id}
                    </Typography>
                    <Chip
                      label={viewingStudent.status}
                      color={getStatusColor(viewingStudent.status)}
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
                          secondary={viewingStudent.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <PhoneIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Phone"
                          secondary={viewingStudent.phone || 'Not provided'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <CalendarIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Date of Birth"
                          secondary={viewingStudent.date_of_birth ? 
                            new Date(viewingStudent.date_of_birth).toLocaleDateString() : 'Not provided'
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
                              label={viewingStudent.gender}
                              color={getGenderColor(viewingStudent.gender)}
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
                      Account Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <CalendarIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Created Date"
                          secondary={new Date(viewingStudent.created_at).toLocaleDateString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <LocationIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Address"
                          secondary={viewingStudent.address || 'Not provided'}
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
            Are you sure you want to delete {deletingStudent?.first_name} {deletingStudent?.last_name}?
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

export default StudentManagement; 