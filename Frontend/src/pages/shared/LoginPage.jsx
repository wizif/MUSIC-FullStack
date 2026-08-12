import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isAdmin } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!isLoginMode && !formData.name.trim()) {
      throw new Error('Full name is required for registration');
    }
    if (!formData.email.trim()) {
      throw new Error('Email address is required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      throw new Error('Please enter a valid email address');
    }
    if (!formData.password) {
      throw new Error('Password is required');
    }
    if (formData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      validateForm();

      let result;
      if (isLoginMode) {
        result = await login(formData.email.trim(), formData.password);
      } else {
        result = await register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Authentication failed');
      }
      console.log('Authentication successful!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Quick login failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08080C] text-white flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Premium Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/0 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/0 blur-[130px] pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/0 blur-[90px] pointer-events-none" />

      <div className="w-full max-w-lg z-10 transition-all duration-500">
        
        {/* Logo and Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-[#1ED760] to-[#12A347] shadow-[0_0_30px_rgba(30,215,96,0.3)] mb-4 hover:scale-110 transition-transform duration-300">
            <Music className="w-9 h-9 text-[#08080C]" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            MusicOn
          </h1>
          <p className="text-gray-400 text-sm mt-1.5 font-medium">
            {isLoginMode ? 'Sign in to your account' : 'Create an account to start uploading tracks'}
          </p>
        </div>

        {/* Auth card container with advanced glassmorphism */}
        <div className="bg-[#12121A]/60 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
          
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-white/[0.06] bg-black/20 p-2">
            <button
              onClick={() => {
                setIsLoginMode(true);
                setError('');
              }}
              className={`flex-1 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoginMode
                  ? 'bg-gradient-to-r from-[#1ED760]/10 to-[#1ED760]/20 text-[#1ED760] border border-[#1ED760]/30 shadow-[0_0_15px_rgba(30,215,96,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLoginMode(false);
                setError('');
              }}
              className={`flex-1 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                !isLoginMode
                  ? 'bg-gradient-to-r from-[#1ED760]/10 to-[#1ED760]/20 text-[#1ED760] border border-[#1ED760]/30 shadow-[0_0_15px_rgba(30,215,96,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {/* Display Error Message with modern styling */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 animate-headShake">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 animate-ping" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Field (Register Mode Only) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'name' ? 'text-[#1ED760]' : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-[#1ED760]/60 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1ED760]/10 transition-all duration-300 text-sm"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 pl-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-[#1ED760]' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-[#1ED760]/60 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1ED760]/10 transition-all duration-300 text-sm"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-[#1ED760]' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/[0.08] hover:border-white/[0.18] focus:border-[#1ED760]/60 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1ED760]/10 transition-all duration-300 text-sm"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative mt-2 bg-gradient-to-r from-[#1ED760] to-[#12A347] hover:from-[#22e767] hover:to-[#14b34f] text-[#08080C] font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100 shadow-[0_8px_25px_-5px_rgba(30,215,96,0.3)] hover:shadow-[0_12px_30px_rgba(30,215,96,0.4)] flex items-center justify-center text-sm"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="small" className="text-black" />
                    <span>Processing Secure Auth...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{isLoginMode ? 'Sign In Securely' : 'Complete Setup'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </form>

            {/* Dev hint — only visible in development */}
            {import.meta.env.DEV && (
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#1ED760]" />
                  <span>Dev — Quick Login</span>
                </div>
                <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
                  These buttons only appear in development mode. Accounts must already exist in your MongoDB with passwords ≥ 8 characters.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('superadmin@test.com', 'password123')}
                    disabled={loading}
                    className="flex flex-col text-left p-3 rounded-2xl bg-white/[0.02] hover:bg-[#1ED760]/5 border border-white/[0.05] hover:border-[#1ED760]/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-[#1ED760] transition-colors">Super Admin</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1ED760]" />
                    </div>
                    <span className="text-[10px] text-gray-500 truncate w-full">superadmin@test.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@test.com', 'password123')}
                    disabled={loading}
                    className="flex flex-col text-left p-3 rounded-2xl bg-white/[0.02] hover:bg-[#1ED760]/5 border border-white/[0.05] hover:border-[#1ED760]/20 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-[#1ED760] transition-colors">Admin</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#1ED760] transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                    <span className="text-[10px] text-gray-500 truncate w-full">admin@test.com</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Premium footer */}
        <p className="mt-8 text-center text-xs text-gray-500 font-medium">
          Protected by JWT auth & SSL encryption. Role decisions are strictly enforced backend-side.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;