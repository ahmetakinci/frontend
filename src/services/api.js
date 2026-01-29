import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - Token geçersiz, logout yap
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Health check
export const healthCheck = () => api.get('/health');

// Auth endpoints
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');
export const googleLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  window.location.href = `${apiUrl}/auth/google`;
};

// SSH Connection endpoints
export const createSSHConnection = (data) => api.post('/ssh/connections', data);
export const getSSHConnections = () => api.get('/ssh/connections');
export const getSSHConnection = (id) => api.get(`/ssh/connections/${id}`);
export const updateSSHConnection = (id, data) => api.put(`/ssh/connections/${id}`, data);
export const deleteSSHConnection = (id) => api.delete(`/ssh/connections/${id}`);
