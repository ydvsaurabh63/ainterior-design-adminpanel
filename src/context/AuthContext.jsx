import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('interior_admin_token');
      const savedAdmin = localStorage.getItem('interior_admin_user');

      if (token && savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
          // Verify with server in background
          const profile = await authApi.getProfile();
          setAdmin(profile);
          localStorage.setItem('interior_admin_user', JSON.stringify(profile));
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role || 'admin',
        status: data.status || 'active',
        phone: data.phone || ''
      };
      localStorage.setItem('interior_admin_token', data.token);
      localStorage.setItem('interior_admin_user', JSON.stringify(userData));
      setAdmin(userData);
      toast.success(`Welcome back, ${data.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('interior_admin_token');
    localStorage.removeItem('interior_admin_user');
    setAdmin(null);
    if (notify) {
      toast.success('Logged out successfully');
    }
  };

  const currentRole = admin?.role || 'admin';
  const isSuperAdmin = currentRole === 'superadmin';
  const isAdmin = currentRole === 'admin';
  const isClient = currentRole === 'client';
  const canManageUsers = isSuperAdmin || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        admin,
        user: admin,
        role: currentRole,
        isSuperAdmin,
        isAdmin,
        isClient,
        canManageUsers,
        isAuthenticated: !!admin,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
