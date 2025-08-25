import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { USER_ROLES } from '../../utils/constants.js';

const RoleSwitcher = () => {
  const { userRole, switchRole, user } = useAuth();
  const navigate = useNavigate();

  // Only show role switcher if user is authenticated
  if (!user) return null;

  const handleRoleSwitch = (role) => {
    // Check if user has permission to switch to admin
    if (role === USER_ROLES.ADMIN) {
      // Only allow admin switch if user email contains 'admin' or specific admin emails
      const adminEmails = ['admin@spotify.com', 'demo@spotify.com'];
      const isAdminUser = adminEmails.includes(user.email?.toLowerCase()) || 
                         user.email?.toLowerCase().includes('admin');
      
      if (!isAdminUser) {
        alert('Access Denied: You do not have admin privileges. Please contact your administrator.');
        return;
      }
    }

    switchRole(role);
    navigate(role === USER_ROLES.ADMIN ? '/admin' : '/');
  };

  return (
    <div className="flex items-center bg-[#000] rounded-full p-1">
      <button
        onClick={() => handleRoleSwitch(USER_ROLES.USER)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          userRole === USER_ROLES.USER 
            ? 'bg-white text-black' 
            : 'text-[#a7a7a7] hover:text-white'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Player</span>
      </button>
      
      <button
        onClick={() => handleRoleSwitch(USER_ROLES.ADMIN)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          userRole === USER_ROLES.ADMIN 
            ? 'bg-white text-black' 
            : 'text-[#a7a7a7] hover:text-white'
        }`}
      >
        <Shield className="w-4 h-4" />
        <span>Admin</span>
      </button>
    </div>
  );
};

export default RoleSwitcher;