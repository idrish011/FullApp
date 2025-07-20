import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { collegeAdminAPI } from '../../api/collegeAdmin';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report', icon: <PeopleIcon /> },
    { value: 'performance', label: 'Performance Report', icon: <AssessmentIcon /> },
    { value: 'enrollment', label: 'Enrollment Report', icon: <SchoolIcon /> },
    { value: 'financial', label: 'Fee Management Report', icon: <MoneyIcon /> },
    { value: 'graduation', label: 'Graduation Report', icon: <TrendingUpIcon /> },
  ];

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  useEffect(() => {
    loadReport();
  }, [selectedReport, selectedPeriod]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await collegeAdminAPI.getReports(selectedReport, {
        period: selectedPeriod,
      });
      setReportData(response);
    } catch (error) {
      console.error('Failed to load report:', error);
      setError('Failed to load report. Please try again.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Implementation for downloading report
    console.log('Downloading report...');
  };

  const handlePrint = () => {
    // Implementation for printing report
    console.log('Printing report...');
  };

  const handleEmail = () => {
    // Implementation for emailing report
    console.log('Emailing report...');
  };

  const renderAttendanceReport = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overall Attendance Rate
            </Typography>
            <Typography variant="h3" color="primary">
              {reportData?.overallRate || 0}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Average attendance across all courses
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Students
            </Typography>
            <Typography variant="h3" color="success.main">
              {reportData?.totalStudents || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Students tracked for attendance
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Performing Courses
            </Typography>
            <List dense>
              {reportData?.topCourses?.map((course, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={course.name}
                    secondary={`${course.attendance_rate}% attendance`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Attendance by Course
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell align="right">Average Attendance</TableCell>
                    <TableCell align="right">Total Students</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.courseStats?.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell align="right">{course.attendance_rate}%</TableCell>
                      <TableCell align="right">{course.total_students}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={course.attendance_rate >= 90 ? 'Excellent' : 
                                 course.attendance_rate >= 80 ? 'Good' : 
                                 course.attendance_rate >= 70 ? 'Fair' : 'Poor'}
                          color={course.attendance_rate >= 90 ? 'success' : 
                                 course.attendance_rate >= 80 ? 'primary' : 
                                 course.attendance_rate >= 70 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPerformanceReport = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Average GPA
            </Typography>
            <Typography variant="h3" color="primary">
              {reportData?.averageGPA || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Overall academic performance
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Students
            </Typography>
            <Typography variant="h3" color="success.main">
              {reportData?.totalStudents || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Students with grades
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Grade Distribution
            </Typography>
            <List dense>
              {Object.entries(reportData?.gradeDistribution || {}).map(([grade, count]) => (
                <ListItem key={grade}>
                  <ListItemText
                    primary={`${grade} Grade`}
                    secondary={`${count} students`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Performing Students
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell align="right">GPA</TableCell>
                    <TableCell align="right">Rank</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.topStudents?.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                      <TableCell>{student.course_name}</TableCell>
                      <TableCell align="right">{student.gpa}</TableCell>
                      <TableCell align="right">#{index + 1}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderEnrollmentReport = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Enrollment
            </Typography>
            <Typography variant="h3" color="primary">
              {reportData?.totalEnrollment || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Current student enrollment
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              New Admissions
            </Typography>
            <Typography variant="h3" color="success.main">
              {reportData?.newAdmissions || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This period
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Enrollment by Course
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell align="right">Enrolled Students</TableCell>
                    <TableCell align="right">Capacity</TableCell>
                    <TableCell align="right">Utilization</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.courseEnrollment?.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell align="right">{course.enrolled_students}</TableCell>
                      <TableCell align="right">{course.capacity || 'N/A'}</TableCell>
                      <TableCell align="right">
                        {course.capacity ? (
                          <Chip
                            label={`${Math.round((course.enrolled_students / course.capacity) * 100)}%`}
                            color={course.enrolled_students / course.capacity >= 0.9 ? 'error' : 
                                   course.enrolled_students / course.capacity >= 0.7 ? 'warning' : 'success'}
                            size="small"
                          />
                        ) : (
                          <Chip label="N/A" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFinancialReport = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h3" color="success.main">
              ${(reportData?.totalRevenue || 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This period
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Outstanding Fees
            </Typography>
            <Typography variant="h3" color="error.main">
              ${(reportData?.outstandingFees || 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Pending collections
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Fee Collection Summary
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fee Type</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                    <TableCell align="right">Collected</TableCell>
                    <TableCell align="right">Pending</TableCell>
                    <TableCell align="right">Collection Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.feeSummary?.map((fee, index) => (
                    <TableRow key={index}>
                      <TableCell>{fee.fee_type}</TableCell>
                      <TableCell align="right">${fee.total_amount.toLocaleString()}</TableCell>
                      <TableCell align="right">${fee.collected_amount.toLocaleString()}</TableCell>
                      <TableCell align="right">${fee.pending_amount.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${Math.round((fee.collected_amount / fee.total_amount) * 100)}%`}
                          color={fee.collected_amount / fee.total_amount >= 0.9 ? 'success' : 
                                 fee.collected_amount / fee.total_amount >= 0.7 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderGraduationReport = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Graduation Rate
            </Typography>
            <Typography variant="h3" color="primary">
              {reportData?.graduationRate || 0}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Overall graduation rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Graduates This Year
            </Typography>
            <Typography variant="h3" color="success.main">
              {reportData?.graduatesThisYear || 0}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total graduates
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Graduation by Course
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell align="right">Graduates</TableCell>
                    <TableCell align="right">Graduation Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.courseGraduation?.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell align="right">{course.graduates}</TableCell>
                      <TableCell align="right">{course.graduation_rate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'attendance':
        return renderAttendanceReport();
      case 'performance':
        return renderPerformanceReport();
      case 'enrollment':
        return renderEnrollmentReport();
      case 'financial':
        return renderFinancialReport();
      case 'graduation':
        return renderGraduationReport();
      default:
        return <Typography>Select a report type</Typography>;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Reports & Analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Report Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }} >
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                label="Report Type"
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center">
                      {type.icon}
                      <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} >
            <FormControl fullWidth>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                label="Time Period"
              >
                {periods.map((period) => (
                  <MenuItem key={period.value} value={period.value}>
                    {period.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} >
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Print
              </Button>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={handleEmail}
              >
                Email
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        renderReportContent()
      )}
    </Box>
  );
};

export default ReportsAnalytics; 