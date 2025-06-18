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

// Login function
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
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
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Network error. Please try again.');
  }
};

// Logout function
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
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
    const response = await api.get('/auth/verify');
    return response.data.valid;
  } catch (error) {
    return false;
  }
};