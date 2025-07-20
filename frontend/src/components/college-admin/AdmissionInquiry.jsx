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
  TablePagination,
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
  TextareaAutosize,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Book as BookIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { collegeAdminAPI } from '../../api/collegeAdmin';

const AdmissionInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingInquiry, setViewingInquiry] = useState(null);

  useEffect(() => {
    loadInquiries();
  }, [page, rowsPerPage, searchTerm]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
      };

      const response = await collegeAdminAPI.getAdmissionInquiries(params);
      setInquiries(response.inquiries || []);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      setError('Failed to load admission inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (inquiry) => {
    try {
      const response = await collegeAdminAPI.getAdmissionInquiryDetails(inquiry.id);
      setViewingInquiry(response.inquiry);
      setOpenViewDialog(true);
    } catch (error) {
      console.error('Failed to load inquiry details:', error);
      setError('Failed to load inquiry details.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Admission Inquiry Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: (theme) => theme.palette.background.paper, border: (theme) => theme.palette.card?.border || '1px solid #eee', boxShadow: 'none' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
          Search & Filters
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} >
            <TextField
              fullWidth
              label="Search Inquiries"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} >
            <Typography variant="body2" color="textSecondary">
              Total Inquiries: {inquiries.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Inquiries Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Message</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No inquiries found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {inquiry.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {inquiry.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {inquiry.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {inquiry.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {inquiry.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleView(inquiry)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={inquiries.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* View Inquiry Details Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6">
              Admission Inquiry Details
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {viewingInquiry && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, width: 64, height: 64, bgcolor: 'primary.main' }}>
                    {viewingInquiry.name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {viewingInquiry.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Inquiry ID: {viewingInquiry.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Submitted: {viewingInquiry.created_at ? new Date(viewingInquiry.created_at).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contact Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <EmailIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Email"
                          secondary={viewingInquiry.email}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <PhoneIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Phone"
                          secondary={viewingInquiry.phone}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Message
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {viewingInquiry.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdmissionInquiry; 