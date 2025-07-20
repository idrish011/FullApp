import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import GradeIcon from '@mui/icons-material/Grade';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ChildIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import CollegeManagement from './components/CollegeManagement';
import PasswordManagement from './components/PasswordManagement';
import ActivityLogs from './components/ActivityLogs';
import Reports from './components/Reports';
import CollegeAdminDashboard from './components/CollegeAdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import StudentManagementPage from './components/college-admin/StudentManagementPage';
import TeacherManagementPage from './components/college-admin/TeacherManagementPage';
import CourseManagementPage from './components/college-admin/CourseManagementPage';
import ReportsPage from './pages/college-admin/ReportsPage';
import AdmissionInquiryPage from './components/college-admin/AdmissionInquiryPage';
import AssignmentManagementPage from './components/teacher/AssignmentManagementPage';
import AttendanceManagementPage from './components/teacher/AttendanceManagementPage';
import AssignmentReviewPage from './components/teacher/AssignmentReviewPage';
import AcademicManagementPage from './components/college-admin/AcademicManagementPage';
import GradesManagement from './components/teacher/GradesManagement';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import ThemeSelector from './components/ThemeSelector';
import FeeManagementPage from './pages/college-admin/FeeManagementPage';
import MessagesPage from './components/Messages';
import LandingPageCollegesPage from './components/LandingPageColleges';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    header: {
      main: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Navigation component with role-based menu
function Navigation() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const getRoleBasedNavigation = () => {
    if (!user) return [];

    switch (user.role) {
      case 'super_admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
          { label: 'Users', path: '/users', icon: <PeopleIcon /> },
          { label: 'Colleges', path: '/colleges', icon: <SchoolIcon /> },
          { label: 'Landing Colleges', path: '/landing-colleges', icon: <SchoolIcon /> },
          { label: 'Messages', path: '/messages', icon: <MessageIcon /> },
          { label: 'Passwords', path: '/passwords', icon: <SecurityIcon /> },
          { label: 'Activity Logs', path: '/activity-logs', icon: <HistoryIcon /> },
          { label: 'Reports', path: '/reports', icon: <AssessmentIcon /> }
        ];
      case 'college_admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
          { label: 'Students', path: '/students', icon: <PeopleIcon /> },
          { label: 'Teachers', path: '/teachers', icon: <SchoolIcon /> },
          { label: 'Academic Management', path: '/academic-management', icon: <AssignmentIcon /> },
          { label: 'Messages', path: '/messages', icon: <MessageIcon /> },
          { label: 'Reports', path: '/reports', icon: <GradeIcon /> },
          { label: 'Admission Inquiry', path: '/admission-inquiry', icon: <SecurityIcon /> },
          { label: 'Fee Management', path: '/fee-management', icon: <SecurityIcon /> }
        ];
      case 'teacher':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
          { label: 'Assignments', path: '/assignments', icon: <AssignmentIcon /> },
          { label: 'Attendance', path: '/attendance', icon: <ScheduleIcon /> },
          { label: 'Grades', path: '/grades', icon: <GradeIcon /> },
          { label: 'Messages', path: '/messages', icon: <MessageIcon /> }
        ];
      case 'student':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
          { label: 'Courses', path: '/courses', icon: <AssignmentIcon /> },
          { label: 'Assignments', path: '/assignments', icon: <AssignmentIcon /> },
          { label: 'Grades', path: '/grades', icon: <GradeIcon /> },
          { label: 'Schedule', path: '/schedule', icon: <ScheduleIcon /> }
        ];
      case 'parent':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
          { label: 'Children', path: '/children', icon: <ChildIcon /> },
          { label: 'Progress', path: '/progress', icon: <GradeIcon /> },
          { label: 'Fees', path: '/fees', icon: <SecurityIcon /> },
          { label: 'Events', path: '/events', icon: <ScheduleIcon /> }
        ];
      default:
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> }
        ];
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'college_admin': return 'College Admin';
      case 'teacher': return 'Teacher';
      case 'student': return 'Student';
      case 'parent': return 'Parent';
      default: return 'User';
    }
  };

  const navigationItems = getRoleBasedNavigation();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: (theme) => theme.palette.header,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background elements */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -20, 
          right: -20, 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          bgcolor: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: -15, 
          left: -15, 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          bgcolor: 'rgba(255,255,255,0.05)',
          zIndex: 0
        }} 
      />
      
      <Toolbar sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              width: 40, 
              height: 40, 
              mr: 2,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <SchoolIcon />
          </Avatar>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px'
            }}
          >
            CampusLink
          </Typography>
          {user?.role && (
            <Chip 
              label={getRoleDisplayName(user.role)}
              size="small"
              sx={{ 
                ml: 2, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          )}
        </Box>
        
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => handleNavigation(item.path)}
              startIcon={item.icon}
              sx={{
                color: 'white',
                fontWeight: 600,
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                '& .MuiButton-startIcon': {
                  mr: 1
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Mobile User Avatar */}
          <IconButton
            color="inherit"
            onClick={handleUserMenuOpen}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)'
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              {user?.first_name?.[0] || user?.name?.[0] || user?.email?.[0] || <AccountCircleIcon />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)'
                  }
                }
              }
            }}
          >
            {navigationItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{ py: 1.5 }}
              >
                <Box sx={{ color: 'primary.main', mr: 1.5 }}>
                  {item.icon}
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{item.label}</Typography>
              </MenuItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <LogoutIcon sx={{ color: 'error.main', mr: 1.5 }} />
              <Typography sx={{ fontWeight: 600, color: 'error.main' }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>

        {/* Theme Selector */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}>
          <ThemeSelector />
        </Box>

        {/* User Profile Dropdown */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 3 }}>
          <Button
            onClick={handleUserMenuOpen}
            sx={{
              color: 'white',
              textTransform: 'none',
              p: 1,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                mr: 1.5,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              {user?.first_name?.[0] || user?.name?.[0] || user?.email?.[0] || <AccountCircleIcon />}
            </Avatar>
            <Box sx={{ textAlign: 'left', mr: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'white',
                  fontWeight: 600,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  lineHeight: 1.2
                }}
              >
                {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name || user?.email}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  lineHeight: 1.2
                }}
              >
                {getRoleDisplayName(user?.role)}
              </Typography>
            </Box>
            <KeyboardArrowDownIcon 
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                transition: 'transform 0.2s ease',
                transform: Boolean(userMenuAnchorEl) ? 'rotate(180deg)' : 'rotate(0deg)'
              }} 
            />
          </Button>
          
          {/* User Dropdown Menu */}
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                minWidth: 200,
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.04)'
                  }
                }
              }
            }}
          >
            {/* User Info Header */}
            <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    mr: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  {user?.first_name?.[0] || user?.name?.[0] || user?.email?.[0] || <AccountCircleIcon />}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="medium" color="text.primary">
                    {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name || user?.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            {/* Profile Menu Items */}
            <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
              <PersonIcon sx={{ color: 'primary.main', mr: 1.5 }} />
              <Typography sx={{ fontWeight: 600 }}>Profile</Typography>
            </MenuItem>
            
            <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
              <SettingsIcon sx={{ color: 'primary.main', mr: 1.5 }} />
              <Typography sx={{ fontWeight: 600 }}>Settings</Typography>
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <LogoutIcon sx={{ color: 'error.main', mr: 1.5 }} />
              <Typography sx={{ fontWeight: 600, color: 'error.main' }}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Role-based dashboard component
function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return <Dashboard />;

  switch (user.role) {
    case 'super_admin':
      return <Dashboard />;
    case 'college_admin':
      return <CollegeAdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <Dashboard />;
  }
}

// Main app layout
function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <>
      <Navigation />
      <Routes>
        {/* College Admin Routes - These have their own layout */}
        <Route path="/students" element={<StudentManagementPage />} />
        <Route path="/teachers" element={<TeacherManagementPage />} />
        <Route path="/academic-management" element={<AcademicManagementPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admission-inquiry" element={<AdmissionInquiryPage />} />
        <Route path="/fee-management" element={<FeeManagementPage />} />
        
        {/* All other routes with container */}
        <Route path="*" element={
          <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Routes>
              {/* Super Admin Routes */}
              <Route path="/dashboard" element={<RoleBasedDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/colleges" element={<CollegeManagement />} />
              <Route path="/landing-colleges" element={<LandingPageCollegesPage />} />
              <Route path="/passwords" element={<PasswordManagement />} />
              <Route path="/activity-logs" element={<ActivityLogs />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* Teacher Routes */}
              <Route path="/assignments" element={<AssignmentManagementPage />} />
              <Route path="/assignment-review" element={<AssignmentReviewPage />} />
              <Route path="/attendance" element={<AttendanceManagementPage />} />
              <Route path="/grades" element={<GradesManagement />} />
              
              {/* Student Routes */}
              <Route path="/schedule" element={<StudentDashboard />} />
              
              {/* Parent Routes */}
              <Route path="/children" element={<ParentDashboard />} />
              <Route path="/progress" element={<ParentDashboard />} />
              <Route path="/fees" element={<ParentDashboard />} />
              <Route path="/events" element={<ParentDashboard />} />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Container>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
