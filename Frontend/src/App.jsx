import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';

// Import layouts
import UserLayout from './components/user/Userlayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';

// Import pages
import LoginPage from './pages/shared/LoginPage.jsx';
import DisplayHome from './pages/user/DisplayHome.jsx';
import DisplayAlbum from './pages/user/DisplayAlbum.jsx';
import MyTracks from './pages/user/MyTracks.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import UsersPage from './pages/admin/Users.jsx';
import SuperadminPanel from './pages/superadmin/SuperadminPanel.jsx';
import AddSong from './pages/admin/AddSong.jsx';
import AddAlbum from './pages/admin/AddAlbum.jsx';
import ListSong from './pages/admin/ListSong.jsx';
import ListAlbum from './pages/admin/ListAlbum.jsx';

import LoadingSpinner from './components/shared/LoadingSpinner.jsx';

// Protected Route Component for Users
const ProtectedUserRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Authenticating..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Route Component for Admins
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, userRole, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Checking permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin privileges
  if (!isAdmin) {
    console.log('Access denied - redirecting to user dashboard');
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protected Route Component for Superadmins
const ProtectedSuperadminRoute = ({ children }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Checking credentials..." />
      </div>
    );
  }

  // Silent redirect if not superadmin (role check is strict)
  if (!isAuthenticated || userRole !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Loading fallback for authentication check
const AuthLoadingFallback = () => (
  <div className="h-screen bg-black flex items-center justify-center">
    <LoadingSpinner size="large" text="Loading application..." />
  </div>
);

// Main App Router Component
const AppRouter = () => {
  const { isAuthenticated, userRole, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <AuthLoadingFallback />;
  }

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            isAdmin ? 
            <Navigate to="/admin" replace /> : 
            <Navigate to="/" replace />
          ) : (
            <LoginPage />
          )
        } 
      />
      
      {/* User Routes - Protected */}
      <Route path="/" element={
        <ProtectedUserRoute>
          <UserLayout>
            <DisplayHome />
          </UserLayout>
        </ProtectedUserRoute>
      } />
      
      <Route path="/album/:id" element={
        <ProtectedUserRoute>
          <UserLayout>
            <DisplayAlbum />
          </UserLayout>
        </ProtectedUserRoute>
      } />

      <Route path="/profile/mine" element={
        <ProtectedUserRoute>
          <UserLayout>
            <MyTracks />
          </UserLayout>
        </ProtectedUserRoute>
      } />

      {/* Admin Routes - Protected with Admin Role */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </ProtectedAdminRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedAdminRoute>
          <AdminLayout>
            <UsersPage />
          </AdminLayout>
        </ProtectedAdminRoute>
      } />

      <Route path="/sa-7f3k2x-panel" element={
        <ProtectedSuperadminRoute>
          <SuperadminPanel />
        </ProtectedSuperadminRoute>
      } />
      
      <Route path="/admin/add-song" element={
        <ProtectedAdminRoute>
          <AdminLayout>
            <AddSong />
          </AdminLayout>
        </ProtectedAdminRoute>
      } />
      
      <Route path="/admin/add-album" element={
        <ProtectedAdminRoute>
          <AdminLayout>
            <AddAlbum />
          </AdminLayout>
        </ProtectedAdminRoute>
      } />
      
      <Route path="/admin/list-songs" element={
        <ProtectedAdminRoute>
          <AdminLayout>
            <ListSong />
          </AdminLayout>
        </ProtectedAdminRoute>
      } />
      
      <Route path="/admin/list-albums" element={
        <ProtectedAdminRoute>
          <AdminLayout>
            <ListAlbum />
          </AdminLayout>
        </ProtectedAdminRoute>
      } />

      {/* Catch all route - redirect based on authentication */}
      <Route path="*" element={
        isAuthenticated ? (
          isAdmin ? 
          <Navigate to="/admin" replace /> : 
          <Navigate to="/" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="w-full h-full">
      <Router>
        <AuthProvider>
          <PlayerProvider>
            <AppRouter />
          </PlayerProvider>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;