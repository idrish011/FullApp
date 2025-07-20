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
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Divider,
  Avatar,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { teacherAPI } from '../../api/teacher';
import TeacherLayout from './TeacherLayout';

const GradesManagement = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    student_id: '',
    exam_type: '',
    marks_obtained: '',
    total_marks: '',
    grade: '',
    remarks: ''
  });
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const examTypes = [
    { value: 'internal_test', label: 'Internal Test', color: 'primary' },
    { value: 'mid_term', label: 'Mid Term', color: 'secondary' },
    { value: 'practical', label: 'Practical', color: 'success' },
    { value: 'theory', label: 'Theory', color: 'info' },
    { value: 'main_exam', label: 'Main Exam', color: 'warning' },
    { value: 'assignment', label: 'Assignment', color: 'default' },
    { value: 'quiz', label: 'Quiz', color: 'error' }
  ];

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadResults();
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getClasses();
      setClasses(response.classes || []);
      if (response.classes && response.classes.length > 0) {
        setSelectedClass(response.classes[0].id);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await teacherAPI.getStudents(selectedClass);
      setStudents(response.students || []);
    } catch (error) {
      console.error('Failed to load students:', error);
      setError('Failed to load students');
    }
  };

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getResults(selectedClass);
      setResults(response.results || []);
    } catch (error) {
      console.error('Failed to load results:', error);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = () => {
    setFormData({
      student_id: '',
      exam_type: '',
      marks_obtained: '',
      total_marks: '',
      grade: '',
      remarks: ''
    });
    setDialogOpen(true);
  };

  const handleEditResult = (result) => {
    setSelectedResult(result);
    setFormData({
      student_id: result.student_id,
      exam_type: result.exam_type,
      marks_obtained: result.marks_obtained,
      total_marks: result.total_marks,
      grade: result.grade || '',
      remarks: result.remarks || ''
    });
    setEditDialogOpen(true);
  };

  const handleSaveResult = async () => {
    try {
      setSaving(true);
      
      const resultData = {
        class_id: selectedClass,
        student_id: formData.student_id,
        exam_type: formData.exam_type,
        marks_obtained: parseFloat(formData.marks_obtained),
        total_marks: parseFloat(formData.total_marks),
        grade: formData.grade,
        remarks: formData.remarks
      };

      if (selectedResult) {
        // Update existing result
        await teacherAPI.updateResult(selectedClass, selectedResult.id, resultData);
        setNotification({
          open: true,
          message: 'Result updated successfully',
          severity: 'success'
        });
      } else {
        // Add new result
        await teacherAPI.addResult(selectedClass, resultData);
        setNotification({
          open: true,
          message: 'Result added successfully',
          severity: 'success'
        });
      }

      setDialogOpen(false);
      setEditDialogOpen(false);
      setSelectedResult(null);
      loadResults();
    } catch (error) {
      console.error('Failed to save result:', error);
      setNotification({
        open: true,
        message: 'Failed to save result',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await teacherAPI.deleteResult(selectedClass, resultId);
        setNotification({
          open: true,
          message: 'Result deleted successfully',
          severity: 'success'
        });
        loadResults();
      } catch (error) {
        console.error('Failed to delete result:', error);
        setNotification({
          open: true,
          message: 'Failed to delete result',
          severity: 'error'
        });
      }
    }
  };

  const calculatePercentage = (marksObtained, totalMarks) => {
    if (!marksObtained || !totalMarks) return 0;
    return ((marksObtained / totalMarks) * 100).toFixed(2);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'primary';
    if (percentage >= 70) return 'warning';
    if (percentage >= 60) return 'info';
    return 'error';
  };

  const getExamTypeColor = (examType) => {
    const type = examTypes.find(t => t.value === examType);
    return type ? type.color : 'default';
  };

  const getExamTypeLabel = (examType) => {
    const type = examTypes.find(t => t.value === examType);
    return type ? type.label : examType;
  };

  const filteredResults = results.filter(result => {
    if (activeTab === 0) return true; // All results
    const examType = examTypes[activeTab - 1]?.value;
    return result.exam_type === examType;
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const selectedClassData = classes.find(c => c.id === selectedClass);

  if (loading && classes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Grades Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Class Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Select Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classes.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.id}>
                      {classItem.name} - {classItem.course_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              {selectedClassData && (
                <Box display="flex" alignItems="center" gap={2}>
                  <SchoolIcon color="primary" />
                  <Typography variant="body1">
                    {selectedClassData.name} • {students.length} students
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {selectedClass && (
        <>
          {/* Exam Type Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Results" />
              {examTypes.map((type) => (
                <Tab key={type.value} label={type.label} />
              ))}
            </Tabs>
          </Paper>

          {/* Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {activeTab === 0 ? 'All Results' : getExamTypeLabel(examTypes[activeTab - 1]?.value)}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddResult}
            >
              Add Result
            </Button>
          </Box>

          {/* Results Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Exam Type</TableCell>
                  <TableCell align="center">Marks</TableCell>
                  <TableCell align="center">Percentage</TableCell>
                  <TableCell align="center">Grade</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResults
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((result) => {
                    const percentage = calculatePercentage(result.marks_obtained, result.total_marks);
                    return (
                      <TableRow key={result.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {result.student_name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getExamTypeLabel(result.exam_type)}
                            color={getExamTypeColor(result.exam_type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {result.marks_obtained}/{result.total_marks}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${percentage}%`}
                            color={getGradeColor(percentage)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight="medium">
                            {result.grade || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {result.remarks || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditResult(result)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteResult(result.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredResults.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}

      {/* Add/Edit Result Dialog */}
      <Dialog open={dialogOpen || editDialogOpen} onClose={() => {
        setDialogOpen(false);
        setEditDialogOpen(false);
        setSelectedResult(null);
      }} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedResult ? 'Edit Result' : 'Add New Result'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  value={formData.student_id}
                  label="Student"
                  onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Exam Type</InputLabel>
                <Select
                  value={formData.exam_type}
                  label="Exam Type"
                  onChange={(e) => setFormData({...formData, exam_type: e.target.value})}
                >
                  {examTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marks Obtained"
                type="number"
                value={formData.marks_obtained}
                onChange={(e) => setFormData({...formData, marks_obtained: e.target.value})}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Marks"
                type="number"
                value={formData.total_marks}
                onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade"
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                placeholder="A, B, C, D, F"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                placeholder="Additional comments or feedback..."
              />
            </Grid>
            
            {formData.marks_obtained && formData.total_marks && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Percentage: {calculatePercentage(formData.marks_obtained, formData.total_marks)}%
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setEditDialogOpen(false);
              setSelectedResult(null);
            }}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveResult}
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={saving || !formData.student_id || !formData.exam_type || !formData.marks_obtained || !formData.total_marks}
          >
            {saving ? 'Saving...' : 'Save Result'}
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

const GradesManagementPage = () => (
  <TeacherLayout title="Grades Management" subtitle="View and manage student grades">
    <GradesManagement />
  </TeacherLayout>
);

export default GradesManagementPage; 