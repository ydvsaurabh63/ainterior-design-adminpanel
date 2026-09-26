import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  User,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const { admin: currentUser, isSuperAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client',
    status: 'active'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await userApi.getAll(params);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'client',
      status: 'active'
    });
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      role: user.role || 'client',
      status: user.status || 'active'
    });
    setShowPassword(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Name, email, and password are required');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      await userApi.create(formData);
      toast.success(`${formData.role.toUpperCase()} account created successfully`);
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      await userApi.update(editingUser._id, payload);
      toast.success('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setSaving(true);
    try {
      await userApi.delete(userToDelete._id);
      toast.success('Account deleted permanently');
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await userApi.update(user._id, { status: nextStatus });
      toast.success(`User set to ${nextStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Stats calculation
  const totalCount = users.length;
  const superadminsCount = users.filter((u) => u.role === 'superadmin').length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;
  const clientsCount = users.filter((u) => u.role === 'client').length;

  const roleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">
            <ShieldCheck className="w-3 h-3 text-amber-700" />
            Superadmin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-stone-100 text-stone-800 border border-stone-300">
            <UserCheck className="w-3 h-3 text-studio-bronze" />
            Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-blue-50 text-blue-800 border border-blue-200">
            <User className="w-3 h-3 text-blue-600" />
            Client
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title={isSuperAdmin ? 'Users & Access Control' : 'Client Accounts Directory'}
      subtitle={isSuperAdmin ? 'Role-Based Access Control (RBAC)' : 'Customer Management'}
      actions={
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isSuperAdmin ? 'Add New User' : 'Add New Client'}</span>
        </button>
      }
    >
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-studio-border">
          <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold block mb-1">
            Total Users
          </span>
          <span className="text-2xl font-serif text-studio-charcoal">{totalCount}</span>
        </div>

        {isSuperAdmin && (
          <div className="bg-white p-5 border border-studio-border">
            <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
              Superadmins
            </span>
            <span className="text-2xl font-serif text-amber-900">{superadminsCount}</span>
          </div>
        )}

        {isSuperAdmin && (
          <div className="bg-white p-5 border border-studio-border">
            <span className="text-[11px] uppercase tracking-wider text-studio-bronze font-bold block mb-1">
              Studio Admins
            </span>
            <span className="text-2xl font-serif text-studio-charcoal">{adminsCount}</span>
          </div>
        )}

        <div className="bg-white p-5 border border-studio-border">
          <span className="text-[11px] uppercase tracking-wider text-blue-800 font-bold block mb-1">
            Clients
          </span>
          <span className="text-2xl font-serif text-studio-charcoal">{clientsCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-studio-border p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border ${
              roleFilter === 'all'
                ? 'bg-studio-charcoal text-white border-studio-charcoal'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            All Accounts
          </button>
          {isSuperAdmin && (
            <>
              <button
                onClick={() => setRoleFilter('superadmin')}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border ${
                  roleFilter === 'superadmin'
                    ? 'bg-amber-900 text-white border-amber-900'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Superadmin
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border ${
                  roleFilter === 'admin'
                    ? 'bg-studio-bronze text-white border-studio-bronze'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Admin
              </button>
            </>
          )}
          <button
            onClick={() => setRoleFilter('client')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border ${
              roleFilter === 'client'
                ? 'bg-blue-800 text-white border-blue-800'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            Clients
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-studio-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner text="Loading users directory..." />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-serif text-studio-charcoal">No accounts found</h3>
            <p className="text-xs text-studio-muted mt-1">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-studio-border bg-stone-50 text-[11px] uppercase tracking-wider text-studio-muted font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-border text-xs">
                {users.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  const isTargetSuper = u.role === 'superadmin';
                  const canEdit = isSuperAdmin || (u.role === 'client');
                  const canDelete = isSuperAdmin && !isSelf;

                  return (
                    <tr key={u._id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-studio-charcoal block">
                              {u.name} {isSelf && <span className="text-[10px] text-studio-bronze font-normal">(You)</span>}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5 text-stone-600">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-stone-400" />
                            {u.email}
                          </span>
                          {u.phone ? (
                            <span className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                              <Phone className="w-3 h-3 text-stone-400" />
                              {u.phone}
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">No phone registered</span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4">{roleBadge(u.role)}</td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {canEdit && !isSelf ? (
                          <button
                            onClick={() => toggleStatus(u)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-colors ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                            }`}
                            title="Click to toggle status"
                          >
                            {u.status === 'active' ? (
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-600" />
                            )}
                            {u.status}
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-red-50 text-red-800 border-red-300'
                            }`}
                          >
                            {u.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <button
                              onClick={() => openEditModal(u)}
                              className="p-1.5 text-stone-500 hover:text-studio-bronze hover:bg-stone-100 transition-colors"
                              title="Edit user"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* CREATE USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full border border-studio-border shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif text-studio-charcoal mb-1">
              {isSuperAdmin ? 'Create New User Account' : 'Add New Client'}
            </h3>
            <p className="text-xs text-studio-muted mb-6">
              Create credentials for studio team member or client access.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Kapoor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@studio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                  Temporary Password * (Min 6 chars)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Set secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSuperAdmin ? (
                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Role & Permissions *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  >
                    <option value="client">Client (View Portfolio & Inquiries)</option>
                    <option value="admin">Admin (Manage Projects & Clients)</option>
                    <option value="superadmin">Superadmin (Full System Access)</option>
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-600">
                  <span className="font-semibold">Assigned Role:</span> Client Portal
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full border border-studio-border shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif text-studio-charcoal mb-1">Edit Account</h3>
            <p className="text-xs text-studio-muted mb-6">Modify user details, role, or access status.</p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                  Change Password (Leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password (optional)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isSuperAdmin && editingUser._id !== currentUser?._id && (
                  <div>
                    <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full border border-red-200 shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-serif font-bold">Delete User Account?</h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Are you sure you want to permanently delete the account for{' '}
              <strong className="text-stone-900">{userToDelete.name}</strong> ({userToDelete.email})?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUsers;
