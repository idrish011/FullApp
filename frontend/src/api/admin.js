import api from './auth';

export const adminAPI = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Password Management
  changePassword: async (passwordData) => {
    const response = await api.put('/admin/change-password', passwordData);
    return response.data;
  },

  resetUserPassword: async (userId, passwordData) => {
    const response = await api.put(`/admin/users/${userId}/reset-password`, passwordData);
    return response.data;
  },

  generateSecurePassword: async () => {
    const response = await api.post('/admin/generate-password');
    return response.data;
  },

  // College Management
  getColleges: async (params = {}) => {
    const response = await api.get('/admin/colleges', { params });
    return response.data;
  },

  createCollege: async (collegeData) => {
    const response = await api.post('/admin/colleges', collegeData);
    return response.data;
  },

  updateCollege: async (collegeId, collegeData) => {
    const response = await api.put(`/admin/colleges/${collegeId}`, collegeData);
    return response.data;
  },

  deleteCollege: async (collegeId) => {
    const response = await api.delete(`/admin/colleges/${collegeId}`);
    return response.data;
  },

  // Academic Management
  getDepartments: async (collegeId) => {
    const response = await api.get(`/admin/colleges/${collegeId}/departments`);
    return response.data;
  },

  getCourses: async (collegeId) => {
    const response = await api.get(`/admin/colleges/${collegeId}/courses`);
    return response.data;
  },

  getClasses: async (collegeId) => {
    const response = await api.get(`/admin/colleges/${collegeId}/classes`);
    return response.data;
  },

  // Fee Management
  getFeeStructures: async (collegeId) => {
    const response = await api.get(`/admin/colleges/${collegeId}/fee-structures`);
    return response.data;
  },

  getFeeCollections: async (collegeId) => {
    const response = await api.get(`/admin/colleges/${collegeId}/fee-collections`);
    return response.data;
  },

  // System Settings
  getSystemSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  // Reports
  getReports: async (type, params = {}) => {
    const response = await api.get(`/admin/reports/${type}`, { params });
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get('/admin/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await api.put(`/admin/notifications/${notificationId}/read`);
    return response.data;
  },
}; 