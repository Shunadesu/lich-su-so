import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Use proxy in development, relative path in production (Vercel will rewrite to lichsuso.online)
// If Vercel rewrites don't work, set VITE_API_URL=https://lichsuso.online/api in Vercel environment variables
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use Vite proxy in development
  : (import.meta.env.VITE_API_URL || 'https://lichsuso.online/api'); // Direct URL as fallback if rewrites fail

// Helper function to get file URL (now works with Cloudinary)
export const getFileUrl = (fileUrl) => {
  if (!fileUrl) return '';
  // If it's already a full URL (Cloudinary), return as is
  if (fileUrl.startsWith('http')) return fileUrl;
  // If it's a local path, prepend the static base URL
  const STATIC_BASE_URL = import.meta.env.DEV 
    ? ''  // Use relative path in development (Vite proxy)
    : (import.meta.env.VITE_STATIC_URL || 'http://localhost:5000');
  return `${STATIC_BASE_URL}${fileUrl}`;
};

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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('Bạn không có quyền thực hiện hành động này');
    } else if (response?.status === 404) {
      toast.error('Không tìm thấy tài nguyên');
    } else if (response?.status >= 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau');
    } else if (!response) {
      toast.error('Lỗi kết nối. Vui lòng kiểm tra internet');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  registerTeacher: (data) => api.post('/auth/register-teacher', data),
  getMe: () => api.get('/auth/me'),
};

// Taxonomy API
export const taxonomyAPI = {
  getTree: () => api.get('/taxonomy'),
  createGrade: (data) => api.post('/taxonomy/grades', data),
  updateGrade: (id, data) => api.put(`/taxonomy/grades/${id}`, data),
  deleteGrade: (id) => api.delete(`/taxonomy/grades/${id}`),
  createTopic: (data) => api.post('/taxonomy/topics', data),
  updateTopic: (id, data) => api.put(`/taxonomy/topics/${id}`, data),
  deleteTopic: (id) => api.delete(`/taxonomy/topics/${id}`),
  createSection: (data) => api.post('/taxonomy/sections', data),
  updateSection: (id, data) => api.put(`/taxonomy/sections/${id}`, data),
  deleteSection: (id) => api.delete(`/taxonomy/sections/${id}`),
};

// Content API
export const contentAPI = {
  getAll: (params) => api.get('/content', { params }),
  getMyContent: (params) => api.get('/content/my-content', { params }),
  getById: (id) => api.get(`/content/${id}`),
  create: (formData) => {
    return api.post('/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },
  update: (id, formData) => {
    return api.put(`/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
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

