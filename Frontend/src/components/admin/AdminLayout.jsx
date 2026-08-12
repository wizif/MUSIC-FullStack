import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminNavbar from './AdminNavbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { USER_ROLES } from '../../utils/constants.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

const AdminLayout = ({ children }) => {
  const { user, isLoading, isAdmin } = useAuth();

  // Check if user is authenticated and has admin role
  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <LoadingSpinner text="Checking permissions..." size="large" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar - Fixed navigation */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <AdminNavbar />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a1a] to-black p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;