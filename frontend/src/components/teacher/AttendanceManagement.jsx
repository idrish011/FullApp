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
  Avatar,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { teacherAPI } from '../../api/teacher';

// Helper function to check if date is Sunday
const isSunday = (dateString) => {
  const date = new Date(dateString);
  return date.getDay() === 0;
};

const AttendanceManagement = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [calendarData, setCalendarData] = useState(null);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadAttendance();
    }
  }, [selectedClass, selectedDate]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getClasses();
      setClasses(response.classes || []);
    } catch (error) {
      console.error('Failed to load classes:', error);
      setError('Failed to load classes. Please try again.');
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
      setError('Failed to load students. Please try again.');
    }
  };

  const loadAttendance = async () => {
    if (!selectedClass || !selectedDate) return;

    try {
      const response = await teacherAPI.getAttendance(selectedClass, selectedDate);
      setAttendanceData(response.students || []);
    } catch (error) {
      console.error('Failed to load attendance:', error);
      setError('Failed to load attendance. Please try again.');
    }
  };

  const handleMarkAttendance = async () => {
    try {
      setSaving(true);
      setError('');

      const attendanceRecords = attendanceData.map(student => ({
        student_id: student.id,
        status: student.attendance.status,
        remarks: student.attendance.remarks
      }));

      await teacherAPI.markAttendance(selectedClass, {
        date: selectedDate,
        attendance_data: attendanceRecords
      });

      setNotification({
        open: true,
        message: 'Attendance marked successfully',
        severity: 'success'
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Mark attendance error:', error);
      
      // Handle specific validation errors
      if (error.response?.data?.error === 'Attendance not allowed') {
        setError(error.response.data.message || 'Attendance is not allowed on this date');
      } else {
        setError(error.response?.data?.message || 'Failed to mark attendance. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, attendance: { ...student.attendance, [field]: value } }
          : student
      )
    );
  };

  const handleLoadReport = async () => {
    try {
      const response = await teacherAPI.getAttendanceReport(selectedClass);
      setAttendanceReport(response);
      setReportDialogOpen(true);
    } catch (error) {
      console.error('Failed to load attendance report:', error);
      setNotification({
        open: true,
        message: 'Failed to load attendance report',
        severity: 'error'
      });
    }
  };

  const handleLoadCalendar = async () => {
    try {
      const response = await teacherAPI.getAttendanceCalendar(selectedClass);
      setCalendarData(response);
      setCalendarDialogOpen(true);
    } catch (error) {
      console.error('Failed to load attendance calendar:', error);
      setNotification({
        open: true,
        message: 'Failed to load attendance calendar',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'excused':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon />;
      case 'absent':
        return <CancelIcon />;
      case 'late':
        return <ScheduleIcon />;
      case 'excused':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
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
        <Typography variant="h4">Attendance Management</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={handleLoadReport}
            disabled={!selectedClass}
          >
            Attendance Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={handleLoadCalendar}
            disabled={!selectedClass}
          >
            Calendar View
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={!selectedClass}
          >
            Mark Attendance
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Class Selection */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }} >
            <FormControl fullWidth>
              <InputLabel>Select Class</InputLabel>
              <Select
                value={selectedClass}
                label="Select Class"
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.course_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} >
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            {isSunday(selectedDate) && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <WarningIcon />
                  <Typography variant="body2">
                    Attendance is not allowed on Sundays
                  </Typography>
                </Box>
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Attendance Summary */}
      {selectedClass && attendanceData.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Attendance Summary - {new Date(selectedDate).toLocaleDateString()}
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Attendance Statistics
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {attendanceData.filter(s => s.attendance.status === 'present').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Present Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Absent Students
                  </Typography>
                  <Typography variant="h4" color="error">
                    {attendanceData.filter(s => s.attendance.status === 'absent').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Absent Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Students List */}
      {selectedClass && students.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => {
                const attendance = attendanceData.find(s => s.id === student.id)?.attendance || {
                  status: 'present',
                  remarks: ''
                };

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={student.profile_image}>
                          {student.first_name[0]}{student.last_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {student.first_name} {student.last_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={attendance.status}
                          onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                          size="small"
                        >
                          <MenuItem value="present">
                            <Chip label="Present" color="success" size="small" />
                          </MenuItem>
                          <MenuItem value="absent">
                            <Chip label="Absent" color="error" size="small" />
                          </MenuItem>
                          <MenuItem value="late">
                            <Chip label="Late" color="warning" size="small" />
                          </MenuItem>
                          <MenuItem value="excused">
                            <Chip label="Excused" color="info" size="small" />
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={attendance.remarks}
                        onChange={(e) => handleAttendanceChange(student.id, 'remarks', e.target.value)}
                        placeholder="Add remarks..."
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Quick Actions">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mark Attendance Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 3 } }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            Mark Attendance - {selectedDate}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Mark attendance for all students in the selected class
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {attendanceData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar src={student.profile_image}>
                            {student.first_name[0]}{student.last_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {student.first_name} {student.last_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={student.attendance.status}
                            onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                            size="small"
                          >
                            <MenuItem value="present">
                              <Chip label="Present" color="success" size="small" />
                            </MenuItem>
                            <MenuItem value="absent">
                              <Chip label="Absent" color="error" size="small" />
                            </MenuItem>
                            <MenuItem value="late">
                              <Chip label="Late" color="warning" size="small" />
                            </MenuItem>
                            <MenuItem value="excused">
                              <Chip label="Excused" color="info" size="small" />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={student.attendance.remarks}
                          onChange={(e) => handleAttendanceChange(student.id, 'remarks', e.target.value)}
                          placeholder="Add remarks..."
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography variant="body1" color="textSecondary">
                No students found for this class
              </Typography>
            </Box>
          )}
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
            onClick={handleMarkAttendance} 
            variant="contained"
            disabled={saving || attendanceData.length === 0 || isSunday(selectedDate)}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Save Attendance'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attendance Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 3 } }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            Attendance Report
          </Typography>
          {attendanceReport && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {attendanceReport.class?.name} - {attendanceReport.report_period?.start_date} to {attendanceReport.report_period?.end_date}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {attendanceReport ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell align="center">Total Days</TableCell>
                    <TableCell align="center">Present</TableCell>
                    <TableCell align="center">Absent</TableCell>
                    <TableCell align="center">Late</TableCell>
                    <TableCell align="center">Excused</TableCell>
                    <TableCell align="center">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceReport.summary?.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>
                            {student.first_name[0]}{student.last_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {student.first_name} {student.last_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{student.total_days}</TableCell>
                      <TableCell align="center">
                        <Chip label={student.present_days} color="success" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={student.absent_days} color="error" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={student.late_days} color="warning" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={student.excused_days} color="info" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {student.attendance_percentage}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={student.attendance_percentage}
                            sx={{ width: 60, height: 6 }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setReportDialogOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calendar View Dialog */}
      <Dialog
        open={calendarDialogOpen}
        onClose={() => setCalendarDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, boxShadow: 3 } }}
      >
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" component="div">
            Attendance Calendar
          </Typography>
          {calendarData && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {calendarData.month}/{calendarData.year} - {calendarData.total_students} students
            </Typography>
          )}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 1 }}>
          {calendarData ? (
            <Grid container spacing={2}>
              {calendarData.attendance_data?.map((day, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }}   key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {new Date(day.date).getDate()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(day.date).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`${day.student_count} students`}
                          color={getStatusColor(day.status)}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setCalendarDialogOpen(false)} variant="outlined">
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

export default AttendanceManagement; 