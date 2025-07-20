import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear auth and redirect if this is not a retry attempt
      if (!error.config._retry) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Only redirect to login if we're not already on a protected route
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  changePassword: (passwordData) => api.post('/admin/change-password', passwordData),
  resetPassword: (email) => api.post('/admin/reset-password', { email }),
  generatePassword: () => api.post('/admin/generate-password'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getCourses: () => api.get('/dashboard/courses'),
  getAssignments: () => api.get('/dashboard/assignments'),
  getAttendance: () => api.get('/dashboard/attendance'),
  getGrades: () => api.get('/dashboard/grades'),
  getFees: () => api.get('/dashboard/fees'),
};

// CRUD API for Departments
export const departmentsAPI = {
  getAll: () => api.get('/crud/departments'),
  create: (departmentData) => api.post('/crud/departments', departmentData),
  update: (id, departmentData) => api.put(`/crud/departments/${id}`, departmentData),
  delete: (id) => api.delete(`/crud/departments/${id}`),
};

// CRUD API for Courses
export const coursesAPI = {
  getAll: () => api.get('/crud/courses'),
  create: (courseData) => api.post('/crud/courses', courseData),
  update: (id, courseData) => api.put(`/crud/courses/${id}`, courseData),
  delete: (id) => api.delete(`/crud/courses/${id}`),
};

// CRUD API for Classes
export const classesAPI = {
  getAll: () => api.get('/crud/classes'),
  create: (classData) => api.post('/crud/classes', classData),
  update: (id, classData) => api.put(`/crud/classes/${id}`, classData),
  delete: (id) => api.delete(`/crud/classes/${id}`),
};

// CRUD API for Assignments
export const assignmentsAPI = {
  getAll: () => api.get('/crud/assignments'),
  create: (assignmentData) => api.post('/crud/assignments', assignmentData),
  update: (id, assignmentData) => api.put(`/crud/assignments/${id}`, assignmentData),
  delete: (id) => api.delete(`/crud/assignments/${id}`),
};

// CRUD API for Attendance
export const attendanceAPI = {
  getByClass: (classId) => api.get(`/crud/attendance/${classId}`),
  markAttendance: (attendanceData) => api.post('/crud/attendance', attendanceData),
  updateAttendance: (id, attendanceData) => api.put(`/crud/attendance/${id}`, attendanceData),
};

// CRUD API for Grades
export const gradesAPI = {
  getByAssignment: (assignmentId) => api.get(`/crud/grades/assignment/${assignmentId}`),
  submitGrade: (gradeData) => api.post('/crud/grades', gradeData),
  updateGrade: (id, gradeData) => api.put(`/crud/grades/${id}`, gradeData),
};

// CRUD API for Fee Structures
export const feeStructuresAPI = {
  getAll: () => api.get('/crud/fee-structures'),
  create: (feeStructureData) => api.post('/crud/fee-structures', feeStructureData),
  update: (id, feeStructureData) => api.put(`/crud/fee-structures/${id}`, feeStructureData),
  delete: (id) => api.delete(`/crud/fee-structures/${id}`),
};

// Admin API
export const adminAPI = {
  // User Management
  getUsers: () => api.get('/admin/users'),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // College Management
  getColleges: () => api.get('/admin/colleges'),
  createCollege: (collegeData) => api.post('/admin/colleges', collegeData),
  updateCollege: (id, collegeData) => api.put(`/admin/colleges/${id}`, collegeData),
  deleteCollege: (id) => api.delete(`/admin/colleges/${id}`),
  
  // Password Management
  changePassword: (passwordData) => api.post('/admin/change-password', passwordData),
  resetPassword: (email) => api.post('/admin/reset-password', { email }),
  generatePassword: () => api.post('/admin/generate-password'),
};

// Academic API
export const academicAPI = {
  // Admissions
  getAdmissions: () => api.get('/academic/admissions'),
  createAdmission: (admissionData) => api.post('/academic/admissions', admissionData),
  updateAdmission: (id, admissionData) => api.put(`/academic/admissions/${id}`, admissionData),
  deleteAdmission: (id) => api.delete(`/academic/admissions/${id}`),
  
  // Academic Years
  getAcademicYears: () => api.get('/academic/years'),
  createAcademicYear: (yearData) => api.post('/academic/years', yearData),
  updateAcademicYear: (id, yearData) => api.put(`/academic/years/${id}`, yearData),
  deleteAcademicYear: (id) => api.delete(`/academic/years/${id}`),
  
  // Semesters
  getSemesters: () => api.get('/academic/semesters'),
  createSemester: (semesterData) => api.post('/academic/semesters', semesterData),
  updateSemester: (id, semesterData) => api.put(`/academic/semesters/${id}`, semesterData),
  deleteSemester: (id) => api.delete(`/academic/semesters/${id}`),
  
  // Class Enrollments
  getEnrollments: () => api.get('/academic/enrollments'),
  createEnrollment: (enrollmentData) => api.post('/academic/enrollments', enrollmentData),
  updateEnrollment: (id, enrollmentData) => api.put(`/academic/enrollments/${id}`, enrollmentData),
  deleteEnrollment: (id) => api.delete(`/academic/enrollments/${id}`),
};

// Fees API
export const feesAPI = {
  // Fee Collections
  getFeeCollections: () => api.get('/fees/collections'),
  createFeeCollection: (collectionData) => api.post('/fees/collections', collectionData),
  updateFeeCollection: (id, collectionData) => api.put(`/fees/collections/${id}`, collectionData),
  deleteFeeCollection: (id) => api.delete(`/fees/collections/${id}`),
  
  // Fee Reports
  getFeeReports: (params) => api.get('/fees/reports', { params }),
  getStudentFeeHistory: (studentId) => api.get(`/fees/student/${studentId}/history`),
  getCollegeFeeSummary: () => api.get('/fees/college/summary'),
};

// Colleges API
export const collegesAPI = {
  getAll: () => api.get('/colleges'),
  getById: (id) => api.get(`/colleges/${id}`),
  create: (collegeData) => api.post('/colleges', collegeData),
  update: (id, collegeData) => api.put(`/colleges/${id}`, collegeData),
  delete: (id) => api.delete(`/colleges/${id}`),
  
  // College-specific data
  getCollegeUsers: (collegeId) => api.get(`/colleges/${collegeId}/users`),
  getCollegeCourses: (collegeId) => api.get(`/colleges/${collegeId}/courses`),
  getCollegeStats: (collegeId) => api.get(`/colleges/${collegeId}/stats`),
};

// Messages API
export const messagesAPI = {
  sendMessage: (messageData) => {
    // Handle FormData for file uploads
    if (messageData instanceof FormData) {
      return api.post('/messages', messageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/messages', messageData);
  },
  getMessages: (params = {}) => api.get('/messages', { params }),
  getSentMessages: (params = {}) => api.get('/messages/sent', { params }),
  getMessage: (messageId) => api.get(`/messages/${messageId}`),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get('/messages/unread/count'),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

// Utility functions for form data handling
export const formUtils = {
  // Validate form data before submission
  validateFormData: (data, requiredFields) => {
    const errors = {};
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors[field] = `${field} is required`;
      }
    });
    return errors;
  },

  // Format form data for API submission
  formatFormData: (formData) => {
    const formatted = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        formatted[key] = formData[key];
      }
    });
    return formatted;
  },

  // Handle API errors
  handleApiError: (error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'An unexpected error occurred';
  },

  // Success message handler
  handleApiSuccess: (response) => {
    return response.data?.message || 'Operation completed successfully';
  },
};

// Export the main api instance for custom requests
export default api; 