import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_VALUES, USER_ROLES } from '../utils/constants.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage
    const savedUser = localStorage.getItem('spotify_user');
    return savedUser ? JSON.parse(savedUser) : DEFAULT_VALUES.USER;
  });
  
  const [userRole, setUserRole] = useState(() => {
    // Try to load role from localStorage
    const savedRole = localStorage.getItem('spotify_user_role');
    return savedRole || USER_ROLES.USER;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('spotify_user', JSON.stringify(user));
    }
  }, [user]);

  // Save role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spotify_user_role', userRole);
  }, [userRole]);

  const switchRole = (role) => {
    if (Object.values(USER_ROLES).includes(role)) {
      setUserRole(role);
      console.log(`🔄 Role switched to: ${role}`);
    } else {
      console.error('❌ Invalid role:', role);
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate login API call
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        name: credentials.name || 'User',
        email: credentials.email
      };
      
      setUser(userData);
      console.log('✅ User logged in:', userData);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      console.error('❌ Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(USER_ROLES.USER);
    localStorage.removeItem('spotify_user');
    localStorage.removeItem('spotify_user_role');
    console.log('👋 User logged out');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isAuthenticated = !!user;

  const contextValue = {
    // State
    user,
    userRole,
    isLoading,
    error,
    isAdmin,
    isAuthenticated,
    
    // Actions
    switchRole,
    login,
    logout,
    updateUser,
    setUser,
    setError
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