import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageProjects from './pages/ManageProjects';
import AddProject from './pages/AddProject';
import EditProject from './pages/EditProject';
import ManageTestimonials from './pages/ManageTestimonials';
import ManageEnquiries from './pages/ManageEnquiries';
import ManageUsers from './pages/ManageUsers';
import ClientPortal from './pages/ClientPortal';

function App() {
  return (
    <div className="min-h-screen bg-studio-bg text-studio-charcoal selection:bg-studio-bronze selection:text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#181716',
            color: '#FAF8F5',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '13px',
            borderRadius: '0px',
            border: '1px solid #3A3632'
          },
          success: {
            iconTheme: {
              primary: '#B89255',
              secondary: '#181716'
            }
          }
        }}
      />

      <Routes>
        {/* Default route redirects to dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Login */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Client Dedicated Portal */}
        <Route
          path="/client/portal"
          element={
            <ProtectedRoute allowedRoles={['client', 'superadmin', 'admin']}>
              <ClientPortal />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard (Superadmin & Admin) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* User & Role Management (Superadmin & Admin) */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={<Navigate to="/admin/users" replace />}
        />

        {/* Projects (Available for all authenticated) */}
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <ManageProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={<Navigate to="/admin/projects" replace />}
        />

        <Route
          path="/admin/projects/add"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <AddProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/add"
          element={<Navigate to="/admin/projects/add" replace />}
        />

        <Route
          path="/admin/projects/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <EditProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <ManageTestimonials />
            </ProtectedRoute>
          }
        />
        <Route
          path="/testimonials"
          element={<Navigate to="/admin/testimonials" replace />}
        />

        <Route
          path="/admin/enquiries"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <ManageEnquiries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enquiries"
          element={<Navigate to="/admin/enquiries" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
