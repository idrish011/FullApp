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
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Avatar,
  Divider,
  Stack,
  LinearProgress,
  Badge,
  Snackbar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  Feedback as FeedbackIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { teacherAPI } from '../../api/teacher';

const AssignmentReview = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradingData, setGradingData] = useState({
    marks_obtained: '',
    feedback: '',
    grade: '',
    status: 'graded'
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getAssignments();
      setAssignments(response.assignments || []);
    } catch (error) {
      console.error('Failed to load assignments:', error);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignmentSubmissions = async (assignmentId) => {
    try {
      const response = await teacherAPI.getAssignment(assignmentId);
      setSelectedAssignment(response.assignment);
      setSubmissions(response.submissions || []);
      setDialogOpen(true);
    } catch (error) {
      console.error('Failed to load assignment submissions:', error);
      setNotification({
        open: true,
        message: 'Failed to load assignment submissions',
        severity: 'error'
      });
    }
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradingData({
      marks_obtained: submission.marks_obtained || '',
      feedback: submission.feedback || '',
      grade: submission.grade || '',
      status: submission.status || 'graded'
    });
    setGradingDialogOpen(true);
  };

  const handleSaveGrade = async () => {
    try {
      setSaving(true);
      
      // Update the submission with grade
      await teacherAPI.gradeSubmission(
        selectedAssignment.id,
        selectedSubmission.student_id,
        {
          marks_obtained: parseFloat(gradingData.marks_obtained),
          feedback: gradingData.feedback,
          grade: gradingData.grade,
          status: gradingData.status
        }
      );

      setNotification({
        open: true,
        message: 'Assignment graded successfully',
        severity: 'success'
      });
      
      setGradingDialogOpen(false);
      
      // Reload submissions
      if (selectedAssignment) {
        await loadAssignmentSubmissions(selectedAssignment.id);
      }
    } catch (error) {
      console.error('Failed to grade assignment:', error);
      setNotification({
        open: true,
        message: 'Failed to grade assignment',
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
      case 'submitted':
        return 'info';
      case 'graded':
        return 'success';
      case 'late':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'default';
    const gradeValue = parseFloat(grade);
    if (gradeValue >= 90) return 'success';
    if (gradeValue >= 80) return 'primary';
    if (gradeValue >= 70) return 'warning';
    return 'error';
  };

  const calculateGrade = (marksObtained, totalMarks) => {
    if (!marksObtained || !totalMarks) return '';
    const percentage = (marksObtained / totalMarks) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.class_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = `${submission.first_name} ${submission.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
        <Typography variant="h4">Assignment Review & Grading</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Assignments List */}
      <Grid container spacing={3}>
        {filteredAssignments.map((assignment) => (
          <Grid item xs={12} md={6} lg={4} key={assignment.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => loadAssignmentSubmissions(assignment.id)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {assignment.title}
                  </Typography>
                  <Chip
                    label={assignment.status}
                    color={getStatusColor(assignment.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {assignment.description}
                </Typography>

                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AssignmentIcon fontSize="small" color="action" />
                    <Typography variant="body2">{assignment.class_name}</Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <AssessmentIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {assignment.total_marks} marks
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <Badge badgeContent={assignment.submission_count} color="primary">
                      <Typography variant="body2">Submissions</Typography>
                    </Badge>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <HistoryIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ViewIcon />}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Review Submissions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Submissions Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {selectedAssignment?.title} - Submissions
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedAssignment?.class_name} • {submissions.length} submissions
          </Typography>
        </DialogTitle>
        <DialogContent>
          {submissions.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>
                            {submission.first_name[0]}{submission.last_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {submission.first_name} {submission.last_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {submission.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status}
                          color={getStatusColor(submission.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {submission.marks_obtained ? (
                          <Typography variant="body2">
                            {submission.marks_obtained}/{selectedAssignment?.total_marks}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            Not graded
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {submission.grade ? (
                          <Chip
                            label={submission.grade}
                            color={getGradeColor(submission.grade)}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Grade Submission">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleGradeSubmission(submission)}
                            >
                              <GradeIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Submission">
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {submission.document_path && (
                            <Tooltip title="Download Files">
                              <IconButton size="small" color="info">
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography variant="body1" color="textSecondary">
                No submissions found for this assignment
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Grading Dialog */}
      <Dialog 
        open={gradingDialogOpen} 
        onClose={() => setGradingDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Grade Assignment
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedSubmission?.first_name} {selectedSubmission?.last_name} - {selectedAssignment?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marks Obtained"
                type="number"
                value={gradingData.marks_obtained}
                onChange={(e) => {
                  const value = e.target.value;
                  setGradingData({
                    ...gradingData,
                    marks_obtained: value,
                    grade: value ? calculateGrade(parseFloat(value), selectedAssignment?.total_marks) : ''
                  });
                }}
                inputProps={{ 
                  min: 0, 
                  max: selectedAssignment?.total_marks || 100 
                }}
                helperText={`Max: ${selectedAssignment?.total_marks} marks`}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade"
                value={gradingData.grade}
                onChange={(e) => setGradingData({...gradingData, grade: e.target.value})}
                helperText="Letter grade (A, B, C, D, F)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={gradingData.status}
                  label="Status"
                  onChange={(e) => setGradingData({...gradingData, status: e.target.value})}
                >
                  <MenuItem value="graded">Graded</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Feedback"
                multiline
                rows={4}
                value={gradingData.feedback}
                onChange={(e) => setGradingData({...gradingData, feedback: e.target.value})}
                placeholder="Provide detailed feedback for the student..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setGradingDialogOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveGrade}
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={saving || !gradingData.marks_obtained}
          >
            {saving ? 'Saving...' : 'Save Grade'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
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

export default AssignmentReview; 