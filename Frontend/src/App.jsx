import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';

// Admin Components
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AddSong from './pages/admin/AddSong.jsx';
import AddAlbum from './pages/admin/AddAlbum.jsx';
import ListSong from './pages/admin/ListSong.jsx';
import ListAlbum from './pages/admin/ListAlbum.jsx';

// User Components
import UserLayout from './components/user/Userlayout.jsx';
import DisplayHome from './pages/user/DisplayHome.jsx';
import DisplayAlbum from './pages/user/DisplayAlbum.jsx';

// Shared Components
import LoginPage from './pages/shared/LoginPage.jsx';
import LoadingSpinner from './components/shared/LoadingSpinner.jsx';

import { USER_ROLES } from './utils/constants.js';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading application..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <div className="h-screen bg-black text-white overflow-hidden">
            <Routes>
              {/* Login Route */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/add-song" element={
                <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                  <AdminLayout>
                    <AddSong />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/add-album" element={
                <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                  <AdminLayout>
                    <AddAlbum />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/list-songs" element={
                <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                  <AdminLayout>
                    <ListSong />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/list-albums" element={
                <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                  <AdminLayout>
                    <ListAlbum />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              
              {/* User Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <UserLayout>
                    <DisplayHome />
                  </UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/album/:id" element={
                <ProtectedRoute>
                  <UserLayout>
                    <DisplayAlbum />
                  </UserLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;