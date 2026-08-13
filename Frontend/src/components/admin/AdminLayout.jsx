import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminNavbar from './AdminNavbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { USER_ROLES } from '../../utils/constants.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';
import Scanner from '../shared/Scanner.jsx';

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
    <div className="h-screen bg-black text-white flex overflow-hidden relative">
      {/* Background Scanner Visual */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <Scanner
          color1="#1ED760"
          color2="#00F2FE"
          color3="#FFFFFF"
          speed={0.4}
          sweepSpeed={0.2}
          sweepWidth={1.6}
          sweepFalloff={6}
          scale={1.5}
          frequency={2}
          ripple={0.22}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.22}
          scanDirection="vertical"
          colorSpread={0.7}
          brightness={1.0}
          contrast={1.15}
          softness={1.4}
          vignette={0.45}
          scanline={true}
          grain={true}
          grainIntensity={0.05}
          opacity={1.0}
          mouseInteraction={true}
          mouseRadius={0.5}
          mouseStrength={0.5}
        />
      </div>

      {/* Sidebar - Fixed navigation */}
      <div className="z-10 relative">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10 relative">
        {/* Top Navigation */}
        <AdminNavbar />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a1a]/40 to-black/60 backdrop-blur-md p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;