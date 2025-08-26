import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, ADMIN_PATTERNS } from '../utils/constants.js';

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(USER_ROLES.USER);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const savedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
        
        if (savedUser && savedRole) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setUserRole(savedRole);
          console.log('✅ User restored from localStorage:', parsedUser.name, 'Role:', savedRole);
        } else {
          console.log('ℹ️ No saved user session found');
        }
      } catch (error) {
        console.error('❌ Error restoring user from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save to localStorage whenever user or role changes
  useEffect(() => {
    if (user && userRole) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
      console.log('💾 User session saved to localStorage');
    }
  }, [user, userRole]);

  const determineUserRole = (email) => {
    const emailLower = email.toLowerCase().trim();
    
    // Check if email is in admin list
    if (ADMIN_PATTERNS.EMAILS.includes(emailLower)) {
      console.log('🛡️ Admin access granted - email in admin list');
      return USER_ROLES.ADMIN;
    }
    
    // Check if email contains admin keywords
    const hasAdminKeyword = ADMIN_PATTERNS.KEYWORDS.some(keyword => 
      emailLower.includes(keyword)
    );
    
    if (hasAdminKeyword) {
      console.log('🛡️ Admin access granted - admin keyword detected');
      return USER_ROLES.ADMIN;
    }
    
    console.log('👤 User access granted - regular user');
    return USER_ROLES.USER;
  };

  const login = async (credentials) => {
    console.log('🔐 Login attempt started...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate credentials
      if (!credentials.name?.trim()) {
        throw new Error('Name is required');
      }
      
      if (!credentials.email?.trim()) {
        throw new Error('Email is required');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email.trim())) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call delay (replace with actual API call when you have backend auth)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Determine role based on email
      const detectedRole = determineUserRole(credentials.email);
      
      const userData = {
        id: Date.now().toString(),
        name: credentials.name.trim(),
        email: credentials.email.toLowerCase().trim(),
        loginTime: new Date().toISOString(),
        role: detectedRole
      };
      
      // Set user data and role
      setUser(userData);
      setUserRole(detectedRole);
      
      console.log('✅ Login successful:', userData.name, 'Role:', detectedRole);
      
      return { 
        success: true, 
        user: userData, 
        role: detectedRole 
      };
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      setError(error.message);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logout initiated...');
    try {
      setUser(null);
      setUserRole(USER_ROLES.USER);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      setError(null);
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  const updateUser = (userData) => {
    if (!user) {
      console.warn('⚠️ Cannot update user - no user logged in');
      return;
    }
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    console.log('📝 User data updated:', updatedUser);
  };

  const switchRole = (role) => {
    if (!user) {
      console.warn('⚠️ Cannot switch role - no user logged in');
      return false;
    }

    if (!Object.values(USER_ROLES).includes(role)) {
      console.error('❌ Invalid role:', role);
      return false;
    }

    // Check if user has permission to switch to admin
    if (role === USER_ROLES.ADMIN) {
      const hasAdminPermission = determineUserRole(user.email) === USER_ROLES.ADMIN;
      if (!hasAdminPermission) {
        console.warn('⛔ Access denied - user does not have admin privileges');
        return false;
      }
    }

    setUserRole(role);
    console.log('🔄 Role switched to:', role);
    return true;
  };

  // Computed properties
  const isAdmin = userRole === USER_ROLES.ADMIN && user && determineUserRole(user.email) === USER_ROLES.ADMIN;
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
    login,
    logout,
    updateUser,
    switchRole,
    setError,
    
    // Utils
    determineUserRole,
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