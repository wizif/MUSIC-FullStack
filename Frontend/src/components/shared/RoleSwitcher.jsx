import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const RoleSwitcher = () => {
  const navigate = useNavigate();
  const { user, userRole, isAdmin, logout, USER_ROLES } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleRoleSwitch = (targetRole) => {
    setIsDropdownOpen(false);
    
    if (targetRole === USER_ROLES.ADMIN && !isAdmin) {
      // If user tries to switch to admin but doesn't have admin privileges
      console.warn('Access denied: User does not have admin privileges');
      return;
    }

    // Navigate based on role
    if (targetRole === USER_ROLES.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  const handleBlur = (e) => {
    // Check if the related target is within our dropdown
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDropdownOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" onBlur={handleBlur}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <>
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">Admin</span>
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm font-medium">User</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
          isDropdownOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-600">
            <p className="text-white font-medium truncate">{user.name}</p>
            <p className="text-gray-400 text-sm truncate">{user.email}</p>
          </div>

          {/* Role Options */}
          <div className="py-2">
            <button
              onClick={() => handleRoleSwitch(USER_ROLES.USER)}
              className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                userRole === USER_ROLES.USER ? 'text-green-400' : 'text-gray-300'
              }`}
            >
              <User className="w-4 h-4 mr-3" />
              <span>User Mode</span>
              {userRole === USER_ROLES.USER && (
                <span className="ml-auto text-green-400">•</span>
              )}
            </button>

            {/* Show admin option only if user has admin privileges */}
            {(isAdmin || user.email.toLowerCase().includes('admin') || 
              ['admin@MusicOn.com', 'admin@music.com', 'superadmin@MusicOn.com'].includes(user.email.toLowerCase())) && (
              <button
                onClick={() => handleRoleSwitch(USER_ROLES.ADMIN)}
                className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                  userRole === USER_ROLES.ADMIN ? 'text-purple-400' : 'text-gray-300'
                }`}
              >
                <Shield className="w-4 h-4 mr-3" />
                <span>Admin Mode</span>
                {userRole === USER_ROLES.ADMIN && (
                  <span className="ml-auto text-purple-400">•</span>
                )}
              </button>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-600">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left text-red-400 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;