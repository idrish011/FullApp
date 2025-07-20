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
  Container,
  Stack,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collegeAdminAPI } from '../api/collegeAdmin';

const CollegeAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [dashboardStats, setDashboardStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingAdmissions, setPendingAdmissions] = useState([]);
  const [feeStats, setFeeStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
    loadFeeStats();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch dashboard stats from backend
      const res = await collegeAdminAPI.getDashboardStats();
      setDashboardStats({
        totalStudents: res.stats?.total_students || 0,
        activeStudents: res.stats?.active_students || 0,
        totalTeachers: res.stats?.total_teachers || 0,
        totalCourses: res.stats?.total_courses || 0,
        monthlyRevenue: res.stats?.total_revenue || 0,
        attendanceRate: res.stats?.attendance_rate || 0,
        pendingAdmissions: res.stats?.pending_admissions || 0,
      });
      setRecentActivities([]);
      setPendingAdmissions([]);
    } catch (error) {
      console.error('Dashboard loading error:', error);
      let backendMsg = '';
      if (error.response && error.response.data) {
        backendMsg = error.response.data.message || error.response.data.error || '';
      }
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setError('Session expired or unauthorized. Please log in again. ' + (backendMsg ? `Backend: ${backendMsg}` : ''));
      } else {
        setError('Failed to load dashboard data.' + (backendMsg ? ` Backend: ${backendMsg}` : ' Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFeeStats = async () => {
    try {
      const res = await collegeAdminAPI.getStudentFeeSummary();
      setFeeStats(res);
    } catch (e) {
      setFeeStats(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'warning':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'admission':
        return <PersonIcon />;
      case 'course':
        return <BookIcon />;
      case 'fee':
        return <MoneyIcon />;
      case 'attendance':
        return <ScheduleIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'students':
        navigate('/students');
        break;
      case 'teachers':
        navigate('/teachers');
        break;
      case 'courses':
        navigate('/courses');
        break;
      case 'reports':
        navigate('/reports');
        break;
      default:
        break;
    }
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
                    College Admin Dashboard
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Welcome! Here is your institution's overview
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
            <Card variant="dashboardCard" color="students" sx={{
              background: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
              boxShadow: 3,
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 8,
              },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'primary.main', width: 56, height: 56, boxShadow: 1 }}>
                    <PeopleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Total Students
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                      {(dashboardStats.totalStudents || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      +{dashboardStats.activeStudents || 0} Active
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="teachers" sx={{
              background: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
              boxShadow: 3,
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 8,
              },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'secondary.main', width: 56, height: 56, boxShadow: 1 }}>
                    <SchoolIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Total Teachers
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                      {dashboardStats.totalTeachers || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Active Teachers
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="courses" sx={{
              background: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
              boxShadow: 3,
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 8,
              },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'primary.main', width: 56, height: 56, boxShadow: 1 }}>
                    <AssignmentIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Total Courses
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                      {dashboardStats.totalCourses || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Active Courses
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="revenue" sx={{
              background: (theme) => theme.palette.background.paper,
              color: (theme) => theme.palette.text.primary,
              boxShadow: 3,
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 8,
              },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'success.main', width: 56, height: 56, boxShadow: 1 }}>
                    <MoneyIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Monthly Revenue
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                      ${(dashboardStats.monthlyRevenue || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      +12.5% from last month
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Fee Management Stats Row */}
        {feeStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card variant="dashboardCard" color="revenue" sx={{
                background: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3,
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 8,
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'primary.main', width: 48, height: 48, boxShadow: 1 }}>
                      <MoneyIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Total Assigned
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>{feeStats.total_assigned?.total?.toLocaleString() || 0}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card variant="dashboardCard" color="revenue" sx={{
                background: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3,
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 8,
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'secondary.main', width: 48, height: 48, boxShadow: 1 }}>
                      <TrendingUpIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Total Collected
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>{feeStats.total_collected?.collected?.toLocaleString() || 0}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card variant="dashboardCard" color="warning" sx={{
                background: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3,
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 8,
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'warning.main', width: 48, height: 48, boxShadow: 1 }}>
                      <WarningIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Overdue
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>{feeStats.overdue?.overdue?.toLocaleString() || 0}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card variant="dashboardCard" color="warning" sx={{
                background: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3,
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 8,
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'primary.main', width: 48, height: 48, boxShadow: 1 }}>
                      <MoneyIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Due
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>{feeStats.due?.due?.toLocaleString() || 0}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card variant="dashboardCard" color="success" sx={{
                background: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
                boxShadow: 3,
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 8,
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'success.main', width: 48, height: 48, boxShadow: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Paid
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>{feeStats.paid?.paid?.toLocaleString() || 0}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
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
                startIcon={<AddIcon />}
                sx={{ py: 2 }}
                onClick={() => handleQuickAction('students')}
              >
                Manage Students
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SchoolIcon />}
                sx={{ py: 2 }}
                onClick={() => handleQuickAction('teachers')}
              >
                Manage Teachers
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AssignmentIcon />}
                sx={{ py: 2 }}
                onClick={() => handleQuickAction('courses')}
              >
                Manage Courses
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AssessmentIcon />}
                sx={{ py: 2 }}
                onClick={() => handleQuickAction('reports')}
              >
                View Reports
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Recent Activities */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="textPrimary">
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" display="block" color="textSecondary">
                                {new Date(activity.timestamp).toLocaleString()}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                        <Chip
                          label={activity.status}
                          color={getStatusColor(activity.status)}
                          size="small"
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No recent activities"
                      secondary="Activities will appear here as they occur"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
          {/* Performance Metrics */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="dashboardCard" color="attendance">
                    <CardContent>
                      <Typography color="inherit" gutterBottom>
                        Attendance Rate
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {dashboardStats.attendanceRate || 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="dashboardCard" color="completion">
                    <CardContent>
                      <Typography color="inherit" gutterBottom>
                        Course Completion
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {dashboardStats.completionRate || 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="dashboardCard" color="pending">
                    <CardContent>
                      <Typography color="inherit" gutterBottom>
                        Pending Admissions
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {dashboardStats.pendingAdmissions || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card variant="dashboardCard" color="revenue">
                    <CardContent>
                      <Typography color="inherit" gutterBottom>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        ${(dashboardStats.totalRevenue || 0).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CollegeAdminDashboard; 