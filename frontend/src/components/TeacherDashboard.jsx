import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
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
  Stack,
  AlertTitle,
  Container
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
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
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AssignmentTurnedIn as SubmittedIcon,
  AssignmentLate as LateIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as TrophyIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { teacherAPI } from '../api/teacher';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [teacherStats, setTeacherStats] = useState({});
  const [classes, setClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [pendingGrading, setPendingGrading] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to access the dashboard.');
        setLoading(false);
        return;
      }

      // Load dashboard data from API
      const [statsResponse, classesResponse, assignmentsResponse, attendanceResponse, gradingResponse, notificationsResponse] = await Promise.all([
        teacherAPI.getDashboardStats().catch(err => ({ stats: {} })),
        teacherAPI.getClasses().catch(err => ({ classes: [] })),
        teacherAPI.getAssignments().catch(err => ({ assignments: [] })),
        teacherAPI.getAttendanceOverview().catch(err => ({ attendance: [] })),
        teacherAPI.getPendingGrading().catch(err => ({ assignments: [] })),
        teacherAPI.getNotifications().catch(err => ({ notifications: [] }))
      ]);

      setTeacherStats(statsResponse.stats || {});
      setClasses(classesResponse.classes || []);
      setRecentAssignments(assignmentsResponse.assignments || []);
      setAttendanceData(attendanceResponse.attendance || []);
      setPendingGrading(gradingResponse.assignments || []);
      setNotifications(notificationsResponse.notifications || []);

      // Generate mock data for enhanced features
      generateMockData();

      // Check if we got any real data
      const hasRealData = statsResponse.stats && Object.keys(statsResponse.stats).length > 0;
      if (!hasRealData) {
        setError('No teacher data found. Please ensure you are logged in as a teacher and have assigned classes.');
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. You must be logged in as a teacher.');
      } else if (error.response?.status === 404) {
        setError('Teacher data not found. Please contact your administrator.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Grade distribution data
    setGradeDistribution([
      { grade: 'A', count: 15, percentage: 25 },
      { grade: 'B', count: 22, percentage: 37 },
      { grade: 'C', count: 18, percentage: 30 },
      { grade: 'D', count: 4, percentage: 7 },
      { grade: 'F', count: 1, percentage: 1 }
    ]);

    // Performance trends (last 6 months)
    setPerformanceTrends([
      { month: 'Jan', attendance: 92, grades: 78 },
      { month: 'Feb', attendance: 89, grades: 81 },
      { month: 'Mar', attendance: 94, grades: 83 },
      { month: 'Apr', attendance: 91, grades: 85 },
      { month: 'May', attendance: 88, grades: 87 },
      { month: 'Jun', attendance: 95, grades: 89 }
    ]);

    // Upcoming deadlines
    setUpcomingDeadlines([
      { id: 1, title: 'Mid-term Exam Grading', due: '2024-01-15', type: 'grading', priority: 'high' },
      { id: 2, title: 'Assignment Submission Review', due: '2024-01-18', type: 'review', priority: 'medium' },
      { id: 3, title: 'Final Project Evaluation', due: '2024-01-25', type: 'evaluation', priority: 'high' },
      { id: 4, title: 'Attendance Report', due: '2024-01-20', type: 'report', priority: 'low' }
    ]);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'error';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysUntil = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'success';
      case 'B':
        return 'primary';
      case 'C':
        return 'warning';
      case 'D':
        return 'info';
      case 'F':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateOverallPerformance = () => {
    const attendance = teacherStats.attendanceRate || 0;
    const grades = teacherStats.averageGrade || 0;
    const completion = teacherStats.pendingGrading ? 
      ((teacherStats.totalAssignments - teacherStats.pendingGrading) / teacherStats.totalAssignments) * 100 : 0;
    
    return Math.round((attendance + grades + completion) / 3);
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
      {/* Main Container */}
      <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Dashboard Header */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: 4,
              background: (theme) => theme.palette.header || theme.palette.primary.main,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
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
                  <DashboardIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    Teacher Dashboard
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Welcome back! Here's your comprehensive overview
                  </Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Stack direction="row" spacing={2}>
                    <Chip 
                      icon={<CheckCircleOutlineIcon />} 
                      label="Active" 
                      color="success" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip 
                      icon={<AccessTimeIcon />} 
                      label="Last updated: Today" 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Stack>
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
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: 28 }
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: 28 }
            }}
          >
            {success}
          </Alert>
        )}
        {/* Helpful message when no data */}
        {!loading && !error && classes.length === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: 28 }
            }}
          >
            <AlertTitle sx={{ fontWeight: 600 }}>Welcome to your Teacher Dashboard!</AlertTitle>
            It looks like you don't have any classes assigned yet. Here's what you can do:
            <ul style={{ marginTop: '12px', marginBottom: '0', paddingLeft: '20px' }}>
              <li>Contact your administrator to get assigned to classes</li>
              <li>Once assigned, you'll see your classes, students, and statistics here</li>
              <li>You'll be able to create assignments, take attendance, and manage grades</li>
            </ul>
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Students */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="students">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <PeopleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Total Students
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {teacherStats.totalStudents || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Across {teacherStats.totalClasses || 0} Classes
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Average Grade */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="grades">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <GradeIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Average Grade
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {teacherStats.averageGrade || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      +2.1% from last semester
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Attendance Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="attendance">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <ScheduleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Attendance Rate
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {teacherStats.attendanceRate || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Overall attendance
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Pending Grading */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="grading">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <AssignmentIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Pending Grading
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {teacherStats.pendingGrading || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Assignments to grade
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Sections */}
        <Grid container spacing={4}>
          {/* Left Column: Assignments, Attendance */}
          <Grid item xs={12} lg={8}>
            {/* Assignments Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.background.paper,
                border: (theme) => theme.palette.card?.border || '1px solid #eee',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
                  Recent Assignments
                </Typography>
                <Chip 
                  label={`${recentAssignments.length} total`} 
                  color="primary" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
              <List sx={{ p: 0 }}>
                {recentAssignments.slice(0, 5).map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.02)',
                          transition: 'background-color 0.2s ease'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48
                          }}
                        >
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'text.primary' }}>
                            {assignment.title}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                              {assignment.class_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Due: {formatDate(assignment.due_date)} ({getDaysUntil(assignment.due_date)} days)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {assignment.submitted_count}/{assignment.total_students} submitted
                            </Typography>
                          </Stack>
                        }
                      />
                      <Chip 
                        label={assignment.status} 
                        color={getStatusColor(assignment.status)} 
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    {index < Math.min(recentAssignments.length, 5) - 1 && (
                      <Divider variant="inset" component="li" sx={{ mx: 2 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            {/* Attendance Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.background.paper,
                border: (theme) => theme.palette.card?.border || '1px solid #eee',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
                  Attendance Overview
                </Typography>
                <Chip 
                  label={`${attendanceData.length} records`} 
                  color="info" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
              <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Present</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Absent</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData.map((attendance) => (
                      <TableRow 
                        key={attendance.id}
                        sx={{ 
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.02)',
                            transition: 'background-color 0.2s ease'
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{attendance.class_name}</TableCell>
                        <TableCell>{formatDate(attendance.date)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {attendance.present_count}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'error.main' }}>
                          {attendance.absent_count}
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${attendance.attendance_rate}%`} 
                            color={getAttendanceColor(attendance.attendance_rate)} 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Right Column: Analytics, Notifications */}
          <Grid item xs={12} lg={4}>
            {/* Analytics Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.background.paper,
                border: (theme) => theme.palette.card?.border || '1px solid #eee',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
                Analytics & Insights
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                    Overall Performance
                  </Typography>
                  <Box display="flex" alignItems="center" gap={3}>
                    <CircularProgress 
                      variant="determinate" 
                      value={calculateOverallPerformance()} 
                      size={80} 
                      thickness={4} 
                      color="primary"
                      sx={{ 
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round'
                        }
                      }}
                    />
                    <Box>
                      <Typography variant="h3" color="primary.main" fontWeight={800}>
                        {calculateOverallPerformance()}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Based on attendance, grades, and assignment completion
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                    Top Performing Class
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      <TrophyIcon />
                    </Avatar>
                    <Typography variant="body1" fontWeight={600}>
                      Advanced Mathematics
                    </Typography>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                    Student Satisfaction
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                      <StarIcon />
                    </Avatar>
                    <Typography variant="body1" fontWeight={600}>
                      4.2/5
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Notifications Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.background.paper,
                border: (theme) => theme.palette.card?.border || '1px solid #eee',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>
                  Notifications
                </Typography>
                <Chip 
                  label={`${notifications.length} new`} 
                  color="secondary" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem 
                      alignItems="flex-start" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.02)',
                          transition: 'background-color 0.2s ease'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: notification.type === 'warning' ? 'warning.main' : 'primary.main',
                            width: 48,
                            height: 48
                          }}
                        >
                          {notification.type === 'warning' ? <WarningIcon /> : <NotificationsIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'text.primary' }}>
                            {notification.title}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(notification.created_at)}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Chip 
                        label={notification.type} 
                        color={notification.type === 'warning' ? 'warning' : 'primary'} 
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    {index < notifications.length - 1 && (
                      <Divider variant="inset" component="li" sx={{ mx: 2 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TeacherDashboard; 