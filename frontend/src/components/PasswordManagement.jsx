import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { adminAPI } from '../api/admin';
import AdminLayout from './AdminLayout';

const PasswordManagement = () => {
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
    currentPassword: false,
  });

  // Change password form data
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Reset password form data
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: '',
    newPassword: '',
    confirmPassword: '',
    sendEmail: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleChangePassword = () => {
    setChangePasswordDialog(true);
    setError('');
    setSuccess('');
    setChangePasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setResetPasswordDialog(true);
    setError('');
    setSuccess('');
    setResetPasswordData({
      userId: user.id,
      newPassword: '',
      confirmPassword: '',
      sendEmail: true,
    });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: password.length < minLength,
        uppercase: !hasUpperCase,
        lowercase: !hasLowerCase,
        numbers: !hasNumbers,
        special: !hasSpecialChar,
      },
    };
  };

  const handleChangePasswordSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate passwords
      if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      const passwordValidation = validatePassword(changePasswordData.newPassword);
      if (!passwordValidation.isValid) {
        setError('Password does not meet security requirements');
        return;
      }

      // Call API to change password
      await adminAPI.changePassword({
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword,
      });
      
      setSuccess('Password changed successfully');
      setChangePasswordDialog(false);
      setChangePasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate passwords
      if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const passwordValidation = validatePassword(resetPasswordData.newPassword);
      if (!passwordValidation.isValid) {
        setError('Password does not meet security requirements');
        return;
      }

      // Call API to reset password
      await adminAPI.resetUserPassword(resetPasswordData.userId, {
        newPassword: resetPasswordData.newPassword,
        sendEmail: resetPasswordData.sendEmail,
      });
      
      setSuccess(`Password reset successfully for ${selectedUser.name}`);
      setResetPasswordDialog(false);
      setSelectedUser(null);
      setResetPasswordData({
        userId: '',
        newPassword: '',
        confirmPassword: '',
        sendEmail: true,
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePassword = async () => {
    try {
      const response = await adminAPI.generateSecurePassword();
      const generatedPassword = response.password;
      setResetPasswordData({
        ...resetPasswordData,
        newPassword: generatedPassword,
        confirmPassword: generatedPassword,
      });
    } catch (error) {
      setError('Failed to generate password. Please try again.');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'error';
      case 'college_admin':
        return 'warning';
      case 'teacher':
        return 'info';
      case 'student':
        return 'success';
      default:
        return 'default';
    }
  };

  if (usersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Password Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Change Own Password */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LockIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Change Your Password</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Update your own password. You'll need to provide your current password.
            </Typography>
            <Button
              variant="contained"
              onClick={handleChangePassword}
              startIcon={<SecurityIcon />}
            >
              Change Password
            </Button>
          </Paper>
        </Grid>

        {/* Reset User Passwords */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <RefreshIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Reset User Passwords</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Reset passwords for other users. This will generate a new secure password.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Select a user from the list below to reset their password.
            </Typography>
          </Paper>
        </Grid>

        {/* User List */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User List
            </Typography>
            {users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No users found. Please check your connection or try refreshing the page.
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={loadUsers}
                  sx={{ mt: 2 }}
                >
                  Refresh Users
                </Button>
              </Box>
            ) : (
              <List>
                {users.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body1" fontWeight="medium">
                              {user.first_name} {user.last_name}
                            </Typography>
                            <Chip
                              label={user.role.replace('_', ' ')}
                              color={getRoleColor(user.role)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {user.email}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Last password change: {new Date(user.lastPasswordChange || user.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleResetPassword(user)}
                        startIcon={<RefreshIcon />}
                      >
                        Reset Password
                      </Button>
                    </ListItem>
                    {index < users.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordDialog} onClose={() => setChangePasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Your Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.currentPassword ? 'text' : 'password'}
              value={changePasswordData.currentPassword}
              onChange={(e) => setChangePasswordData({...changePasswordData, currentPassword: e.target.value})}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setShowPasswords({...showPasswords, currentPassword: !showPasswords.currentPassword})}
                    size="small"
                  >
                    {showPasswords.currentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={changePasswordData.newPassword}
              onChange={(e) => setChangePasswordData({...changePasswordData, newPassword: e.target.value})}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setShowPasswords({...showPasswords, newPassword: !showPasswords.newPassword})}
                    size="small"
                  >
                    {showPasswords.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={changePasswordData.confirmPassword}
              onChange={(e) => setChangePasswordData({...changePasswordData, confirmPassword: e.target.value})}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setShowPasswords({...showPasswords, confirmPassword: !showPasswords.confirmPassword})}
                    size="small"
                  >
                    {showPasswords.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                ),
              }}
            />
            
            {/* Password Requirements */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Password Requirements:
              </Typography>
              <List dense>
                <ListItem sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {changePasswordData.newPassword.length >= 8 ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                  </ListItemIcon>
                  <ListItemText primary="At least 8 characters" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {/[A-Z]/.test(changePasswordData.newPassword) ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                  </ListItemIcon>
                  <ListItemText primary="At least one uppercase letter" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {/[a-z]/.test(changePasswordData.newPassword) ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                  </ListItemIcon>
                  <ListItemText primary="At least one lowercase letter" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {/\d/.test(changePasswordData.newPassword) ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                  </ListItemIcon>
                  <ListItemText primary="At least one number" />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(changePasswordData.newPassword) ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                  </ListItemIcon>
                  <ListItemText primary="At least one special character" />
                </ListItem>
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleChangePasswordSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog} onClose={() => setResetPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Reset Password for {selectedUser?.first_name} {selectedUser?.last_name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Generate a new secure password for {selectedUser?.email}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={handleGeneratePassword}
                startIcon={<RefreshIcon />}
                fullWidth
              >
                Generate Secure Password
              </Button>
            </Box>

            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={resetPasswordData.newPassword}
              onChange={(e) => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setShowPasswords({...showPasswords, newPassword: !showPasswords.newPassword})}
                    size="small"
                  >
                    {showPasswords.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={resetPasswordData.confirmPassword}
              onChange={(e) => setResetPasswordData({...resetPasswordData, confirmPassword: e.target.value})}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setShowPasswords({...showPasswords, confirmPassword: !showPasswords.confirmPassword})}
                    size="small"
                  >
                    {showPasswords.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                ),
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Email Notification</InputLabel>
              <Select
                value={resetPasswordData.sendEmail}
                label="Email Notification"
                onChange={(e) => setResetPasswordData({...resetPasswordData, sendEmail: e.target.value})}
              >
                <MenuItem value={true}>Send email with new password</MenuItem>
                <MenuItem value={false}>Don't send email</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleResetPasswordSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const PasswordManagementPage = () => (
  <AdminLayout title="Password Management" subtitle="Reset and manage user passwords">
    <PasswordManagement />
  </AdminLayout>
);

export default PasswordManagementPage; 