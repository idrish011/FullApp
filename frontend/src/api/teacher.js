import axios from 'axios';

//const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = 'https://fullapp-ijlz.onrender.com/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const teacherAPI = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/teacher/stats');
    return response.data;
  },

  // Classes Management
  getClasses: async () => {
    const response = await api.get('/academic/classes');
    return response.data;
  },

  getClass: async (classId) => {
    const response = await api.get(`/academic/classes/${classId}`);
    return response.data;
  },

  // Assignment Management
  getAssignments: async (params = {}) => {
    const response = await api.get('/academic/assignments', { params });
    return response.data;
  },

  getAssignment: async (assignmentId) => {
    const response = await api.get(`/academic/assignments/${assignmentId}`);
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
  getAttendance: async (classId, date) => {
    const response = await api.get(`/academic/classes/${classId}/attendance`, { params: { date } });
    return response.data;
  },

  markAttendance: async (classId, attendanceData) => {
    const response = await api.post(`/academic/classes/${classId}/attendance`, attendanceData);
    return response.data;
  },

  getAttendanceOverview: async () => {
    const response = await api.get('/academic/attendance/overview');
    return response.data;
  },

  getAttendanceReport: async (classId) => {
    const response = await api.get(`/academic/classes/${classId}/attendance/report`);
    return response.data;
  },

  getAttendanceCalendar: async (classId) => {
    const response = await api.get(`/academic/classes/${classId}/attendance/calendar`);
    return response.data;
  },

  // Results Management
  getResults: async (classId) => {
    const response = await api.get(`/academic/classes/${classId}/results`);
    return response.data;
  },

  addResult: async (classId, resultData) => {
    const response = await api.post(`/academic/classes/${classId}/results`, resultData);
    return response.data;
  },

  updateResult: async (classId, resultId, resultData) => {
    const response = await api.put(`/academic/classes/${classId}/results/${resultId}`, resultData);
    return response.data;
  },

  deleteResult: async (classId, resultId) => {
    const response = await api.delete(`/academic/classes/${classId}/results/${resultId}`);
    return response.data;
  },

  // Grading Management
  getPendingGrading: async () => {
    const response = await api.get('/academic/assignments/pending-grading');
    return response.data;
  },

  gradeSubmission: async (assignmentId, studentId, gradeData) => {
    const response = await api.put(`/academic/assignments/${assignmentId}/grade/${studentId}`, gradeData);
    return response.data;
  },

  // Students Management
  getStudents: async (classId) => {
    const response = await api.get(`/academic/classes/${classId}/students`);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get('/teacher/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await api.put(`/teacher/notifications/${notificationId}/read`);
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get('/teacher/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/teacher/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/teacher/change-password', passwordData);
    return response.data;
  },

  // Enhanced Dashboard Features
  getGradeDistribution: async () => {
    const response = await api.get('/dashboard/teacher/grade-distribution');
    return response.data;
  },

  getPerformanceTrends: async () => {
    const response = await api.get('/dashboard/teacher/performance-trends');
    return response.data;
  },

  getUpcomingDeadlines: async () => {
    const response = await api.get('/dashboard/teacher/upcoming-deadlines');
    return response.data;
  },
};

export default api; 