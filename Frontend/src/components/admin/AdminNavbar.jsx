import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminNavbar = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('🔍 Admin searching for:', searchTerm);
    }
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
      {/* Left - Navigation */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.03] transition-colors hover:scale-110 transform">
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>
        <button className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.03] transition-colors hover:scale-110 transform">
          <ChevronRight className="h-5 w-5 text-white" />
        </button>
      </div>
      
      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search songs, albums, artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.05] rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:bg-white/[0.08] transition-all duration-200"
          />
        </form>
      </div>
      
      {/* Right - Controls */}
      <div className="flex items-center space-x-4">
        
        {/* Notifications */}
        <button className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.03] transition-colors relative hover:scale-110 transform">
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end">
            <span className="text-white text-sm font-medium">
              {user?.name || 'Admin'}
            </span>
            <span className="text-gray-400 text-xs">
              Administrator
            </span>
          </div>
          <button className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.03] transition-colors hover:scale-110 transform">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getUserInitials()}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;