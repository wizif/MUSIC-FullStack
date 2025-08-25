import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import RoleSwitcher from '../shared/RoleSwitcher.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('🔍 Searching for:', searchTerm);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="sticky top-0 z-10 bg-[#121212] p-6 pb-4 w-full">
      <div className="flex items-center justify-between w-full">
        {/* Left - Navigation Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            onClick={() => navigate(-1)} 
            className="w-8 h-8 bg-[#0a0a0a] p-2 rounded-full cursor-pointer hover:bg-[#1a1a1a] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Go back"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={() => navigate(1)} 
            className="w-8 h-8 bg-[#0a0a0a] p-2 rounded-full cursor-pointer hover:bg-[#1a1a1a] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Go forward"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Right Side - Search, Role Switcher, Profile */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a7a7a7]" />
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] lg:w-[364px] pl-12 pr-4 py-3 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-white placeholder-[#a7a7a7] focus:outline-none focus:ring-2 focus:ring-white focus:bg-[#2a2a2a] transition-all duration-200 text-sm"
            />
          </form>

          {/* Role Switcher */}
          <RoleSwitcher />
          
          {/* User Profile */}
          <div className="flex items-center gap-2">
            <button 
              className="bg-[#0d7927] hover:bg-[#1ed760] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all duration-200 text-sm"
              title={user?.name || 'User Profile'}
            >
              {getUserInitials()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;