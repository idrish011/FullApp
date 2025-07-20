import api from './auth';

export const collegeAdminAPI = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Student Management
  getStudents: async (params = {}) => {
    const response = await api.get('/admin/users', { 
      params: { ...params, role: 'student' } 
    });
    return response.data;
  },

  createStudent: async (studentData) => {
    // Add required fields for user creation
    const userData = {
      ...studentData,
      username: studentData.email, // Use email as username
      password: 'defaultPassword123!', // Set a default password
      role: 'student', // Set role as student
      college_id: studentData.college_id || null // Will be set from user context
    };
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/admin/users/${studentId}`, studentData);
    return response.data;
  },

  deleteStudent: async (studentId) => {
    const response = await api.delete(`/admin/users/${studentId}`);
    return response.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/admin/users/${studentId}`);
    return response.data;
  },

  // Teacher Management
  getTeachers: async (params = {}) => {
    const response = await api.get('/admin/users', { 
      params: { ...params, role: 'teacher' } 
    });
    return response.data;
  },

  createTeacher: async (teacherData) => {
    // Add required fields for user creation
    const userData = {
      ...teacherData,
      username: teacherData.email, // Use email as username
      password: 'defaultPassword123!', // Set a default password
      role: 'teacher', // Set role as teacher
      college_id: teacherData.college_id || null // Will be set from user context
    };
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateTeacher: async (teacherId, teacherData) => {
    const response = await api.put(`/admin/users/${teacherId}`, teacherData);
    return response.data;
  },

  deleteTeacher: async (teacherId) => {
    const response = await api.delete(`/admin/users/${teacherId}`);
    return response.data;
  },

  getTeacherDetails: async (teacherId) => {
    const response = await api.get(`/admin/users/${teacherId}`);
    return response.data;
  },

  // Course Management
  getCourses: async (params = {}) => {
    const response = await api.get('/academic/courses', { params });
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/academic/courses', courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/academic/courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/academic/courses/${courseId}`);
    return response.data;
  },

  // Class Management
  getClasses: async (params = {}) => {
    const response = await api.get('/academic/classes', { params });
    return response.data;
  },

  createClass: async (classData) => {
    const response = await api.post('/academic/classes', classData);
    return response.data;
  },

  updateClass: async (classId, classData) => {
    const response = await api.put(`/academic/classes/${classId}`, classData);
    return response.data;
  },

  deleteClass: async (classId) => {
    const response = await api.delete(`/academic/classes/${classId}`);
    return response.data;
  },

  // Assignment Management
  getAssignments: async (params = {}) => {
    const response = await api.get('/academic/assignments', { params });
    return response.data;
  },

  createAssignment: async (assignmentData) => {
    const response = await api.post('/academic/assignments', assignmentData);
    return response.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/academic/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/academic/assignments/${assignmentId}`);
    return response.data;
  },

  // Attendance Management
  getAttendance: async (params = {}) => {
    const response = await api.get('/academic/attendance', { params });
    return response.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post('/academic/attendance', attendanceData);
    return response.data;
  },

  updateAttendance: async (attendanceId, attendanceData) => {
    const response = await api.put(`/academic/attendance/${attendanceId}`, attendanceData);
    return response.data;
  },

  // Grade Management
  getGrades: async (params = {}) => {
    const response = await api.get('/academic/grades', { params });
    return response.data;
  },

  submitGrade: async (gradeData) => {
    const response = await api.post('/academic/grades', gradeData);
    return response.data;
  },

  updateGrade: async (gradeId, gradeData) => {
    const response = await api.put(`/academic/grades/${gradeId}`, gradeData);
    return response.data;
  },

  // Admission Management
  getAdmissions: async (params = {}) => {
    const response = await api.get('/academic/admissions', { params });
    return response.data;
  },

  createAdmission: async (admissionData) => {
    const response = await api.post('/academic/admissions', admissionData);
    return response.data;
  },

  updateAdmissionStatus: async (admissionId, status) => {
    const response = await api.put(`/academic/admissions/${admissionId}/status`, { status });
    return response.data;
  },

  getAdmissionDetails: async (admissionId) => {
    const response = await api.get(`/academic/admissions/${admissionId}`);
    return response.data;
  },

  updateAdmission: async (admissionId, admissionData) => {
    const response = await api.put(`/academic/admissions/${admissionId}`, admissionData);
    return response.data;
  },

  // Admission Inquiries Management
  getAdmissionInquiries: async (params = {}) => {
    const response = await api.get('/academic/admission-inquiries', { params });
    return response.data;
  },

  getAdmissionInquiryDetails: async (inquiryId) => {
    const response = await api.get(`/academic/admission-inquiries/${inquiryId}`);
    return response.data;
  },

  // Fee Management
  getFeeStructures: async (params = {}) => {
    const response = await api.get('/fees/structures', { params });
    return response.data;
  },

  createFeeStructure: async (feeData) => {
    const response = await api.post('/fees/structures', feeData);
    return response.data;
  },

  updateFeeStructure: async (feeId, feeData) => {
    const response = await api.put(`/fees/structures/${feeId}`, feeData);
    return response.data;
  },

  getFeeCollections: async (params = {}) => {
    const response = await api.get('/fees/collections', { params });
    return response.data;
  },

  // Reports
  getReports: async (type, params = {}) => {
    const response = await api.get(`/academic/reports/${type}`, { params });
    return response.data;
  },

  // Analytics Dashboard
  getAnalytics: async (params = {}) => {
    const response = await api.get('/academic/analytics', { params });
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get('/academic/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await api.put(`/academic/notifications/${notificationId}/read`);
    return response.data;
  },

  // Events
  getEvents: async (params = {}) => {
    const response = await api.get('/academic/events', { params });
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/academic/events', eventData);
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/academic/events/${eventId}`, eventData);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/academic/events/${eventId}`);
    return response.data;
  },

  // ==================== ACADEMIC MANAGEMENT ====================

  // Academic Years
  getAcademicYears: async () => {
    const response = await api.get('/academic/academic-years');
    return response.data;
  },

  createAcademicYear: async (yearData) => {
    const response = await api.post('/academic/academic-years', yearData);
    return response.data;
  },

  updateAcademicYear: async (yearId, yearData) => {
    const response = await api.put(`/academic/academic-years/${yearId}`, yearData);
    return response.data;
  },

  deleteAcademicYear: async (yearId) => {
    const response = await api.delete(`/academic/academic-years/${yearId}`);
    return response.data;
  },

  // Semesters
  getSemesters: async () => {
    const response = await api.get('/academic/semesters');
    return response.data;
  },

  createSemester: async (semesterData) => {
    const response = await api.post('/academic/semesters', semesterData);
    return response.data;
  },

  updateSemester: async (semesterId, semesterData) => {
    const response = await api.put(`/academic/semesters/${semesterId}`, semesterData);
    return response.data;
  },

  deleteSemester: async (semesterId) => {
    const response = await api.delete(`/academic/semesters/${semesterId}`);
    return response.data;
  },

  // Class Enrollments
  enrollStudents: async (classId, enrollmentData) => {
    const response = await api.post(`/academic/classes/${classId}/enroll-students`, enrollmentData);
    return response.data;
  },

  removeStudentFromClass: async (classId, studentId) => {
    const response = await api.delete(`/academic/classes/${classId}/students/${studentId}`);
    return response.data;
  },

  getClassStudents: async (classId) => {
    const response = await api.get(`/academic/classes/${classId}/students`);
    return response.data;
  },

  // Teachers and Students List
  getTeachers: async () => {
    const response = await api.get('/academic/teachers');
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get('/academic/students');
    return response.data;
  },

  // Student Fee Management
  getStudentFees: async (params = {}) => {
    const response = await api.get('/college/student-fees', { params });
    return response.data;
  },
  assignStudentFee: async (feeData) => {
    const response = await api.post('/college/student-fees', feeData);
    return response.data;
  },
  updateStudentFee: async (id, feeData) => {
    const response = await api.put(`/college/student-fees/${id}`, feeData);
    return response.data;
  },
  recordStudentFeePayment: async (id, paymentData) => {
    const response = await api.post(`/college/student-fees/${id}/pay`, paymentData);
    return response.data;
  },
  getStudentFeeSummary: async () => {
    const response = await api.get('/college/student-fees/summary');
    return response.data;
  },
}; 