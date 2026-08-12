import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and verify session from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('sc_token');
      if (token) {
        try {
          console.log('🔑 Token found, verifying session...');
          // Fetch current user from backend using token (interceptor will add Authorization header)
          const response = await api.get('/api/auth/me');
          if (response.data && response.data.success) {
            setUser(response.data.user);
            console.log('✅ Session restored for user:', response.data.user.name);
          } else {
            throw new Error('Verification failed');
          }
        } catch (err) {
          console.error('❌ Session verification failed. Clearing credentials:', err.message);
          localStorage.removeItem('sc_token');
          setUser(null);
        }
      } else {
        console.log('ℹ️ No saved user session token found');
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    console.log('🔐 Real login attempt started...');
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.data && response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('sc_token', token);
        setUser(userData);
        console.log('✅ Login successful:', userData.name, 'Role:', userData.role);
        return { success: true, user: userData };
      } else {
        throw new Error(response.data?.message || 'Login failed');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      console.error('❌ Login failed:', errMsg);
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    console.log('📝 Registration attempt started...');
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      
      if (response.data && response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('sc_token', token);
        setUser(userData);
        console.log('✅ Registration successful:', userData.name, 'Role:', userData.role);
        return { success: true, user: userData };
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      console.error('❌ Registration failed:', errMsg);
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    localStorage.removeItem('sc_token');
    setUser(null);
    setError(null);
  };

  const updateUser = (userData) => {
    if (!user) {
      console.warn('⚠️ Cannot update user - no user logged in');
      return;
    }
    setUser((prev) => ({ ...prev, ...userData }));
  };

  // Computed properties
  const userRole = user ? user.role : 'user';
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const isAuthenticated = !!user;

  const contextValue = {
    user,
    userRole,
    isLoading,
    error,
    isAdmin,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    setError,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;