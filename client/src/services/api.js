import axios from 'axios';
import useAuthStore from '../store/authStore';
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

// Helper function to format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file type icon
export const getFileTypeIcon = (fileName) => {
  if (!fileName) return '📁';
  const ext = fileName.split('.').pop()?.toLowerCase();
  const icons = {
    pdf: '📄', ppt: '📊', pptx: '📊', doc: '📝', docx: '📝',
    mp4: '🎥', avi: '🎥', mov: '🎥', webm: '🎥',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
    txt: '📄', zip: '📦', rar: '📦'
  };
  return icons[ext] || '📁';
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

// Response interceptor to handle auth errors and common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error types
    if (response?.status === 401) {
      // Only redirect to login for protected routes, not for public pages
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/register', '/about', '/contact', '/privacy', '/terms'];
      const isPublicPath = publicPaths.includes(currentPath) || 
                          currentPath.startsWith('/lich-su-') || 
                          currentPath.startsWith('/content/');
      
      if (!isPublicPath) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    } else if (response?.status === 403) {
      toast.error('Bạn không có quyền thực hiện hành động này');
    } else if (response?.status === 404) {
      toast.error('Không tìm thấy tài nguyên');
    } else if (response?.status === 413) {
      toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn');
    } else if (response?.status === 415) {
      toast.error('Loại file không được hỗ trợ');
    } else if (response?.status >= 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau');
    } else if (!response) {
      // Network error
      toast.error('Lỗi kết nối. Vui lòng kiểm tra internet');
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

// Taxonomy API
export const taxonomyAPI = {
  getTree: () => api.get('/taxonomy'),
};

// Content API with enhanced error handling
export const contentAPI = {
  getAll: (params) => api.get('/content', { params }),
  getMyContent: (params) => api.get('/content/my-content', { params }),
  getById: (id) => api.get(`/content/${id}`),
  getRecentActivities: (params) => api.get('/content/recent-activities', { params }),
  debugAll: () => api.get('/content/debug/all'),
  create: (formData) => {
    return api.post('/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds timeout for file uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // You can dispatch this to a global state if needed
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
  },
  update: (id, formData) => {
    return api.put(`/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds timeout for file uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Update Progress: ${percentCompleted}%`);
      }
    });
  },
  delete: (id) => api.delete(`/content/${id}`),
  approve: (id) => api.post(`/content/${id}/approve`),
  download: (id) => api.post(`/content/${id}/download`),
  
  // Enhanced download with progress tracking
  downloadFile: async (fileUrl, fileName) => {
    try {
      const response = await axios.get(getFileUrl(fileUrl), {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Download Progress: ${percentCompleted}%`);
        }
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
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