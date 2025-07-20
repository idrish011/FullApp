import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tabs,
  Tab,
  LinearProgress,
  Rating,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Stack,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AssignmentTurnedIn as SubmittedIcon,
  AssignmentLate as LateIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [studentStats, setStudentStats] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load dashboard data from API
      // Note: These API endpoints need to be implemented in the backend
      // For now, we'll set empty data
      setStudentStats({});
      setEnrolledCourses([]);
      setAssignments([]);
      setAttendanceData([]);
      setGrades([]);
    } catch (error) {
      console.error('Dashboard loading error:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [notifications, setNotifications] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'submitted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGradeColor = (grade) => {
    if (grade?.startsWith('A')) return 'success';
    if (grade?.startsWith('B')) return 'primary';
    if (grade?.startsWith('C')) return 'warning';
    return 'error';
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysUntil = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: (theme) => theme.palette.background.gradient || theme.palette.background.default,
        position: 'relative'
      }}
    >
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Dashboard Header */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={0} 
            variant="dashboardHeader"
            sx={{
              background: (theme) => theme.palette.header || theme.palette.primary.main,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={3}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    Student Dashboard
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Welcome! Here is your academic overview
                  </Typography>
                </Box>
              </Stack>
            </Box>
            {/* Decorative elements */}
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -50, 
                right: -50, 
                width: 200, 
                height: 200, 
                borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.1)',
                zIndex: 1
              }} 
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: -30, 
                left: -30, 
                width: 150, 
                height: 150, 
                borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.05)',
                zIndex: 1
              }} 
            />
          </Paper>
        </Box>
        {/* Error/Success/Info Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-icon': { fontSize: 28 } }}>{error}</Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-icon': { fontSize: 28 } }}>{success}</Alert>
        )}
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="students">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}
                  >
                    <StarIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      GPA
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {studentStats.gpa}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {studentStats.totalCredits} Credits
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="grades">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}
                  >
                    <GradeIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Average Grade
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {studentStats.averageGrade}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      +2.1% from last semester
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="attendance">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}
                  >
                    <ScheduleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Attendance Rate
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {studentStats.attendanceRate}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Overall attendance
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="grading">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}
                  >
                    <AssignmentIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Pending Assignments
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {studentStats.pendingAssignments}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Due soon
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<UploadIcon />}
                sx={{ py: 2 }}
              >
                Submit Assignment
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ScheduleIcon />}
                sx={{ py: 2 }}
              >
                View Schedule
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GradeIcon />}
                sx={{ py: 2 }}
              >
                Check Grades
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AssessmentIcon />}
                sx={{ py: 2 }}
              >
                Academic Progress
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Overview" />
            <Tab label="Courses" />
            <Tab label="Assignments" />
            <Tab label="Grades" />
            <Tab label="Attendance" />
            <Tab label="Notifications" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                {/* Recent Assignments */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Assignments
                  </Typography>
                  <List>
                    {assignments.slice(0, 3).map((assignment, index) => (
                      <React.Fragment key={assignment.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <AssignmentIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={assignment.title}
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" color="textPrimary">
                                  {assignment.course}
                                </Typography>
                                <Typography variant="caption" display="block" color="textSecondary">
                                  Due: {formatDate(assignment.dueDate)} ({getDaysUntil(assignment.dueDate)} days)
                                </Typography>
                                {assignment.grade && (
                                  <Typography variant="caption" display="block" color="success.main">
                                    Grade: {assignment.grade}
                                  </Typography>
                                )}
                              </React.Fragment>
                            }
                          />
                          <Chip
                            label={assignment.status}
                            color={getStatusColor(assignment.status)}
                            size="small"
                          />
                        </ListItem>
                        {index < 2 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>

                {/* Course Overview */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    My Courses
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Course</TableCell>
                          <TableCell align="right">Grade</TableCell>
                          <TableCell align="right">Next Class</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {enrolledCourses.slice(0, 4).map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {course.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {course.code} • {course.instructor}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={course.grade}
                                color={getGradeColor(course.grade)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              {formatTime(course.nextClass)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Academic Progress */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Academic Progress
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Completed Assignments
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            {studentStats.completedAssignments}/{studentStats.totalAssignments}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(studentStats.completedAssignments / studentStats.totalAssignments) * 100}
                            sx={{ mt: 1 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Credits
                          </Typography>
                          <Typography variant="h4" color="primary.main">
                            {studentStats.totalCredits}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            This semester
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Average Grade
                          </Typography>
                          <Typography variant="h4" color="info.main">
                            {studentStats.averageGrade}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Current semester
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Attendance Rate
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            {studentStats.attendanceRate}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Overall attendance
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  My Courses
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  View your enrolled courses, grades, and course materials.
                </Typography>
                
                <Grid container spacing={3}>
                  {enrolledCourses.map((course) => (
                    <Grid size={{ xs: 12, md: 6 }} key={course.id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {course.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {course.code} • {course.instructor}
                              </Typography>
                            </Box>
                            <Chip
                              label={course.grade}
                              color={getGradeColor(course.grade)}
                              size="small"
                            />
                          </Box>
                          
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 6 }}>
                              <Typography variant="body2" color="textSecondary">
                                Credits
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {course.credits}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography variant="body2" color="textSecondary">
                                Grade %
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {course.percentage}%
                              </Typography>
                            </Grid>
                          </Grid>

                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Next Class: {formatDate(course.nextClass)} {formatTime(course.nextClass)}
                          </Typography>

                          <Box display="flex" gap={1}>
                            <Button size="small" variant="outlined" startIcon={<ViewIcon />}>
                              View Details
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                              Materials
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<ScheduleIcon />}>
                              Schedule
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Assignments
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Track your assignments, deadlines, and submissions.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Assignment</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Grade</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {assignment.title}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {assignment.description}
                            </Typography>
                          </TableCell>
                          <TableCell>{assignment.course}</TableCell>
                          <TableCell>
                            {formatDate(assignment.dueDate)}
                            <Typography variant="caption" display="block" color="textSecondary">
                              {getDaysUntil(assignment.dueDate)} days left
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={assignment.status}
                              color={getStatusColor(assignment.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {assignment.grade ? (
                              <Chip
                                label={assignment.grade}
                                color={getGradeColor(assignment.grade)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {!assignment.submitted && (
                              <Tooltip title="Submit Assignment">
                                <IconButton size="small" color="primary">
                                  <UploadIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {assignment.grade && (
                              <Tooltip title="View Feedback">
                                <IconButton size="small" color="info">
                                  <AssessmentIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Grades & Feedback
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  View your grades, feedback, and academic performance.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Assignment</TableCell>
                        <TableCell align="right">Grade</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                        <TableCell>Feedback</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {grades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {grade.course}
                            </Typography>
                          </TableCell>
                          <TableCell>{grade.assignment}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={grade.grade}
                              color={getGradeColor(grade.grade)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{grade.percentage}%</TableCell>
                          <TableCell>
                            <Typography variant="body2" color="textSecondary">
                              {grade.feedback}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton size="small" color="primary">
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeTab === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Attendance Record
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Track your attendance across all courses.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell align="right">Present</TableCell>
                        <TableCell align="right">Total Classes</TableCell>
                        <TableCell align="right">Attendance %</TableCell>
                        <TableCell>Last Attendance</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendanceData.map((attendance) => (
                        <TableRow key={attendance.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {attendance.course}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{attendance.present}</TableCell>
                          <TableCell align="right">{attendance.total}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${attendance.percentage}%`}
                              color={getAttendanceColor(attendance.percentage)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(attendance.lastAttendance)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Report">
                              <IconButton size="small" color="primary">
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeTab === 5 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Stay updated with important notifications and alerts.
                </Typography>
                
                <List>
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Badge
                            color="error"
                            variant="dot"
                            invisible={notification.read}
                          >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <NotificationsIcon />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="textPrimary">
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" display="block" color="textSecondary">
                                {new Date(notification.timestamp).toLocaleString()}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                        <FormControlLabel
                          control={<Switch size="small" checked={notification.read} />}
                          label=""
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentDashboard; 