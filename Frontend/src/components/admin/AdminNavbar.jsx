import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'A';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-[#0a0a0f]/40 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/[0.05]">
      {/* Left - Context Title */}
      <div className="flex items-center space-x-2">
        <span className="text-white font-bold tracking-wide uppercase text-xs bg-purple-600/10 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/20">
          Admin Console
        </span>
      </div>
      
      {/* Right - Controls */}
      <div className="flex items-center space-x-6">
        {/* Go back to player */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.03] transition-all hover:scale-105 text-sm font-medium text-gray-300 hover:text-white"
        >
          <Layout className="h-4 w-4 text-green-500" />
          View Player
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l border-white/10 pl-6">
          <div className="flex flex-col items-end">
            <span className="text-white text-sm font-medium">
              {user?.name || 'Admin'}
            </span>
            <span className="text-gray-400 text-xs">
              System Admin
            </span>
          </div>
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {getUserInitials()}
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all hover:scale-105 text-rose-400"
          title="Log Out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;