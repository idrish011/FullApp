import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Grid,
  Snackbar,
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Class as ClassIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  PersonAdd as PersonAddIcon,
  GroupAdd as GroupAddIcon,
} from '@mui/icons-material';
import { collegeAdminAPI } from '../../api/collegeAdmin';

const AcademicManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Data states
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // Dialog states
  const [courseDialog, setCourseDialog] = useState({ open: false, mode: 'create', data: {} });
  const [yearDialog, setYearDialog] = useState({ open: false, mode: 'create', data: {} });
  const [semesterDialog, setSemesterDialog] = useState({ open: false, mode: 'create', data: {} });
  const [classDialog, setClassDialog] = useState({ open: false, mode: 'create', data: {} });
  const [enrollmentDialog, setEnrollmentDialog] = useState({ open: false, classId: '', students: [] });

  // Form states
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    duration_months: '',
    fee_amount: ''
  });

  const [yearForm, setYearForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });

  const [semesterForm, setSemesterForm] = useState({
    academic_year_id: '',
    name: '',
    start_date: '',
    end_date: '',
    status: 'active'
  });

  const [classForm, setClassForm] = useState({
    course_id: '',
    semester_id: '',
    teacher_id: '',
    name: '',
    schedule: '',
    room_number: '',
    max_students: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, yearsRes, semestersRes, classesRes, teachersRes, studentsRes] = await Promise.all([
        collegeAdminAPI.getCourses(),
        collegeAdminAPI.getAcademicYears(),
        collegeAdminAPI.getSemesters(),
        collegeAdminAPI.getClasses(),
        collegeAdminAPI.getTeachers(),
        collegeAdminAPI.getStudents()
      ]);

      setCourses(coursesRes.courses || []);
      setAcademicYears(yearsRes.years || []);
      setSemesters(semestersRes.semesters || []);
      setClasses(classesRes.classes || []);
      setTeachers(teachersRes.teachers || []);
      setStudents(studentsRes.students || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Course Management
  const handleCreateCourse = async () => {
    try {
      await collegeAdminAPI.createCourse(courseForm);
      showNotification('Course created successfully');
      setCourseDialog({ open: false, mode: 'create', data: {} });
      setCourseForm({ name: '', code: '', description: '', credits: '', duration_months: '', fee_amount: '' });
      loadData();
    } catch (error) {
      console.error('Create course error:', error);
      showNotification('Failed to create course', 'error');
    }
  };

  const handleUpdateCourse = async () => {
    try {
      await collegeAdminAPI.updateCourse(courseDialog.data.id, courseForm);
      showNotification('Course updated successfully');
      setCourseDialog({ open: false, mode: 'create', data: {} });
      setCourseForm({ name: '', code: '', description: '', credits: '', duration_months: '', fee_amount: '' });
      loadData();
    } catch (error) {
      console.error('Update course error:', error);
      showNotification('Failed to update course', 'error');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await collegeAdminAPI.deleteCourse(courseId);
        showNotification('Course deleted successfully');
        loadData();
      } catch (error) {
        console.error('Delete course error:', error);
        showNotification('Failed to delete course', 'error');
      }
    }
  };

  // Academic Year Management
  const handleCreateYear = async () => {
    try {
      await collegeAdminAPI.createAcademicYear(yearForm);
      showNotification('Academic year created successfully');
      setYearDialog({ open: false, mode: 'create', data: {} });
      setYearForm({ name: '', start_date: '', end_date: '', status: 'active' });
      loadData();
    } catch (error) {
      console.error('Create academic year error:', error);
      showNotification('Failed to create academic year', 'error');
    }
  };

  const handleUpdateYear = async () => {
    try {
      await collegeAdminAPI.updateAcademicYear(yearDialog.data.id, yearForm);
      showNotification('Academic year updated successfully');
      setYearDialog({ open: false, mode: 'create', data: {} });
      setYearForm({ name: '', start_date: '', end_date: '', status: 'active' });
      loadData();
    } catch (error) {
      console.error('Update academic year error:', error);
      showNotification('Failed to update academic year', 'error');
    }
  };

  const handleDeleteYear = async (yearId) => {
    if (window.confirm('Are you sure you want to delete this academic year?')) {
      try {
        await collegeAdminAPI.deleteAcademicYear(yearId);
        showNotification('Academic year deleted successfully');
        loadData();
      } catch (error) {
        console.error('Delete academic year error:', error);
        showNotification('Failed to delete academic year', 'error');
      }
    }
  };

  // Semester Management
  const handleCreateSemester = async () => {
    try {
      await collegeAdminAPI.createSemester(semesterForm);
      showNotification('Semester created successfully');
      setSemesterDialog({ open: false, mode: 'create', data: {} });
      setSemesterForm({ academic_year_id: '', name: '', start_date: '', end_date: '', status: 'active' });
      loadData();
    } catch (error) {
      console.error('Create semester error:', error);
      showNotification('Failed to create semester', 'error');
    }
  };

  const handleUpdateSemester = async () => {
    try {
      await collegeAdminAPI.updateSemester(semesterDialog.data.id, semesterForm);
      showNotification('Semester updated successfully');
      setSemesterDialog({ open: false, mode: 'create', data: {} });
      setSemesterForm({ academic_year_id: '', name: '', start_date: '', end_date: '', status: 'active' });
      loadData();
    } catch (error) {
      console.error('Update semester error:', error);
      showNotification('Failed to update semester', 'error');
    }
  };

  const handleDeleteSemester = async (semesterId) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await collegeAdminAPI.deleteSemester(semesterId);
        showNotification('Semester deleted successfully');
        loadData();
      } catch (error) {
        console.error('Delete semester error:', error);
        showNotification('Failed to delete semester', 'error');
      }
    }
  };

  // Class Management
  const handleCreateClass = async () => {
    try {
      await collegeAdminAPI.createClass(classForm);
      showNotification('Class created successfully');
      setClassDialog({ open: false, mode: 'create', data: {} });
      setClassForm({ course_id: '', semester_id: '', teacher_id: '', name: '', schedule: '', room_number: '', max_students: '' });
      loadData();
    } catch (error) {
      console.error('Create class error:', error);
      showNotification('Failed to create class', 'error');
    }
  };

  const handleUpdateClass = async () => {
    try {
      await collegeAdminAPI.updateClass(classDialog.data.id, classForm);
      showNotification('Class updated successfully');
      setClassDialog({ open: false, mode: 'create', data: {} });
      setClassForm({ course_id: '', semester_id: '', teacher_id: '', name: '', schedule: '', room_number: '', max_students: '' });
      loadData();
    } catch (error) {
      console.error('Update class error:', error);
      showNotification('Failed to update class', 'error');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await collegeAdminAPI.deleteClass(classId);
        showNotification('Class deleted successfully');
        loadData();
      } catch (error) {
        console.error('Delete class error:', error);
        showNotification('Failed to delete class', 'error');
      }
    }
  };

  // Enrollment Management
  const handleEnrollStudents = async () => {
    try {
      const selectedStudents = students.filter(student => 
        enrollmentDialog.students.includes(student.id)
      );
      
      await collegeAdminAPI.enrollStudents(enrollmentDialog.classId, {
        student_ids: selectedStudents.map(s => s.id)
      });
      
      showNotification(`${selectedStudents.length} students enrolled successfully`);
      setEnrollmentDialog({ open: false, classId: '', students: [] });
      loadData();
    } catch (error) {
      console.error('Enroll students error:', error);
      showNotification('Failed to enroll students', 'error');
    }
  };

  const handleRemoveStudent = async (classId, studentId) => {
    if (window.confirm('Are you sure you want to remove this student from the class?')) {
      try {
        await collegeAdminAPI.removeStudentFromClass(classId, studentId);
        showNotification('Student removed from class successfully');
        loadData();
      } catch (error) {
        console.error('Remove student error:', error);
        showNotification('Failed to remove student', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<SchoolIcon />} label="Courses" />
          <Tab icon={<CalendarIcon />} label="Academic Years" />
          <Tab icon={<ClassIcon />} label="Semesters" />
          <Tab icon={<AssignmentIcon />} label="Classes" />
          <Tab icon={<PeopleIcon />} label="Enrollments" />
        </Tabs>

        {/* Courses Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Courses</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCourseDialog({ open: true, mode: 'create', data: {} })}
              >
                Add Course
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Credits</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>{course.duration_months} months</TableCell>
                      <TableCell>${course.fee_amount}</TableCell>
                      <TableCell>
                        <Chip label={course.status} color={course.status === 'active' ? 'success' : 'default'} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setCourseForm(course);
                              setCourseDialog({ open: true, mode: 'edit', data: course });
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <DeleteIcon />
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

        {/* Academic Years Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Academic Years</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setYearDialog({ open: true, mode: 'create', data: {} })}
              >
                Add Academic Year
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {academicYears.map((year) => (
                    <TableRow key={year.id}>
                      <TableCell>{year.name}</TableCell>
                      <TableCell>{new Date(year.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(year.end_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip label={year.status} color={year.status === 'active' ? 'success' : 'default'} size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setYearForm(year);
                              setYearDialog({ open: true, mode: 'edit', data: year });
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteYear(year.id)}
                          >
                            <DeleteIcon />
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

        {/* Semesters Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Semesters</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setSemesterDialog({ open: true, mode: 'create', data: {} })}
              >
                Add Semester
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {semesters.map((semester) => {
                    const year = academicYears.find(y => y.id === semester.academic_year_id);
                    return (
                      <TableRow key={semester.id}>
                        <TableCell>{semester.name}</TableCell>
                        <TableCell>{year?.name || 'N/A'}</TableCell>
                        <TableCell>{new Date(semester.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(semester.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={semester.status} color={semester.status === 'active' ? 'success' : 'default'} size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSemesterForm(semester);
                                setSemesterDialog({ open: true, mode: 'edit', data: semester });
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteSemester(semester.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Classes Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Classes</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setClassDialog({ open: true, mode: 'create', data: {} })}
              >
                Add Class
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Teacher</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Students</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>{cls.name}</TableCell>
                      <TableCell>{cls.course_name}</TableCell>
                      <TableCell>{cls.teacher_name}</TableCell>
                      <TableCell>{cls.schedule}</TableCell>
                      <TableCell>{cls.room_number}</TableCell>
                      <TableCell>{cls.enrolled_students || 0}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Enroll Students">
                          <IconButton
                            size="small"
                            onClick={() => setEnrollmentDialog({ open: true, classId: cls.id, students: [] })}
                          >
                            <GroupAddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setClassForm(cls);
                              setClassDialog({ open: true, mode: 'edit', data: cls });
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClass(cls.id)}
                          >
                            <DeleteIcon />
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

        {/* Enrollments Tab */}
        {activeTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Class Enrollments
            </Typography>
            
            <Grid container spacing={3}>
              {classes.map((cls) => (
                <Grid size={{ xs: 12, md: 6 }} key={cls.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {cls.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Grade: {cls.grade}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Students: {cls.studentCount}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Teacher: {cls.teacherName}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEditClass(cls)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteClass(cls.id)}
                          sx={{ ml: 1 }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Course Dialog */}
      <Dialog open={courseDialog.open} onClose={() => setCourseDialog({ open: false, mode: 'create', data: {} })} maxWidth="sm" fullWidth>
        <DialogTitle>{courseDialog.mode === 'create' ? 'Add Course' : 'Edit Course'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Course Name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Course Code"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={courseForm.credits}
                onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Duration (months)"
                type="number"
                value={courseForm.duration_months}
                onChange={(e) => setCourseForm({ ...courseForm, duration_months: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Fee Amount"
                type="number"
                value={courseForm.fee_amount}
                onChange={(e) => setCourseForm({ ...courseForm, fee_amount: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCourseDialog({ open: false, mode: 'create', data: {} })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={courseDialog.mode === 'create' ? handleCreateCourse : handleUpdateCourse}
          >
            {courseDialog.mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Academic Year Dialog */}
      <Dialog open={yearDialog.open} onClose={() => setYearDialog({ open: false, mode: 'create', data: {} })} maxWidth="sm" fullWidth>
        <DialogTitle>{yearDialog.mode === 'create' ? 'Add Academic Year' : 'Edit Academic Year'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Year Name"
                value={yearForm.name}
                onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={yearForm.start_date}
                onChange={(e) => setYearForm({ ...yearForm, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={yearForm.end_date}
                onChange={(e) => setYearForm({ ...yearForm, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={yearForm.status}
                  label="Status"
                  onChange={(e) => setYearForm({ ...yearForm, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setYearDialog({ open: false, mode: 'create', data: {} })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={yearDialog.mode === 'create' ? handleCreateYear : handleUpdateYear}
          >
            {yearDialog.mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Semester Dialog */}
      <Dialog open={semesterDialog.open} onClose={() => setSemesterDialog({ open: false, mode: 'create', data: {} })} maxWidth="sm" fullWidth>
        <DialogTitle>{semesterDialog.mode === 'create' ? 'Add Semester' : 'Edit Semester'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  value={semesterForm.academic_year_id}
                  label="Academic Year"
                  onChange={(e) => setSemesterForm({ ...semesterForm, academic_year_id: e.target.value })}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Semester Name"
                value={semesterForm.name}
                onChange={(e) => setSemesterForm({ ...semesterForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={semesterForm.start_date}
                onChange={(e) => setSemesterForm({ ...semesterForm, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={semesterForm.end_date}
                onChange={(e) => setSemesterForm({ ...semesterForm, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={semesterForm.status}
                  label="Status"
                  onChange={(e) => setSemesterForm({ ...semesterForm, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSemesterDialog({ open: false, mode: 'create', data: {} })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={semesterDialog.mode === 'create' ? handleCreateSemester : handleUpdateSemester}
          >
            {semesterDialog.mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Class Dialog */}
      <Dialog open={classDialog.open} onClose={() => setClassDialog({ open: false, mode: 'create', data: {} })} maxWidth="sm" fullWidth>
        <DialogTitle>{classDialog.mode === 'create' ? 'Add Class' : 'Edit Class'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Class Name"
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={classForm.course_id}
                  label="Course"
                  onChange={(e) => setClassForm({ ...classForm, course_id: e.target.value })}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={classForm.semester_id}
                  label="Semester"
                  onChange={(e) => setClassForm({ ...classForm, semester_id: e.target.value })}
                >
                  {semesters.map((semester) => (
                    <MenuItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={classForm.teacher_id}
                  label="Teacher"
                  onChange={(e) => setClassForm({ ...classForm, teacher_id: e.target.value })}
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Max Students"
                type="number"
                value={classForm.max_students}
                onChange={(e) => setClassForm({ ...classForm, max_students: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Schedule"
                value={classForm.schedule}
                onChange={(e) => setClassForm({ ...classForm, schedule: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                label="Room Number"
                value={classForm.room_number}
                onChange={(e) => setClassForm({ ...classForm, room_number: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClassDialog({ open: false, mode: 'create', data: {} })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={classDialog.mode === 'create' ? handleCreateClass : handleUpdateClass}
          >
            {classDialog.mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enrollment Dialog */}
      <Dialog open={enrollmentDialog.open} onClose={() => setEnrollmentDialog({ open: false, classId: '', students: [] })} maxWidth="md" fullWidth>
        <DialogTitle>Enroll Students</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select students to enroll in this class:
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Students</InputLabel>
            <Select
              multiple
              value={enrollmentDialog.students}
              onChange={(e) => setEnrollmentDialog({ ...enrollmentDialog, students: e.target.value })}
              input={<OutlinedInput label="Students" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const student = students.find(s => s.id === value);
                    return (
                      <Chip key={value} label={`${student?.first_name} ${student?.last_name}`} />
                    );
                  })}
                </Box>
              )}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  <Checkbox checked={enrollmentDialog.students.indexOf(student.id) > -1} />
                  <ListItemText primary={`${student.first_name} ${student.last_name}`} secondary={student.email} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollmentDialog({ open: false, classId: '', students: [] })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEnrollStudents}>
            Enroll Students
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AcademicManagement; 