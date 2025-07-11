import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for protected routes, not for public pages
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/register', '/about', '/contact', '/privacy', '/terms'];
      const isPublicPath = publicPaths.includes(currentPath) || 
                          currentPath.startsWith('/lich-su-') || 
                          currentPath.startsWith('/content/');
      
      if (!isPublicPath) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  createTeacher: (data) => api.post('/auth/create-teacher', data),
  createFirstTeacher: (data) => api.post('/auth/create-first-teacher', data),
};

// Content API
export const contentAPI = {
  getAll: (params) => api.get('/content', { params }),
  getMyContent: (params) => api.get('/content/my-content', { params }),
  getById: (id) => api.get(`/content/${id}`),
  getRecentActivities: (params) => api.get('/content/recent-activities', { params }),
  debugAll: () => api.get('/content/debug/all'),
  create: (formData) => {
    return api.post('/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, formData) => {
    return api.put(`/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/content/${id}`),
  approve: (id) => api.post(`/content/${id}/approve`),
  download: (id) => api.post(`/content/${id}/download`),
};

// User API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  changePassword: (id, data) => api.put(`/users/${id}/password`, data),
  updateStatus: (id, data) => api.put(`/users/${id}/status`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api; 