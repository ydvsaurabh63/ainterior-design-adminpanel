import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Shield,
  UserPlus,
  Search,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Copy,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminManagement = () => {
  const { admin: currentUser, isSuperAdmin, switchSession } = useAuth();
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'active'
  });

  const fetchAdmins = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await userApi.getAll({ role: 'admin' });
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load admins:', err);
      toast.error(err.message || 'Failed to load studio administrators');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filtered admins
  const filteredAdmins = useMemo(() => {
    return admins.filter((adm) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        adm.name?.toLowerCase().includes(query) ||
        adm.email?.toLowerCase().includes(query) ||
        adm.phone?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || adm.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [admins, searchQuery, statusFilter]);

  const copyToClipboard = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} to clipboard!`);
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'active'
    });
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const handleLoginAsAdmin = async (targetAdmin) => {
    try {
      setSwitchingId(targetAdmin._id);
      const data = await userApi.impersonate(targetAdmin._id);
      if (data && data.token) {
        switchSession(data, data.token);
        toast.success(`${targetAdmin.name || 'Admin'} ke dashboard me login ho gaye!`);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Failed to login as admin:', err);
      toast.error(err.message || 'Admin dashboard me login nahi ho paye');
    } finally {
      setSwitchingId(null);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Admin Name and Email are required');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'admin',
        status: formData.status
      };
      await userApi.create(payload);
      toast.success('New Studio Administrator created successfully');
      setIsAddModalOpen(false);
      fetchAdmins(true);
    } catch (err) {
      toast.error(err.message || 'Failed to create administrator');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    try {
      await userApi.update(admin._id, { status: newStatus });
      toast.success(`Admin marked as ${newStatus}`);
      fetchAdmins(true);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    setSaving(true);
    try {
      await userApi.delete(adminToDelete._id);
      toast.success('Admin deleted successfully');
      setAdminToDelete(null);
      fetchAdmins(true);
    } catch (err) {
      toast.error(err.message || 'Failed to delete admin');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <AdminLayout
      title="Admin Management"
      subtitle="SUPER ADMIN • STUDIO ADMINISTRATORS"
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          {/* Top Search Bar specifically for Admin Management */}
          <div className="relative flex-1 sm:w-64 md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search admins by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 placeholder-stone-400 text-xs rounded-lg pl-9 pr-8 py-2 focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Add Admin</span>
          </button>
        </div>
      }
    >
      {/* Container matching light luxury studio card style */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl shadow-xs overflow-hidden text-stone-900">
        {/* Card Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Studio Admins</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-semibold">
                {filteredAdmins.length}
              </span>
            </h2>
            {searchQuery && (
              <span className="text-xs text-stone-500">
                Found {filteredAdmins.length} matching "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Status:</span>
            <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-stone-900 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'inactive'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Inactive
              </button>
            </div>
            <button
              onClick={() => fetchAdmins(true)}
              disabled={refreshing}
              className="p-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200 rounded-lg transition-colors ml-1"
              title="Refresh admins"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Table / List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <LoadingSpinner text="Loading studio administrators..." />
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto mb-3 text-stone-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              {searchQuery ? 'No administrators match your search' : 'No Studio Admins found'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              {searchQuery
                ? 'Try clearing the search query or changing status filters.'
                : 'Click "+ Add Admin" to create the first administrator account.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 bg-stone-100 border border-stone-300 text-stone-700 text-xs rounded-lg hover:bg-stone-200 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors"
              >
                + Add First Admin
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4 sm:px-6">ADMIN</th>
                  <th className="py-3.5 px-4 sm:px-6">EMAIL</th>
                  <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredAdmins.map((admin) => {
                  const initial = (admin.name || 'A').charAt(0).toUpperCase();
                  const isActive = admin.status === 'active';
                  const isCurrent = currentUser?._id === admin._id;

                  return (
                    <tr
                      key={admin._id}
                      className="hover:bg-stone-50/60 transition-colors group"
                    >
                      {/* ADMIN COLUMN: Avatar + Name + Date */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 flex items-center gap-2 truncate">
                              <span className="truncate">{admin.name || 'Studio Admin'}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-300 rounded font-semibold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              Joined {formatDate(admin.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL COLUMN */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                          <span className="truncate">{admin.email}</span>
                          <button
                            onClick={() => copyToClipboard(admin.email, 'Email copied')}
                            className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* STATUS COLUMN */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                            }`}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* ACTIONS COLUMN */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Login as Admin Arrow button */}
                          <button
                            onClick={() => handleLoginAsAdmin(admin)}
                            disabled={switchingId === admin._id}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="Direct Login to Admin Dashboard"
                          >
                            <ArrowRight className={`w-4 h-4 ${switchingId === admin._id ? 'animate-pulse text-amber-600' : ''}`} />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setAdminToDelete(admin)}
                            disabled={isCurrent}
                            className={`p-1.5 rounded transition-colors ${
                              isCurrent
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                            title={isCurrent ? 'Cannot delete current account' : 'Delete Admin'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          ADD ADMIN MODAL
          ======================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-stone-900"
            >
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Create Studio Administrator</h3>
                    <p className="text-[11px] text-stone-500">Add an administrator to handle projects & clients</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Admin Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saurabh Yadav"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@studio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Contact Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg pl-3 pr-9 py-2 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="active">Active (Immediate Login Enabled)</option>
                    <option value="inactive">Inactive (Login Disabled)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Creating Admin...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* ========================================================
          DELETE CONFIRMATION MODAL
          ======================================================== */}
      <AnimatePresence>
        {adminToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-stone-900 p-6"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 text-center mb-1">
                Delete Administrator Account?
              </h3>
              <p className="text-xs text-stone-500 text-center mb-6 leading-relaxed">
                Aap sure hain ki aap <strong className="text-stone-900">{adminToDelete.name}</strong> ({adminToDelete.email}) ko delete karna chahte hain? Is action ke baad inka operational access revoke ho jayega.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdminToDelete(null)}
                  className="w-1/2 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAdmin}
                  disabled={saving}
                  className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminManagement;
