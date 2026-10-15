import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building2,
  UserPlus,
  Search,
  Edit2,
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
  Filter,
  Layers,
  Tag,
  Home,
  PenTool,
  Building,
  UtensilsCrossed,
  ShieldCheck,
  Check
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CLIENT_CATEGORIES,
  getAvailableClientCategories,
  getClientCategoryMeta
} from '../constants/catalogCategories';
import toast from 'react-hot-toast';

const ClientManagement = () => {
  const { admin: currentUser, isSuperAdmin, isAdmin, switchSession } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminFilter, setAdminFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [switchingId, setSwitchingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Available specialized categories
  const availableCategories = getAvailableClientCategories();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    status: 'active',
    parentAdminId: '',
    categories: [],
    assignedCategory: ''
  });

  const fetchAdmins = async () => {
    try {
      const data = await userApi.getAdminsList();
      if (Array.isArray(data) && data.length > 0) {
        setAdminsList(data);
        return;
      }
      const fallback = await userApi.getAll({ role: 'admin' });
      if (Array.isArray(fallback)) {
        setAdminsList(fallback);
      }
    } catch (err) {
      console.warn('Admins list fetch failed:', err);
    }
  };

  const fetchClients = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = { role: 'client' };
      if (adminFilter !== 'all') params.adminId = adminFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const data = await userApi.getAll(params);
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load clients:', err);
      toast.error(err.message || 'Failed to load client directory');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    fetchClients();
  }, [adminFilter, categoryFilter]);

  // Client filtering
  const filteredClients = useMemo(() => {
    return clients.filter((cli) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cli.name?.toLowerCase().includes(query) ||
        cli.companyName?.toLowerCase().includes(query) ||
        cli.email?.toLowerCase().includes(query) ||
        cli.phone?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || cli.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const copyToClipboard = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} to clipboard!`);
  };

  const handleLoginAsClient = async (client) => {
    try {
      setSwitchingId(client._id);
      const data = await userApi.impersonate(client._id);
      if (data && data.token) {
        switchSession(data, data.token);
        toast.success(`${client.name || 'Client'} portal me login ho gaye!`);
        const targetPath = data.role === 'client' ? '/client/dashboard' : '/admin/dashboard';
        navigate(targetPath);
      }
    } catch (err) {
      console.error('Failed to login:', err);
      toast.error(err.message || 'Login failed');
    } finally {
      setSwitchingId(null);
    }
  };

  const toggleCategorySelection = (catIdentifier) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.categories) ? [...prev.categories] : [];
      const index = currentList.findIndex(
        (c) => c === catIdentifier || c.toLowerCase() === catIdentifier.toLowerCase()
      );
      if (index >= 0) {
        currentList.splice(index, 1);
      } else {
        currentList.push(catIdentifier);
      }
      return {
        ...prev,
        categories: currentList,
        assignedCategory: currentList[0] || ''
      };
    });
  };

  const openAddModal = () => {
    fetchAdmins();
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      password: '',
      status: 'active',
      parentAdminId: adminsList[0]?._id || '',
      categories: [],
      assignedCategory: ''
    });
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (client) => {
    fetchAdmins();
    setEditingClient(client);
    const clientCats =
      Array.isArray(client.categories) && client.categories.length > 0
        ? client.categories
        : (client.assignedCategory ? [client.assignedCategory] : []);

    setFormData({
      name: client.name || '',
      companyName: client.companyName || '',
      email: client.email || '',
      phone: client.phone || '',
      password: '',
      status: client.status || 'active',
      parentAdminId: client.parentAdminId?._id || client.parentAdminId || '',
      categories: clientCats,
      assignedCategory: client.assignedCategory || clientCats[0] || ''
    });
    setShowPassword(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Client Name and Email are required');
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
        companyName: formData.companyName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'client',
        status: formData.status,
        parentAdminId: formData.parentAdminId || undefined,
        categories: formData.categories || [],
        assignedCategory: formData.categories?.[0] || formData.assignedCategory || ''
      };
      await userApi.create(payload);
      toast.success('New Client account created successfully');
      setIsAddModalOpen(false);
      fetchClients(true);
    } catch (err) {
      toast.error(err.message || 'Failed to create client');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingClient) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Client Name and Email are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        companyName: formData.companyName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: 'client',
        status: formData.status,
        parentAdminId: formData.parentAdminId || null,
        categories: formData.categories || [],
        assignedCategory: formData.categories?.[0] || formData.assignedCategory || ''
      };
      if (formData.password && formData.password.trim().length >= 6) {
        payload.password = formData.password.trim();
      }

      await userApi.update(editingClient._id, payload);
      toast.success('Client updated successfully');
      setEditingClient(null);
      fetchClients(true);
    } catch (err) {
      toast.error(err.message || 'Failed to update client');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (client) => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    try {
      await userApi.update(client._id, { status: newStatus });
      toast.success(`Client marked as ${newStatus}`);
      fetchClients(true);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    setSaving(true);
    try {
      await userApi.delete(clientToDelete._id);
      toast.success('Client deleted successfully');
      setClientToDelete(null);
      fetchClients(true);
    } catch (err) {
      toast.error(err.message || 'Failed to delete client');
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
      title="Client Management"
      subtitle="SUPER ADMIN • CLIENT PORTALS & DIRECTORY"
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          {/* Top Search Bar specifically for Client Management */}
          <div className="relative flex-1 sm:w-64 md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clients by name, company, email..."
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
            <span>+ Add Client</span>
          </button>
        </div>
      }
    >
      {/* Container matching clean light luxury studio card style */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl shadow-xs overflow-hidden text-stone-900">
        {/* Card Header Toolbar with Filters */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col gap-3.5 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Client Accounts</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 font-semibold">
                  {filteredClients.length}
                </span>
              </h2>
              {searchQuery && (
                <span className="text-xs text-stone-500">
                  Found {filteredClients.length} matching "{searchQuery}"
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
                onClick={() => fetchClients(true)}
                disabled={refreshing}
                className="p-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200 rounded-lg transition-colors ml-1"
                title="Refresh list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Secondary Filter Bar: Admin Filter */}
          <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-stone-100 text-xs">
            {/* Filter by Admin */}
            {isSuperAdmin && (
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5">
                <span className="text-stone-500 font-semibold text-[11px]">Assigned Admin:</span>
                <select
                  value={adminFilter}
                  onChange={(e) => setAdminFilter(e.target.value)}
                  className="bg-transparent text-stone-900 font-medium text-xs focus:outline-none cursor-pointer"
                >
                  <option value="all">All Admins</option>
                  {adminsList.map((adm) => (
                    <option key={adm._id} value={adm._id}>
                      {adm.name} ({adm.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(adminFilter !== 'all' || searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setAdminFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 underline ml-auto cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Content Table / List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <LoadingSpinner text="Loading client accounts..." />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto mb-3 text-stone-400">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              {searchQuery || adminFilter !== 'all' || categoryFilter !== 'all'
                ? 'No clients match your filter criteria'
                : 'No Client accounts registered yet'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              {searchQuery || adminFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try resetting the filters or clearing the search keyword.'
                : 'Add a new client account to grant them their specialized portal.'}
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors"
            >
              + Add First Client
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-4 sm:px-6">CLIENT / COMPANY</th>
                  <th className="py-3.5 px-4 sm:px-6">EMAIL</th>
                  <th className="py-3.5 px-4 sm:px-6">ASSIGNED ADMIN</th>
                  <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredClients.map((client) => {
                  const initial = (client.name || 'C').charAt(0).toUpperCase();
                  const isActive = client.status === 'active';
                  const categories =
                    Array.isArray(client.categories) && client.categories.length > 0
                      ? client.categories
                      : (client.assignedCategory ? [client.assignedCategory] : []);

                  const parentAdminName =
                    client.parentAdminId?.name ||
                    adminsList.find((a) => a._id === (client.parentAdminId?._id || client.parentAdminId))?.name ||
                    'Master Studio';

                  return (
                    <tr
                      key={client._id}
                      className="hover:bg-stone-50/60 transition-colors group"
                    >
                      {/* CLIENT / COMPANY */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 truncate">
                              {client.name || 'Client Account'}
                            </div>
                            <div className="text-[11px] text-stone-500 font-medium truncate">
                              {client.companyName ? `🏢 ${client.companyName}` : `Joined ${formatDate(client.createdAt)}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL COLUMN */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                          <span className="truncate">{client.email}</span>
                          <button
                            onClick={() => copyToClipboard(client.email, 'Email copied')}
                            className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* ASSIGNED ADMIN */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-800 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="font-medium truncate max-w-[130px]">{parentAdminName}</span>
                        </div>
                      </td>

                      {/* STATUS COLUMN */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <button
                          onClick={() => handleToggleStatus(client)}
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
                          {/* Direct Login Arrow button */}
                          <button
                            onClick={() => handleLoginAsClient(client)}
                            disabled={switchingId === client._id}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="Direct Login to Portal"
                          >
                            <ArrowRight className={`w-4 h-4 ${switchingId === client._id ? 'animate-pulse text-amber-600' : ''}`} />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => openEditModal(client)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="Edit Client"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setClientToDelete(client)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Client"
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
          ADD CLIENT MODAL
          ======================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-stone-900 my-8"
            >
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Create Client Account</h3>
                    <p className="text-[11px] text-stone-500">Provide credentials & assign supervising Studio Admin</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Client Contact Person <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Luxury Living"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. client@apex.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <option value="active">Active (Access Enabled)</option>
                      <option value="inactive">Inactive (Suspended)</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Studio Admin */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Assigned Studio Admin
                  </label>
                  <select
                    value={formData.parentAdminId}
                    onChange={(e) => setFormData({ ...formData, parentAdminId: e.target.value })}
                    className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="">Master Studio (Direct Superadmin Oversight)</option>
                    {adminsList.map((adm) => (
                      <option key={adm._id} value={adm._id}>
                        {adm.name} ({adm.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Yeh admin is client ke inquiries aur projects ka primary caretaker hoga.
                  </p>
                </div>

                {/* Sector / Categories multi-select */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Client Categories & Sectors
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableCategories.map((cat) => {
                      const isSelected = formData.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategorySelection(cat.id)}
                          className={`p-2 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
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
                    {saving ? 'Creating Client...' : 'Create Client'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          EDIT CLIENT MODAL
          ======================================================== */}
      <AnimatePresence>
        {editingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-stone-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-stone-900 my-8"
            >
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Edit Client Account</h3>
                    <p className="text-[11px] text-stone-500">Update information for {editingClient.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingClient(null)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Client Contact Person <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Reset Password (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Leave blank to keep unchanged"
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
                      <option value="active">Active (Access Enabled)</option>
                      <option value="inactive">Inactive (Suspended)</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Studio Admin */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Assigned Studio Admin
                  </label>
                  <select
                    value={formData.parentAdminId}
                    onChange={(e) => setFormData({ ...formData, parentAdminId: e.target.value })}
                    className="w-full bg-white border border-stone-300 focus:border-stone-900 text-stone-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="">Master Studio (Direct Superadmin Oversight)</option>
                    {adminsList.map((adm) => (
                      <option key={adm._id} value={adm._id}>
                        {adm.name} ({adm.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sector / Categories multi-select */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Client Categories & Sectors
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableCategories.map((cat) => {
                      const isSelected = formData.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategorySelection(cat.id)}
                          className={`p-2 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingClient(null)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
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
        {clientToDelete && (
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
                Delete Client Account?
              </h3>
              <p className="text-xs text-stone-500 text-center mb-6 leading-relaxed">
                Aap sure hain ki aap <strong className="text-stone-900">{clientToDelete.name}</strong> ({clientToDelete.email}) ko delete karna chahte hain? Inka portal access revoke ho jayega.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setClientToDelete(null)}
                  className="w-1/2 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClient}
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

export default ClientManagement;
