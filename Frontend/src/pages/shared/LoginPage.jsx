import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, userRole, USER_ROLES } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === USER_ROLES.ADMIN) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      const result = await login({
        name: formData.name.trim(),
        email: formData.email.trim()
      });
      
      if (result.success) {
        console.log('Login successful, navigating...');
        // Navigation will be handled by the useEffect above
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (isAdmin = false) => {
    setLoading(true);
    setError('');

    try {
      const demoCredentials = isAdmin 
        ? {
            name: 'Admin User',
            email: 'admin@MusicOn.com'
          }
        : {
            name: 'Demo User',
            email: 'demo@MusicOn.com'
          };

      const result = await login(demoCredentials);
      
      if (!result.success) {
        throw new Error(result.error || 'Demo login failed');
      }
      // Navigation will be handled by the useEffect above
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <Music className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to MusicOn</h1>
          <p className="text-gray-400">Enter your details to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg">
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-white font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email (use admin@MusicOn.com for admin access)"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={loading}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use email with "admin" or admin@MusicOn.com for admin access
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="mx-4 text-gray-400 text-sm">or try demo</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin(false)}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center"
            >
              <User className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Demo User Account'}
            </button>
            
            <button
              onClick={() => handleDemoLogin(true)}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center"
            >
              <Shield className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Demo Admin Account'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              By continuing, you agree to MusicOn's Terms of Service
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This is a demo application built with React and Node.js
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;