import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  Skeleton,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Payment as PaymentIcon, MonetizationOn, AssignmentTurnedIn, Warning, CheckCircle, School as SchoolIcon } from '@mui/icons-material';
import CollegeAdminLayout from './CollegeAdminLayout';
import { collegeAdminAPI } from '../../api/collegeAdmin';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

const FeeManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [studentFees, setStudentFees] = useState([]);
  const [openAssign, setOpenAssign] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [students, setStudents] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [assignForm, setAssignForm] = useState({ student_id: '', fee_structure_id: '', due_date: '', total_amount: '', remarks: '' });
  const [assignLoading, setAssignLoading] = useState(false);
  const [editForm, setEditForm] = useState({ due_date: '', total_amount: '', status: '', remarks: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [payForm, setPayForm] = useState({ amount_paid: '', payment_date: '', payment_method: '', transaction_id: '', remarks: '' });
  const [payLoading, setPayLoading] = useState(false);
  const [filters, setFilters] = useState({ student_id: '', status: '', fee_type: '', due_start: null, due_end: null, search: '' });
  const [openAddFeeStructure, setOpenAddFeeStructure] = useState(false);
  const [addFeeStructureForm, setAddFeeStructureForm] = useState({ course_id: '', academic_year_id: '', fee_type: '', amount: '', due_date: '', is_optional: false });
  const [addFeeStructureLoading, setAddFeeStructureLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const theme = useTheme();

  // Fetch summary and student fees
  useEffect(() => {
    fetchData();
  }, [filters]);

  // Fetch students, fee structures, courses, and academic years for dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [studentsRes, feeStructuresRes, coursesRes, yearsRes] = await Promise.all([
          collegeAdminAPI.getStudents(),
          collegeAdminAPI.getFeeStructures(),
          collegeAdminAPI.getCourses ? collegeAdminAPI.getCourses() : [],
          collegeAdminAPI.getAcademicYears ? collegeAdminAPI.getAcademicYears() : [],
        ]);
        setStudents(studentsRes.users || studentsRes.students || []);
        setFeeStructures(feeStructuresRes.fee_structures || feeStructuresRes || []);
        setCourses(coursesRes.courses || coursesRes || []);
        setAcademicYears(yearsRes.academic_years || yearsRes.years || yearsRes || []);
      } catch (err) {
        // Ignore dropdown errors for now
      }
    };
    fetchDropdowns();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.student_id) params.student_id = filters.student_id;
      if (filters.status) params.status = filters.status;
      if (filters.fee_type) params.fee_type = filters.fee_type;
      if (filters.due_start) params.due_start = filters.due_start.toISOString().slice(0, 10);
      if (filters.due_end) params.due_end = filters.due_end.toISOString().slice(0, 10);
      if (filters.search) params.search = filters.search;
      const [summaryData, feesData] = await Promise.all([
        collegeAdminAPI.getStudentFeeSummary(),
        collegeAdminAPI.getStudentFees(params)
      ]);
      setSummary(summaryData);
      setStudentFees(feesData.student_fees);
    } catch (err) {
      setError('Failed to load fee data');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for dialogs (assign, edit, pay)
  const handleOpenAssign = () => setOpenAssign(true);
  const handleCloseAssign = () => setOpenAssign(false);
  const handleOpenEdit = (fee) => { setSelectedFee(fee); setOpenEdit(true); };
  const handleCloseEdit = () => { setSelectedFee(null); setOpenEdit(false); };
  const handleOpenPay = (fee) => { setSelectedFee(fee); setOpenPay(true); };
  const handleClosePay = () => { setSelectedFee(null); setOpenPay(false); };

  // Assign Fee Handlers
  const handleAssignChange = (e) => {
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  };
  const handleAssign = async () => {
    setAssignLoading(true);
    try {
      await collegeAdminAPI.assignStudentFee(assignForm);
      setOpenAssign(false);
      setAssignForm({ student_id: '', fee_structure_id: '', due_date: '', total_amount: '', remarks: '' });
      fetchData();
    } catch (err) {
      setError('Failed to assign fee');
    } finally {
      setAssignLoading(false);
    }
  };

  // Edit Fee Handlers
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEdit = async () => {
    if (!selectedFee) return;
    setEditLoading(true);
    try {
      await collegeAdminAPI.updateStudentFee(selectedFee.id, editForm);
      setOpenEdit(false);
      setEditForm({ due_date: '', total_amount: '', status: '', remarks: '' });
      setSelectedFee(null);
      fetchData();
    } catch (err) {
      setError('Failed to update fee');
    } finally {
      setEditLoading(false);
    }
  };

  // Payment Handlers
  const handlePayChange = (e) => {
    setPayForm({ ...payForm, [e.target.name]: e.target.value });
  };
  const handlePay = async () => {
    if (!selectedFee) return;
    setPayLoading(true);
    try {
      await collegeAdminAPI.recordStudentFeePayment(selectedFee.id, payForm);
      setOpenPay(false);
      setPayForm({ amount_paid: '', payment_date: '', payment_method: '', transaction_id: '', remarks: '' });
      setSelectedFee(null);
      fetchData();
    } catch (err) {
      setError('Failed to record payment');
    } finally {
      setPayLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleDateChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };
  const handleClearFilters = () => {
    setFilters({ student_id: '', status: '', fee_type: '', due_start: null, due_end: null, search: '' });
  };

  // Add Fee Structure Handlers
  const handleOpenAddFeeStructure = () => setOpenAddFeeStructure(true);
  const handleCloseAddFeeStructure = () => setOpenAddFeeStructure(false);
  const handleAddFeeStructureChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddFeeStructureForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleAddFeeStructure = async () => {
    setAddFeeStructureLoading(true);
    try {
      await collegeAdminAPI.createFeeStructure(addFeeStructureForm);
      setOpenAddFeeStructure(false);
      setAddFeeStructureForm({ course_id: '', academic_year_id: '', fee_type: '', amount: '', due_date: '', is_optional: false });
      // Refresh fee structures for dropdowns
      const feeStructuresRes = await collegeAdminAPI.getFeeStructures();
      setFeeStructures(feeStructuresRes.fee_structures || feeStructuresRes || []);
    } catch (err) {
      setError('Failed to add fee structure');
    } finally {
      setAddFeeStructureLoading(false);
    }
  };

  // Add a helper for currency formatting
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <CollegeAdminLayout title="Student Fee Management" subtitle="Assign, track, and collect student fees for your institution">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[1,2,3,4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="dashboardCard" color="revenue">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'white', width: 48, height: 48 }}>
                      <MonetizationOn />
                    </Avatar>
                    <Box>
                      <Typography variant="body2">Total Assigned</Typography>
                      <Typography variant="h5" fontWeight={700}>{formatCurrency(summary?.total_assigned?.total)}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="dashboardCard" color="revenue">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'success.main', color: 'white', width: 48, height: 48 }}>
                      <AssignmentTurnedIn />
                    </Avatar>
                    <Box>
                      <Typography variant="body2">Total Collected</Typography>
                      <Typography variant="h5" fontWeight={700}>{formatCurrency(summary?.total_collected?.collected)}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="dashboardCard" color="pending">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'warning.main', color: 'white', width: 48, height: 48 }}>
                      <Warning />
                    </Avatar>
                    <Box>
                      <Typography variant="body2">Overdue</Typography>
                      <Typography variant="h5" fontWeight={700}>{formatCurrency(summary?.overdue?.overdue)}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="dashboardCard" color="success">
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'info.main', color: 'white', width: 48, height: 48 }}>
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="body2">Paid</Typography>
                      <Typography variant="h5" fontWeight={700}>{formatCurrency(summary?.paid?.paid)}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 2, overflowX: 'auto' }}>
            <Grid container spacing={2} alignItems="center" wrap="nowrap">
              <Grid item xs={12} sm={6} md={2} minWidth={180}>
                <FormControl fullWidth size="small">
                  <InputLabel>Student</InputLabel>
                  <Select name="student_id" value={filters.student_id} onChange={handleFilterChange} label="Student">
                    <MenuItem value="">All</MenuItem>
                    {students.map((s) => (
                      <MenuItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2} minWidth={140}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select name="status" value={filters.status} onChange={handleFilterChange} label="Status">
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="due">Due</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2} minWidth={140}>
                <FormControl fullWidth size="small">
                  <InputLabel>Fee Type</InputLabel>
                  <Select name="fee_type" value={filters.fee_type} onChange={handleFilterChange} label="Fee Type">
                    <MenuItem value="">All</MenuItem>
                    {feeStructures.map((f) => (
                      <MenuItem key={f.id} value={f.fee_type}>{f.fee_type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2} minWidth={160}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Start"
                    value={filters.due_start}
                    onChange={(date) => handleDateChange('due_start', date)}
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={2} minWidth={160}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due End"
                    value={filters.due_end}
                    onChange={(date) => handleDateChange('due_end', date)}
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={2} minWidth={160}>
                <TextField
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  label="Search"
                  size="small"
                  fullWidth
                  placeholder="Name, email, fee type..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1} minWidth={100}>
                <Tooltip title="Clear Filters"><Button onClick={handleClearFilters} size="small" color="secondary" variant="outlined">Clear</Button></Tooltip>
              </Grid>
            </Grid>
          </Paper>

          {/* Fee Table */}
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Student Fees</Typography>
              <Box>
                <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={handleOpenAddFeeStructure}>
                  Add Fee Structure
                </Button>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAssign}>
                  Assign Fee
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer sx={{ minWidth: 900 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Fee Type</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentFees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No fee assignments found.</TableCell>
                    </TableRow>
                  ) : (
                    studentFees.map((fee) => (
                      <TableRow key={fee.id} hover>
                        <TableCell>{fee.first_name} {fee.last_name} <br /><span style={{ color: '#888', fontSize: 12 }}>{fee.email}</span></TableCell>
                        <TableCell>{fee.fee_type}</TableCell>
                        <TableCell>{fee.due_date}</TableCell>
                        <TableCell>{formatCurrency(fee.total_amount)}</TableCell>
                        <TableCell>{formatCurrency(fee.amount_paid)}</TableCell>
                        <TableCell>
                          <Chip
                            label={fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                            color={
                              fee.status === 'paid' ? 'success' :
                              fee.status === 'overdue' ? 'error' :
                              fee.status === 'partial' ? 'warning' :
                              'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit Fee Assignment"><IconButton onClick={() => handleOpenEdit(fee)}><EditIcon /></IconButton></Tooltip>
                            <Tooltip title="Record Payment"><IconButton onClick={() => handleOpenPay(fee)}><PaymentIcon /></IconButton></Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Assign Fee Dialog */}
          <Dialog open={openAssign} onClose={handleCloseAssign} maxWidth="sm" fullWidth>
            <DialogTitle>Assign Fee to Student</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Select name="student_id" value={assignForm.student_id} onChange={handleAssignChange} label="Student">
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.email})</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Fee Structure</InputLabel>
                <Select name="fee_structure_id" value={assignForm.fee_structure_id} onChange={handleAssignChange} label="Fee Structure">
                  {feeStructures.map((f) => (
                    <MenuItem key={f.id} value={f.id}>{f.fee_type} - {f.amount}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField name="due_date" label="Due Date" type="date" value={assignForm.due_date} onChange={handleAssignChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField name="total_amount" label="Total Amount" type="number" value={assignForm.total_amount} onChange={handleAssignChange} fullWidth margin="normal" />
              <TextField name="remarks" label="Remarks" value={assignForm.remarks} onChange={handleAssignChange} fullWidth margin="normal" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAssign}>Cancel</Button>
              <Button variant="contained" onClick={handleAssign} disabled={assignLoading || !assignForm.student_id || !assignForm.fee_structure_id || !assignForm.due_date || !assignForm.total_amount}>
                {assignLoading ? <CircularProgress size={20} /> : 'Assign'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Fee Dialog */}
          <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Fee Assignment</DialogTitle>
            <DialogContent>
              <TextField name="due_date" label="Due Date" type="date" value={editForm.due_date} onChange={handleEditChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField name="total_amount" label="Total Amount" type="number" value={editForm.total_amount} onChange={handleEditChange} fullWidth margin="normal" />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select name="status" value={editForm.status} onChange={handleEditChange} label="Status">
                  <MenuItem value="due">Due</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              <TextField name="remarks" label="Remarks" value={editForm.remarks} onChange={handleEditChange} fullWidth margin="normal" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEdit}>Cancel</Button>
              <Button variant="contained" onClick={handleEdit} disabled={editLoading}>
                {editLoading ? <CircularProgress size={20} /> : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Record Payment Dialog */}
          <Dialog open={openPay} onClose={handleClosePay} maxWidth="sm" fullWidth>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogContent>
              <TextField name="amount_paid" label="Amount Paid" type="number" value={payForm.amount_paid} onChange={handlePayChange} fullWidth margin="normal" />
              <TextField name="payment_date" label="Payment Date" type="date" value={payForm.payment_date} onChange={handlePayChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField name="payment_method" label="Payment Method" value={payForm.payment_method} onChange={handlePayChange} fullWidth margin="normal" />
              <TextField name="transaction_id" label="Transaction ID" value={payForm.transaction_id} onChange={handlePayChange} fullWidth margin="normal" />
              <TextField name="remarks" label="Remarks" value={payForm.remarks} onChange={handlePayChange} fullWidth margin="normal" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePay}>Cancel</Button>
              <Button variant="contained" onClick={handlePay} disabled={payLoading || !payForm.amount_paid || !payForm.payment_date}>
                {payLoading ? <CircularProgress size={20} /> : 'Record Payment'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Fee Structure Dialog */}
          <Dialog open={openAddFeeStructure} onClose={handleCloseAddFeeStructure} maxWidth="sm" fullWidth>
            <DialogTitle>Add Fee Structure</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Course</InputLabel>
                <Select name="course_id" value={addFeeStructureForm.course_id} onChange={handleAddFeeStructureChange} label="Course">
                  {courses.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Academic Year</InputLabel>
                <Select name="academic_year_id" value={addFeeStructureForm.academic_year_id} onChange={handleAddFeeStructureChange} label="Academic Year">
                  {academicYears.map((y) => (
                    <MenuItem key={y.id} value={y.id}>{y.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField name="fee_type" label="Fee Type" value={addFeeStructureForm.fee_type} onChange={handleAddFeeStructureChange} fullWidth margin="normal" />
              <TextField name="amount" label="Amount" type="number" value={addFeeStructureForm.amount} onChange={handleAddFeeStructureChange} fullWidth margin="normal" />
              <TextField name="due_date" label="Due Date" type="date" value={addFeeStructureForm.due_date} onChange={handleAddFeeStructureChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <FormControl fullWidth margin="normal">
                <InputLabel shrink>Is Optional</InputLabel>
                <Select name="is_optional" value={addFeeStructureForm.is_optional ? 'true' : 'false'} onChange={e => setAddFeeStructureForm(f => ({ ...f, is_optional: e.target.value === 'true' }))} label="Is Optional">
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddFeeStructure}>Cancel</Button>
              <Button variant="contained" onClick={handleAddFeeStructure} disabled={addFeeStructureLoading || !addFeeStructureForm.course_id || !addFeeStructureForm.academic_year_id || !addFeeStructureForm.fee_type || !addFeeStructureForm.amount || !addFeeStructureForm.due_date}>
                {addFeeStructureLoading ? <CircularProgress size={20} /> : 'Add'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </CollegeAdminLayout>
  );
};

export default FeeManagement; 