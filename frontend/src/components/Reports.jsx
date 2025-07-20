import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageData, setUsageData] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const theme = useTheme();

  const fetchUsageReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/reports/usage?period=${period}`);
      setUsageData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching usage report:', error);
      setError('Failed to fetch usage report');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfitReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/reports/profit?period=${period}`);
      setProfitData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching profit report:', error);
      setError('Failed to fetch profit report');
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/reports/system-health');
      setSystemHealth(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching system health:', error);
      setError('Failed to fetch system health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchUsageReport();
    } else if (activeTab === 1) {
      fetchProfitReport();
    } else if (activeTab === 2) {
      fetchSystemHealth();
    }
  }, [activeTab, period]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'inactive': 'error',
      'pending': 'warning',
      'Fully Paid': 'success',
      'Partially Paid': 'warning',
      'Unpaid': 'error'
    };
    return colors[status] || 'default';
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
        {/* Reports Header */}
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
                  <AssessmentIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    Reports & Analytics
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    View comprehensive reports, analytics, and performance metrics
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
        {/* Period Selector */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Report Period</InputLabel>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  label="Report Period"
                >
                  <MenuItem value="1d">Last 24 Hours</MenuItem>
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="90d">Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  // Export functionality
                }}
              >
                Export Report
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Usage Analytics" />
            <Tab label="Profitability" />
            <Tab label="System Health" />
          </Tabs>
        </Paper>
        {/* Usage Analytics Tab */}
        {activeTab === 0 && (
          <Box>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : usageData ? (
              <>
                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <TrendingUpIcon sx={{ fontSize: 32, color: 'white', opacity: 0.8, mr: 2 }} />
                          <Box>
                            <Typography color="inherit" gutterBottom variant="body2">
                              Total Activities
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(usageData.summary?.total_activities)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                      background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <PeopleIcon sx={{ fontSize: 32, color: 'white', opacity: 0.8, mr: 2 }} />
                          <Box>
                            <Typography color="inherit" gutterBottom variant="body2">
                              Unique Users
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(usageData.summary?.unique_users)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <AssessmentIcon sx={{ fontSize: 32, color: 'white', opacity: 0.8, mr: 2 }} />
                          <Box>
                            <Typography color="inherit" gutterBottom variant="body2">
                              Active Days
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(usageData.summary?.active_days)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                      background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                      color: 'white',
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <SchoolIcon sx={{ fontSize: 32, color: 'white', opacity: 0.8, mr: 2 }} />
                          <Box>
                            <Typography color="inherit" gutterBottom variant="body2">
                              Period
                            </Typography>
                            <Typography variant="h6">
                              {period === '1d' ? '24 Hours' : 
                               period === '7d' ? '7 Days' :
                               period === '30d' ? '30 Days' : '90 Days'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Top Actions */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Top Actions
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Action</TableCell>
                              <TableCell align="right">Count</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {usageData.topActions?.map((action) => (
                              <TableRow key={action.action}>
                                <TableCell>
                                  <Chip label={action.action} size="small" />
                                </TableCell>
                                <TableCell align="right">
                                  {formatNumber(action.count)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Top Users
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>User</TableCell>
                              <TableCell>Role</TableCell>
                              <TableCell align="right">Activities</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {usageData.topUsers?.map((user) => (
                              <TableRow key={user.user_email}>
                                <TableCell>{user.user_email}</TableCell>
                                <TableCell>
                                  <Chip label={user.user_role} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell align="right">
                                  {formatNumber(user.activity_count)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No usage data available
              </Typography>
            )}
          </Box>
        )}

        {/* Profitability Tab */}
        {activeTab === 1 && (
          <Box>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : profitData ? (
              <>
                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <MoneyIcon color="success" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Total Revenue
                            </Typography>
                            <Typography variant="h4">
                              {formatCurrency(profitData.summary?.total_paid)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <AssessmentIcon color="warning" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Outstanding
                            </Typography>
                            <Typography variant="h4">
                              {formatCurrency(profitData.summary?.total_outstanding)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <PeopleIcon color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Total Fees
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(profitData.summary?.total_fees)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <TrendingUpIcon color="info" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Total Amount
                            </Typography>
                            <Typography variant="h4">
                              {formatCurrency(profitData.summary?.total_amount)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* College Financials */}
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    College-wise Financials
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>College</TableCell>
                          <TableCell align="right">Fee Count</TableCell>
                          <TableCell align="right">Total Amount</TableCell>
                          <TableCell align="right">Paid</TableCell>
                          <TableCell align="right">Outstanding</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profitData.collegeFinancials?.map((college) => (
                          <TableRow key={college.college_name}>
                            <TableCell>{college.college_name}</TableCell>
                            <TableCell align="right">{formatNumber(college.fee_count)}</TableCell>
                            <TableCell align="right">{formatCurrency(college.total_amount)}</TableCell>
                            <TableCell align="right">{formatCurrency(college.total_paid)}</TableCell>
                            <TableCell align="right">{formatCurrency(college.outstanding)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                {/* Payment Status */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Payment Status Distribution
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Count</TableCell>
                          <TableCell align="right">Total Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profitData.paymentStatus?.map((status) => (
                          <TableRow key={status.status}>
                            <TableCell>
                              <Chip 
                                label={status.status} 
                                color={getStatusColor(status.status)} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell align="right">{formatNumber(status.count)}</TableCell>
                            <TableCell align="right">{formatCurrency(status.total_amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No profitability data available
              </Typography>
            )}
          </Box>
        )}

        {/* System Health Tab */}
        {activeTab === 2 && (
          <Box>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : systemHealth ? (
              <>
                {/* Database Stats */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <PeopleIcon color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Total Users
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(systemHealth.database?.total_users)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <SchoolIcon color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Total Colleges
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(systemHealth.database?.total_colleges)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <AssessmentIcon color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Total Courses
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(systemHealth.database?.total_courses)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <MoneyIcon color="primary" sx={{ mr: 2 }} />
                          <Box>
                            <Typography color="textSecondary" gutterBottom variant="body2">
                              Total Fees
                            </Typography>
                            <Typography variant="h4">
                              {formatNumber(systemHealth.database?.total_fees)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Active Sessions */}
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Active Sessions (Last 24 Hours)
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Last Activity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {systemHealth.activeSessions?.map((session) => (
                          <TableRow key={session.user_email}>
                            <TableCell>{session.user_email}</TableCell>
                            <TableCell>
                              <Chip label={session.user_role} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              {new Date(session.last_activity).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>

                {/* System Info */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    System Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="textSecondary">
                        System Start Time
                      </Typography>
                      <Typography variant="body1">
                        {systemHealth.systemStart ? 
                          new Date(systemHealth.systemStart).toLocaleString() : 
                          'Unknown'
                        }
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="textSecondary">
                        Report Generated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(systemHealth.timestamp).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No system health data available
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Reports; 