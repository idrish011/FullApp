import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Container,
  Stack,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { adminAPI } from '../api/admin';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load dashboard stats from API
      const response = await adminAPI.getDashboardStats();
      setStats(response.stats || {});
      
      // Convert recent activity to the expected format
      const recentUsers = response.recentActivity?.users || [];
      const recentColleges = response.recentActivity?.colleges || [];
      
      // Combine and format recent activity
      const formattedActivity = [
        ...recentUsers.map(user => ({
          id: user.id,
          message: `New user registered: ${user.first_name} ${user.last_name}`,
          timestamp: user.created_at,
          status: 'info'
        })),
        ...recentColleges.map(college => ({
          id: college.id,
          message: `New college added: ${college.name}`,
          timestamp: college.created_at,
          status: 'success'
        }))
      ];
      
      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError('Failed to load dashboard data. Please try again.');
      setStats({});
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <NotificationsIcon color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

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
              background: (theme) => theme.palette.header,
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
                  <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '2rem' }}>
                    Admin Dashboard
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
          </Paper>
        </Box>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalUsers?.toLocaleString()}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      Total Colleges
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalColleges}
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      Total Students
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalStudents?.toLocaleString()}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="dashboardCard">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="inherit" gutterBottom>
                      Total Teachers
                    </Typography>
                    <Typography variant="h4">
                      {stats?.totalTeachers?.toLocaleString()}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* System Status and Recent Activity */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Users: <Chip label={stats?.totalUsers} color="primary" size="small" />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Colleges: <Chip label={stats?.totalColleges} color="success" size="small" />
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Students: {stats?.totalStudents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Teachers: {stats?.totalTeachers}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getStatusIcon(activity.status || activity.action)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <>
                            <strong>{activity.user_email}</strong> ({activity.user_role})
                            {': '}
                            <span style={{ textTransform: 'capitalize' }}>{activity.action.replace(/_/g, ' ')}</span>
                            {activity.entity ? ` (${activity.entity})` : ''}
                          </>
                        }
                        secondary={new Date(activity.timestamp).toLocaleString()}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No recent activity"
                      secondary="Activity will appear here as it occurs."
                    />
                  </ListItem>
                )}
              </List>
              <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={() => navigate('/activity-logs')}>
                View All Activity
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 