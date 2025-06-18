import api from './api';
import Cookies from 'js-cookie';

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff';
  name: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

// Mock demo users for offline testing
const demoUsers = {
  admin: {
    id: '1',
    username: 'admin',
    email: 'admin@laundrykilat.id',
    role: 'admin' as const,
    name: 'Administrator'
  },
  staff: {
    id: '2',
    username: 'staff',
    email: 'staff@laundrykilat.id',
    role: 'staff' as const,
    name: 'Staff Laundry'
  }
};

// Check if credentials match demo accounts
const isDemoCredentials = (username: string, password: string): boolean => {
  return (username === 'admin' && password === 'admin123') ||
         (username === 'staff' && password === 'staff123');
};

// Handle demo login with mock token
const handleDemoLogin = (credentials: LoginCredentials): LoginResponse => {
  const { username, password } = credentials;
  
  if (username === 'admin' && password === 'admin123') {
    const user = demoUsers.admin;
    const token = `demo_token_admin_${Date.now()}`;
    
    // Store auth data in cookies
    const cookieOptions = {
      expires: credentials.rememberMe ? 30 : 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };
    
    Cookies.set('auth_token', token, cookieOptions);
    Cookies.set('user_data', JSON.stringify(user), cookieOptions);
    
    return {
      success: true,
      token,
      user,
      message: 'Demo login berhasil sebagai Admin'
    };
  }
  
  if (username === 'staff' && password === 'staff123') {
    const user = demoUsers.staff;
    const token = `demo_token_staff_${Date.now()}`;
    
    // Store auth data in cookies
    const cookieOptions = {
      expires: credentials.rememberMe ? 30 : 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };
    
    Cookies.set('auth_token', token, cookieOptions);
    Cookies.set('user_data', JSON.stringify(user), cookieOptions);
    
    return {
      success: true,
      token,
      user,
      message: 'Demo login berhasil sebagai Staff'
    };
  }
  
  throw new Error('Demo credentials tidak valid');
};

// Login function
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Check if using demo credentials first
    if (isDemoCredentials(credentials.username, credentials.password)) {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      return handleDemoLogin(credentials);
    }

    // Regular API login for production credentials
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      const { token, user } = response.data;
      
      // Store auth data in cookies
      const cookieOptions = {
        expires: credentials.rememberMe ? 30 : 1, // 30 days or 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      };
      
      Cookies.set('auth_token', token, cookieOptions);
      Cookies.set('user_data', JSON.stringify(user), cookieOptions);
      
      return response.data;
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error: any) {
    // Handle demo login errors
    if (error.message === 'Demo credentials tidak valid') {
      throw error;
    }
    
    // Handle API errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    // Handle network errors for demo fallback
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      // If API is not available, check if it's demo credentials
      if (isDemoCredentials(credentials.username, credentials.password)) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return handleDemoLogin(credentials);
      }
    }
    
    throw new Error('Network error. Please try again.');
  }
};

// Logout function
export const logoutUser = async (): Promise<void> => {
  try {
    const token = Cookies.get('auth_token');
    
    // Skip API call for demo tokens
    if (!token?.startsWith('demo_token_')) {
      await api.post('/auth/logout');
    }
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout API error:', error);
  } finally {
    // Clear auth data
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
  }
};

// Get current user from cookies
export const getCurrentUser = (): User | null => {
  try {
    const userData = Cookies.get('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = Cookies.get('auth_token');
  const user = getCurrentUser();
  return !!(token && user);
};

// Verify token with server
export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = Cookies.get('auth_token');
    
    // Handle demo tokens
    if (token?.startsWith('demo_token_')) {
      return true; // Demo tokens are always valid
    }
    
    // Verify with API for production tokens
    const response = await api.get('/auth/verify');
    return response.data.valid;
  } catch (error) {
    return false;
  }
};