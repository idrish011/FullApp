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
  Badge,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { collegeAdminAPI } from '../../api/collegeAdmin';

const AdmissionsManagement = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [courses, setCourses] = useState([]);
  
  // Dialog states
  const [viewingAdmission, setViewingAdmission] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [updatingAdmission, setUpdatingAdmission] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadAdmissions();
    loadCourses();
  }, [page, rowsPerPage, searchTerm, filterStatus, filterCourse]);

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterStatus,
        course_id: filterCourse,
      };

      const response = await collegeAdminAPI.getAdmissions(params);
      setAdmissions(response.admissions || []);
    } catch (error) {
      console.error('Failed to load admissions:', error);
      setError('Failed to load admissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await collegeAdminAPI.getCourses();
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      setError('');

      await collegeAdminAPI.updateAdmissionStatus(updatingAdmission.id, newStatus);
      setSuccess('Admission status updated successfully!');
      setOpenStatusDialog(false);
      setUpdatingAdmission(null);
      setNewStatus('');
      loadAdmissions();
    } catch (error) {
      console.error('Failed to update admission status:', error);
      setError('Failed to update admission status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (admission) => {
    try {
      setViewingAdmission(admission);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Failed to load admission details:', error);
      setError('Failed to load admission details.');
    }
  };

  const handleStatusChange = (admission, status) => {
    setUpdatingAdmission(admission);
    setNewStatus(status);
    setOpenStatusDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'waitlisted':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      waitlisted: 0,
    };
    
    admissions.forEach(admission => {
      counts[admission.status] = (counts[admission.status] || 0) + 1;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Admissions Management
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

      {/* Status Summary */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Applications
              </Typography>
              <Typography variant="h4">{statusCounts.totalApplications}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Pending Review
              </Typography>
              <Typography variant="h4">{statusCounts.pendingReview}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Approved
              </Typography>
              <Typography variant="h4">{statusCounts.approved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Rejected
              </Typography>
              <Typography variant="h4">{statusCounts.rejected}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: (theme) => theme.palette.background.paper, border: (theme) => theme.palette.card?.border || '1px solid #eee', boxShadow: 'none' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Search Applicants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="waitlisted">Waitlisted</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                label="Course"
              >
                <MenuItem value="">All Courses</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Admissions Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : admissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No admissions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                admissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {admission.first_name?.[0]}{admission.last_name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {admission.first_name} {admission.last_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {admission.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{admission.email}</TableCell>
                    <TableCell>{admission.course_name}</TableCell>
                    <TableCell>
                      {new Date(admission.applied_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={admission.status}
                        color={getStatusColor(admission.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(admission)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {admission.status === 'pending' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleStatusChange(admission, 'approved')}
                            >
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleStatusChange(admission, 'rejected')}
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Waitlist">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleStatusChange(admission, 'waitlisted')}
                            >
                              <AssignmentIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={admissions.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* View Admission Details Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Admission Details</DialogTitle>
        <DialogContent>
          {viewingAdmission && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, width: 64, height: 64, bgcolor: 'primary.main' }}>
                    {viewingAdmission.first_name?.[0]}{viewingAdmission.last_name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {viewingAdmission.first_name} {viewingAdmission.last_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Application ID: {viewingAdmission.id}
                    </Typography>
                    <Chip
                      label={viewingAdmission.status}
                      color={getStatusColor(viewingAdmission.status)}
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
                          secondary={viewingAdmission.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <PhoneIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Phone"
                          secondary={viewingAdmission.phone || 'Not provided'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <CalendarIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Date of Birth"
                          secondary={viewingAdmission.date_of_birth ? 
                            new Date(viewingAdmission.date_of_birth).toLocaleDateString() : 'Not provided'
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <PersonIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Gender"
                          secondary={viewingAdmission.gender}
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
                      Application Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemAvatar>
                          <SchoolIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Course"
                          secondary={viewingAdmission.course_name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <CalendarIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Applied Date"
                          secondary={new Date(viewingAdmission.applied_date).toLocaleDateString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <DescriptionIcon color="primary" />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Statement of Purpose"
                          secondary={viewingAdmission.statement_of_purpose || 'Not provided'}
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

      {/* Status Update Dialog */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Update Admission Status</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change the status of {updatingAdmission?.first_name} {updatingAdmission?.last_name}'s application to "{newStatus}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdmissionsManagement; 