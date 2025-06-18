import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
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
    if (error.response?.status === 401) {
      const token = Cookies.get('auth_token');
      
      // Don't redirect for demo tokens, they handle their own validation
      if (!token?.startsWith('demo_token_')) {
        // Clear auth data and redirect to login
        Cookies.remove('auth_token');
        Cookies.remove('user_data');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;