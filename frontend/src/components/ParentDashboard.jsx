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
  AttachMoney as MoneyIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  People as ChildIcon,
} from '@mui/icons-material';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [parentStats, setParentStats] = useState({});
  const [children, setChildren] = useState([]);
  const [academicProgress, setAcademicProgress] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [feeData, setFeeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

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
      setParentStats({});
      setChildren([]);
      setAcademicProgress([]);
      setAssignments([]);
      setFeeData([]);
      setAttendanceData([]);
      setNotifications([]);
      setUpcomingEvents([]);
    } catch (error) {
      console.error('Dashboard loading error:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
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
                  <PeopleIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    Parent Dashboard
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Welcome! Here is your family's academic overview
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
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <PeopleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Children
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {parentStats.totalChildren || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Enrolled Students
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
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <GradeIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Average Grade
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {parentStats.averageGrade || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Combined average
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
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <ScheduleIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Attendance Rate
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      {parentStats.attendanceRate || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Combined attendance
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="dashboardCard" color="fees">
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56, backdropFilter: 'blur(10px)' }}>
                    <MoneyIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Pending Fees
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      ${parentStats.pendingFees || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Due payments
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Children Overview */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            My Children
          </Typography>
          <Grid container spacing={3}>
            {children.map((child) => (
              <Grid size={{ xs: 12, md: 6 }} key={child.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                        <ChildIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{child.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {child.grade} • Age {child.age}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="textSecondary">
                          GPA
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {child.gpa}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="textSecondary">
                          Attendance
                        </Typography>
                        <Typography variant="h6" color="info.main">
                          {child.attendanceRate}%
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="textSecondary">
                          Courses
                        </Typography>
                        <Typography variant="body1">
                          {child.courses}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2" color="textSecondary">
                          Assignments
                        </Typography>
                        <Typography variant="body1">
                          {child.assignments}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box display="flex" gap={1}>
                      <Button size="small" variant="outlined" startIcon={<ViewIcon />}>
                        View Progress
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<MessageIcon />}>
                        Contact Teacher
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<MoneyIcon />}>
                        Pay Fees
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

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
                startIcon={<MoneyIcon />}
                sx={{ py: 2 }}
              >
                Pay Fees
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<MessageIcon />}
                sx={{ py: 2 }}
              >
                Contact Teachers
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ScheduleIcon />}
                sx={{ py: 2 }}
              >
                Schedule Meeting
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AssessmentIcon />}
                sx={{ py: 2 }}
              >
                View Reports
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Main Content Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Overview" />
            <Tab label="Academic Progress" />
            <Tab label="Assignments" />
            <Tab label="Fees" />
            <Tab label="Attendance" />
            <Tab label="Events" />
            <Tab label="Notifications" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Grid container spacing={3}>
                {/* Upcoming Events */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Events
                  </Typography>
                  <List>
                    {upcomingEvents.map((event, index) => (
                      <React.Fragment key={event.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <CalendarIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={event.title}
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body2" color="textPrimary">
                                  {event.child} • {event.teacher}
                                </Typography>
                                <Typography variant="caption" display="block" color="textSecondary">
                                  {formatDate(event.date)} {formatTime(event.date)}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          <Chip
                            label={event.type}
                            color={event.type === 'meeting' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </ListItem>
                        {index < upcomingEvents.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>

                {/* Recent Notifications */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Notifications
                  </Typography>
                  <List>
                    {notifications.slice(0, 3).map((notification, index) => (
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
                        </ListItem>
                        {index < 2 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>

                {/* Performance Summary */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Performance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Courses
                          </Typography>
                          <Typography variant="h4" color="primary.main">
                            {parentStats.totalCourses}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Across all children
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Assignments
                          </Typography>
                          <Typography variant="h4" color="info.main">
                            {parentStats.totalAssignments}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Pending and completed
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Fees Paid
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            ${(parentStats.totalFees || 0).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            This academic year
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Upcoming Events
                          </Typography>
                          <Typography variant="h4" color="warning.main">
                            {parentStats.upcomingEvents || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            This month
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
                  Academic Progress
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Track your children's academic performance across all courses.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Child</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Teacher</TableCell>
                        <TableCell align="right">Grade</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                        <TableCell>Last Updated</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {academicProgress.map((progress) => (
                        <TableRow key={progress.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {progress.child}
                            </Typography>
                          </TableCell>
                          <TableCell>{progress.course}</TableCell>
                          <TableCell>{progress.teacher}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={progress.grade}
                              color={getGradeColor(progress.grade)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{progress.percentage}%</TableCell>
                          <TableCell>{formatDate(progress.lastUpdated)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Contact Teacher">
                              <IconButton size="small" color="primary">
                                <MessageIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Report">
                              <IconButton size="small" color="info">
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

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Assignments
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Monitor your children's assignment progress and deadlines.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Child</TableCell>
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
                              {assignment.child}
                            </Typography>
                          </TableCell>
                          <TableCell>{assignment.title}</TableCell>
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
                            <Tooltip title="Contact Teacher">
                              <IconButton size="small" color="primary">
                                <MessageIcon />
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

            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Fee Management
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Track and manage fee payments for your children.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Child</TableCell>
                        <TableCell>Fee Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Paid Date</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feeData.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {fee.child}
                            </Typography>
                          </TableCell>
                          <TableCell>{fee.feeType}</TableCell>
                          <TableCell align="right">${fee.amount}</TableCell>
                          <TableCell>{formatDate(fee.dueDate)}</TableCell>
                          <TableCell>
                            <Chip
                              label={fee.status}
                              color={getStatusColor(fee.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {fee.paidDate ? formatDate(fee.paidDate) : '-'}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {fee.status === 'pending' && (
                              <Tooltip title="Pay Now">
                                <IconButton size="small" color="success">
                                  <MoneyIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Download Receipt">
                              <IconButton size="small" color="info">
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
                  Attendance Records
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Monitor your children's attendance across all courses.
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Child</TableCell>
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
                              {attendance.child}
                            </Typography>
                          </TableCell>
                          <TableCell>{attendance.course}</TableCell>
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
                            <Tooltip title="Contact Teacher">
                              <IconButton size="small" color="primary">
                                <MessageIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Report">
                              <IconButton size="small" color="info">
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
                  Upcoming Events
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Stay informed about school events and activities.
                </Typography>
                
                <Grid container spacing={3}>
                  {upcomingEvents.map((event) => (
                    <Grid size={{ xs: 12, md: 6 }} key={event.id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {event.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {event.child} • {event.teacher}
                              </Typography>
                            </Box>
                            <Chip
                              label={event.type}
                              color={event.type === 'meeting' ? 'primary' : 'secondary'}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            {formatDate(event.date)} {formatTime(event.date)}
                          </Typography>

                          <Box display="flex" gap={1}>
                            <Button size="small" variant="outlined" startIcon={<CalendarIcon />}>
                              Add to Calendar
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<MessageIcon />}>
                              Contact Organizer
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                              Download Details
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 6 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Stay updated with important notifications about your children.
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

export default ParentDashboard; 