import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from 'expo-constants';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'provider' | 'admin';
  is_active: boolean;
  phone?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Determine the correct backend URL based on environment
const getBackendUrl = () => {
  // Always use localhost for development - this works for both local and preview environments
  // since the backend is running locally on port 8001
  return 'http://localhost:8001';
};

const BACKEND_URL = getBackendUrl();
const API_BASE_URL = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios interceptor to include auth token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Load stored auth data on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      // Check if running on web (SecureStore not available)
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web fallback to localStorage
        const storedToken = window.localStorage.getItem('auth_token');
        const storedUser = window.localStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          try {
            const response = await axios.get('/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            setUser(response.data);
          } catch (error) {
            // Token invalid, clear storage
            await clearAuth();
          }
        }
      } else {
        // Native app - use SecureStore
        const storedToken = await SecureStore.getItemAsync('auth_token');
        const storedUser = await SecureStore.getItemAsync('user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          try {
            const response = await axios.get('/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` }
            });
            setUser(response.data);
          } catch (error) {
            // Token invalid, clear storage
            await clearAuth();
          }
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web fallback
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('user_data');
      } else {
        // Native app
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('user_data');
      }
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
    setToken(null);
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    console.log('🔄 AuthProvider: Login function called', { email, API_BASE_URL });
    
    try {
      console.log('📡 Making login request to:', `${API_BASE_URL}/auth/login`);
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      console.log('✅ Login response received:', response.status);
      const { access_token, user: userData } = response.data;

      // Store auth data
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web fallback
        console.log('💾 Storing auth data in localStorage');
        window.localStorage.setItem('auth_token', access_token);
        window.localStorage.setItem('user_data', JSON.stringify(userData));
      } else {
        // Native app
        console.log('💾 Storing auth data in SecureStore');
        await SecureStore.setItemAsync('auth_token', access_token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
      }

      setToken(access_token);
      setUser(userData);
      console.log('✅ Login successful, user set:', userData.email);
    } catch (error: any) {
      console.error('❌ Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      });
      const message = error.response?.data?.detail || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (email: string, password: string, fullName: string, role: string) => {
    console.log('🔄 AuthProvider: Register function called', { email, fullName, role, API_BASE_URL });
    
    try {
      console.log('📡 Making register request to:', `${API_BASE_URL}/auth/register`);
      
      const response = await axios.post('/auth/register', {
        email,
        password,
        full_name: fullName,
        role
      });

      console.log('✅ Register response received:', response.status);
      const { access_token, user: userData } = response.data;

      // Store auth data
      if (typeof window !== 'undefined' && window.localStorage) {
        // Web fallback
        console.log('💾 Storing auth data in localStorage');
        window.localStorage.setItem('auth_token', access_token);
        window.localStorage.setItem('user_data', JSON.stringify(userData));
      } else {
        // Native app
        console.log('💾 Storing auth data in SecureStore');
        await SecureStore.setItemAsync('auth_token', access_token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
      }

      setToken(access_token);
      setUser(userData);
      console.log('✅ Registration successful, user set:', userData.email);
    } catch (error: any) {
      console.error('❌ Registration error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      });
      const message = error.response?.data?.detail || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    console.log('🚪 Starting logout process...');
    
    // Clear auth state immediately for instant UI update
    setToken(null);
    setUser(null);
    
    // Clear stored data in background
    clearAuth().catch(error => {
      console.error('Error clearing stored auth data:', error);
    });
    
    console.log('✅ Logout completed successfully');
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}