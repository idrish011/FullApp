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
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Divider,
  Stack,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { teacherAPI } from '../../api/teacher';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class_id: '',
    due_date: '',
    total_marks: '',
    weightage: '',
    assignment_type: 'assignment',
    document: null
  });

  useEffect(() => {
    loadAssignments();
    loadClasses();
  }, [page, rowsPerPage, searchTerm, classFilter, statusFilter]);

  const loadClasses = async () => {
    try {
      const response = await teacherAPI.getClasses();
      setClasses(response.classes || []);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (classFilter !== 'all') params.class_id = classFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await teacherAPI.getAssignments(params);
      let assignmentsData = response.assignments || [];
      
      // Apply search filter
      if (searchTerm) {
        assignmentsData = assignmentsData.filter(assignment =>
          assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Assignment loading error:', error);
      setError('Failed to load assignments. Please try again.');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      class_id: '',
      due_date: '',
      total_marks: '',
      weightage: '',
      assignment_type: 'assignment',
      document: null
    });
    setDialogOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      class_id: assignment.class_id,
      due_date: assignment.due_date,
      total_marks: assignment.total_marks,
      weightage: assignment.weightage,
      assignment_type: assignment.assignment_type,
      document: null
    });
    setDialogOpen(true);
  };

  const handleViewAssignment = async (assignment) => {
    try {
      const response = await teacherAPI.getAssignment(assignment.id);
      setViewingAssignment(response);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Failed to load assignment details:', error);
      setNotification({
        open: true,
        message: 'Failed to load assignment details',
        severity: 'error'
      });
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        setSaving(true);
        await teacherAPI.deleteAssignment(assignmentId);
        
        setNotification({
          open: true,
          message: 'Assignment deleted successfully',
          severity: 'success'
        });
        await loadAssignments();
      } catch (error) {
        setNotification({
          open: true,
          message: 'Failed to delete assignment',
          severity: 'error'
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSaveAssignment = async () => {
    try {
      setSaving(true);
      setError('');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('class_id', formData.class_id);
      formDataToSend.append('due_date', formData.due_date);
      formDataToSend.append('total_marks', formData.total_marks);
      formDataToSend.append('weightage', formData.weightage);
      formDataToSend.append('assignment_type', formData.assignment_type);
      
      if (formData.document) {
        formDataToSend.append('document', formData.document);
      }
      
      if (editingAssignment) {
        await teacherAPI.updateAssignment(editingAssignment.id, formDataToSend);
      } else {
        await teacherAPI.createAssignment(formDataToSend);
      }
      
      setNotification({
        open: true,
        message: editingAssignment ? 'Assignment updated successfully' : 'Assignment created successfully',
        severity: 'success'
      });
      setDialogOpen(false);
      await loadAssignments();
    } catch (error) {
      console.error('Save assignment error:', error);
      setError('Failed to save assignment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getAssignmentTypeColor = (type) => {
    switch (type) {
      case 'assignment':
        return 'primary';
      case 'project':
        return 'secondary';
      case 'quiz':
        return 'info';
      case 'exam':
        return 'error';
      default:
        return 'default';
    }
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
        <Typography variant="h4">Assignment Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAssignment}
        >
          Create Assignment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Search Assignments"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={classFilter}
              label="Class"
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <MenuItem value="all">All Classes</MenuItem>
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
              ))}
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
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Assignments Grid */}
      <Grid container spacing={3}>
        {assignments
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((assignment) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={assignment.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h2" noWrap>
                      {assignment.title}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={assignment.assignment_type}
                        color={getAssignmentTypeColor(assignment.assignment_type)}
                        size="small"
                      />
                      <Chip
                        label={assignment.status}
                        color={getStatusColor(assignment.status)}
                        size="small"
                      />
                    </Stack>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {assignment.description}
                  </Typography>
                  
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <SchoolIcon fontSize="small" color="action" />
                      <Typography variant="body2">{assignment.class_name}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AssignmentIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {assignment.total_marks} marks
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge badgeContent={assignment.submission_count} color="primary">
                        <Typography variant="body2">Submissions</Typography>
                      </Badge>
                    </Box>
                  </Stack>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => handleViewAssignment(assignment)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditAssignment(assignment)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        color="error"
                        disabled={saving}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {assignment.document_path && (
                    <Tooltip title="Download Document">
                      <IconButton size="small">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={assignments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* Create/Edit Assignment Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Box component="form" noValidate>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Assignment Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  error={!formData.title && formData.title !== ''}
                  helperText={!formData.title && formData.title !== '' ? 'Title is required' : 'Enter assignment title'}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  multiline
                  rows={4}
                  helperText="Provide detailed instructions for the assignment"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={!formData.class_id && formData.class_id !== ''}>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={formData.class_id}
                    label="Class"
                    onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                  >
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                    ))}
                  </Select>
                  {!formData.class_id && formData.class_id !== '' && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      Class is required
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  required
                  error={!formData.due_date && formData.due_date !== ''}
                  helperText={!formData.due_date && formData.due_date !== '' ? 'Due date is required' : 'Set assignment due date'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Total Marks"
                  type="number"
                  value={formData.total_marks}
                  onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                  required
                  error={!formData.total_marks && formData.total_marks !== ''}
                  helperText={!formData.total_marks && formData.total_marks !== '' ? 'Total marks is required' : 'Enter total marks'}
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Weightage (%)"
                  type="number"
                  value={formData.weightage}
                  onChange={(e) => setFormData({...formData, weightage: e.target.value})}
                  helperText="Optional: Weightage in final grade"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Assignment Type</InputLabel>
                  <Select
                    value={formData.assignment_type}
                    label="Assignment Type"
                    onChange={(e) => setFormData({...formData, assignment_type: e.target.value})}
                  >
                    <MenuItem value="assignment">Assignment</MenuItem>
                    <MenuItem value="project">Project</MenuItem>
                    <MenuItem value="quiz">Quiz</MenuItem>
                    <MenuItem value="exam">Exam</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: 56 }}
                >
                  Upload Document
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif"
                  />
                </Button>
                {formData.document && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 0.5 }}>
                    File selected: {formData.document.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAssignment} 
            variant="contained"
            disabled={
              saving ||
              !formData.title || 
              !formData.class_id || 
              !formData.due_date || 
              !formData.total_marks
            }
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              editingAssignment ? 'Update Assignment' : 'Create Assignment'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Assignment Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 3 } }}
      >
        {viewingAssignment && (
          <>
            <DialogTitle sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" component="div">
                {viewingAssignment.assignment.title}
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                <Chip
                  label={viewingAssignment.assignment.assignment_type}
                  color={getAssignmentTypeColor(viewingAssignment.assignment.assignment_type)}
                  size="small"
                />
                <Chip
                  label={viewingAssignment.assignment.status}
                  color={getStatusColor(viewingAssignment.assignment.status)}
                  size="small"
                />
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 1 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {viewingAssignment.assignment.description}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">Class</Typography>
                  <Typography variant="body1">{viewingAssignment.assignment.class_name}</Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">Due Date</Typography>
                  <Typography variant="body1">
                    {new Date(viewingAssignment.assignment.due_date).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">Total Marks</Typography>
                  <Typography variant="body1">{viewingAssignment.assignment.total_marks}</Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">Weightage</Typography>
                  <Typography variant="body1">{viewingAssignment.assignment.weightage || 'N/A'}</Typography>
                </Grid>
                
                {viewingAssignment.assignment.document_path && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2">Supporting Document</Typography>
                    <Button
                      startIcon={<DownloadIcon />}
                      variant="outlined"
                      size="small"
                    >
                      Download Document
                    </Button>
                  </Grid>
                )}
                
                {viewingAssignment.submissions && viewingAssignment.submissions.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                      Submissions ({viewingAssignment.submissions.length})
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Submitted</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Marks</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {viewingAssignment.submissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell>
                                {submission.first_name} {submission.last_name}
                              </TableCell>
                              <TableCell>
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={submission.status}
                                  color={submission.status === 'submitted' ? 'success' : 'default'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {submission.marks_obtained || 'Not graded'}
                              </TableCell>
                              <TableCell>
                                <Tooltip title="Grade">
                                  <IconButton size="small">
                                    <GradeIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button onClick={() => setViewDialogOpen(false)} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
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

export default AssignmentManagement; 