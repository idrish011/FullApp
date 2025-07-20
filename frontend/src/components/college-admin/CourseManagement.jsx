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
  Book as BookIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { collegeAdminAPI } from '../../api/collegeAdmin';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    duration_months: '',
    fee_amount: '',
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCourses();
  }, [page, rowsPerPage, searchTerm]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
      };

      const response = await collegeAdminAPI.getCourses(params);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Course name is required';
    }
    
    if (!formData.code?.trim()) {
      errors.code = 'Course code is required';
    }

    if (formData.credits && isNaN(Number(formData.credits))) {
      errors.credits = 'Credits must be a valid number';
    }

    if (formData.duration_months && isNaN(Number(formData.duration_months))) {
      errors.duration_months = 'Duration must be a valid number';
    }

    if (formData.fee_amount && isNaN(Number(formData.fee_amount))) {
      errors.fee_amount = 'Fee amount must be a valid number';
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

      // Prepare course data
      const courseData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: formData.description || '',
        credits: formData.credits ? Number(formData.credits) : null,
        duration_months: formData.duration_months ? Number(formData.duration_months) : null,
        fee_amount: formData.fee_amount ? Number(formData.fee_amount) : null,
      };

      if (editingCourse) {
        await collegeAdminAPI.updateCourse(editingCourse.id, courseData);
        setSuccess('Course updated successfully!');
      } else {
        await collegeAdminAPI.createCourse(courseData);
        setSuccess('Course created successfully!');
      }

      setOpenDialog(false);
      setEditingCourse(null);
      resetForm();
      setFormErrors({});
      loadCourses();
    } catch (error) {
      console.error('Failed to save course:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save course. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      await collegeAdminAPI.deleteCourse(deletingCourse.id);
      setSuccess('Course deleted successfully!');
      setOpenDeleteDialog(false);
      setDeletingCourse(null);
      loadCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
      setError('Failed to delete course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description,
      credits: course.credits,
      duration_months: course.duration_months,
      fee_amount: course.fee_amount,
    });
    setOpenDialog(true);
  };

  const handleView = async (course) => {
    try {
      setViewingCourse(course);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Failed to load course details:', error);
      setError('Failed to load course details.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      credits: '',
      duration_months: '',
      fee_amount: '',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Course Management
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
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: (theme) => theme.palette.background.paper, border: (theme) => theme.palette.card?.border || '1px solid #eee', boxShadow: 'none' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
          Search & Filters
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              label="Search Courses"
              placeholder="Search by course name, code, or description..."
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
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingCourse(null);
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
              Add Course
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Courses Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Course</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Credits</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fee</TableCell>
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
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No courses found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <BookIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {course.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {course.description?.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={course.code} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{course.duration_months} months</TableCell>
                    <TableCell>{formatCurrency(course.fee_amount)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(course)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Course">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(course)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDeletingCourse(course);
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
          count={courses.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add/Edit Course Dialog */}
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
            <BookIcon color="primary" />
            <Typography variant="h6">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: 'primary.main',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 0.5,
                  mb: 2
                }}>
                  Course Information
                </Typography>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Course Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  variant="outlined"
                  size="medium"
                  helperText="Enter the course name"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Course Code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  variant="outlined"
                  size="medium"
                  helperText="Enter unique course code"
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  variant="outlined"
                  size="medium"
                  helperText="Provide a detailed description of the course"
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required variant="outlined" size="medium">
                  <InputLabel>Teacher</InputLabel>
                  <Select
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                    label="Teacher"
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Duration (months)"
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                  required
                  variant="outlined"
                  size="medium"
                  helperText="Course duration in months"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Fee Amount"
                  type="number"
                  value={formData.fee_amount}
                  onChange={(e) => setFormData({ ...formData, fee_amount: e.target.value })}
                  required
                  variant="outlined"
                  size="medium"
                  helperText="Course fee in currency"
                />
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
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Course Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {viewingCourse && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <BookIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h6">
                      {viewingCourse.name}
                    </Typography>
                    <Chip
                      label={viewingCourse.code}
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }} >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Course Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <DescriptionIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Description"
                          secondary={viewingCourse.description}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <ScheduleIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Duration"
                          secondary={`${viewingCourse.duration_months} months`}
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
                      Academic Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <BookIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Credits"
                          secondary={viewingCourse.credits}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <MoneyIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Fee Amount"
                          secondary={formatCurrency(viewingCourse.fee_amount)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <PersonIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Classes"
                          secondary={`${viewingCourse.class_count || 0} active classes`}
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
            Are you sure you want to delete "{deletingCourse?.name}"?
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

export default CourseManagement; 