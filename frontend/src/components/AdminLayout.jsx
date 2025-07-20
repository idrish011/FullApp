import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Container,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathname = location.pathname;
    const breadcrumbs = [
      { label: 'Dashboard', path: '/dashboard', icon: <HomeIcon /> }
    ];
    switch (pathname) {
      case '/users':
        breadcrumbs.push({ label: 'Users', path: '/users', icon: <PeopleIcon /> });
        break;
      case '/colleges':
        breadcrumbs.push({ label: 'Colleges', path: '/colleges', icon: <SchoolIcon /> });
        break;
      case '/passwords':
        breadcrumbs.push({ label: 'Passwords', path: '/passwords', icon: <SecurityIcon /> });
        break;
      case '/activity-logs':
        breadcrumbs.push({ label: 'Activity Logs', path: '/activity-logs', icon: <HistoryIcon /> });
        break;
      case '/reports':
        breadcrumbs.push({ label: 'Reports', path: '/reports', icon: <AssessmentIcon /> });
        break;
      case '/messages':
        breadcrumbs.push({ label: 'Messages', path: '/messages', icon: <MessageIcon /> });
        break;
      default:
        break;
    }
    return breadcrumbs;
  };

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background: (theme) => theme.palette.background.gradient || theme.palette.background.default,
        position: 'relative',
      }}
    >
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
          >
            {getBreadcrumbs().map((breadcrumb, index) => (
              <Link
                key={breadcrumb.path}
                color={index === getBreadcrumbs().length - 1 ? 'text.primary' : 'inherit'}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBreadcrumbClick(breadcrumb.path);
                }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {breadcrumb.icon && <Box sx={{ mr: 0.5 }}>{breadcrumb.icon}</Box>}
                {breadcrumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Paper 
            elevation={0} 
            variant="dashboardHeader"
            sx={{
              background: (theme) => theme.palette.header,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              mb: 2
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box>
                  <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
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
        {/* Page Content */}
        <Paper sx={{ p: 3, borderRadius: 2, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLayout; 