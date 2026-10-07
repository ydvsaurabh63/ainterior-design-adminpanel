import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Filter,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  PenTool,
  Building,
  UtensilsCrossed,
  Tag
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

const ManageUsers = () => {
  const { admin: currentUser, isSuperAdmin, isAdmin } = useAuth();
  const isClient = currentUser?.role === 'client';
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || (isClient ? 'user' : 'all'));
  const [adminFilter, setAdminFilter] = useState(searchParams.get('adminId') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
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
    companyName: '',
    email: '',
    phone: '',
    password: '',
    role: isClient ? 'user' : 'client',
    status: 'active',
    parentAdminId: '',
    categories: [],
    assignedCategory: ''
  });

  // Available specialized categories (Dynamic - no hardcoding!)
  const availableCategories = getAvailableClientCategories();

  // Helper to render icons matching the sectors
  const renderCategoryIcon = (iconKey) => {
    switch (iconKey) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'pen':
        return <PenTool className="w-4 h-4" />;
      case 'building':
        return <Building className="w-4 h-4" />;
      case 'layers':
        return <Layers className="w-4 h-4" />;
      case 'utensils':
        return <UtensilsCrossed className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  // Toggle selection for multiple categories dynamically
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

  // Robust real-time loader for Admins list with automatic fallback
  const fetchAdminsList = async () => {
    try {
      const data = await userApi.getAdminsList();
      if (Array.isArray(data) && data.length > 0) {
        setAdminsList(data);
        return;
      }
      // Fallback: fetch users with role admin directly
      const fallback = await userApi.getAll({ role: 'admin' });
      if (Array.isArray(fallback)) {
        setAdminsList(fallback);
      }
    } catch (err) {
      console.warn('Could not load admins list, attempting fallback to /users?role=admin:', err);
      try {
        const fallback = await userApi.getAll({ role: 'admin' });
        if (Array.isArray(fallback)) {
          setAdminsList(fallback);
        }
      } catch (fErr) {
        console.error('Admins fallback fetch failed:', fErr);
      }
    }
  };

  useEffect(() => {
    fetchAdminsList();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      if (adminFilter !== 'all') params.adminId = adminFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await userApi.getAll(params);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Sync filters if URL search params change
  useEffect(() => {
    const urlRole = searchParams.get('role');
    const urlAdminId = searchParams.get('adminId');
    const urlCategory = searchParams.get('category');
    if (urlRole !== null && urlRole !== roleFilter) {
      setRoleFilter(urlRole || 'all');
    }
    if (urlAdminId !== null && urlAdminId !== adminFilter) {
      setAdminFilter(urlAdminId || 'all');
    }
    if (urlCategory !== null && urlCategory !== categoryFilter) {
      setCategoryFilter(urlCategory || 'all');
    }
  }, [searchParams]);

  const handleRoleFilterChange = (newRole) => {
    setRoleFilter(newRole);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newRole === 'all') next.delete('role');
      else next.set('role', newRole);
      return next;
    });
  };

  const handleAdminFilterChange = (newAdminId) => {
    setAdminFilter(newAdminId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newAdminId === 'all') next.delete('adminId');
      else next.set('adminId', newAdminId);
      return next;
    });
  };

  const handleCategoryFilterChange = (newCat) => {
    setCategoryFilter(newCat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newCat === 'all') next.delete('category');
      else next.set('category', newCat);
      return next;
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, adminFilter, categoryFilter, searchQuery]);

  const openAddModal = () => {
    fetchAdminsList();
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      password: '',
      role: isClient ? 'user' : 'client',
      status: 'active',
      parentAdminId: '',
      categories: isClient ? (currentUser?.categories || []) : [],
      assignedCategory: ''
    });
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    fetchAdminsList();
    setEditingUser(user);
    const userCats = Array.isArray(user.categories) && user.categories.length > 0
      ? user.categories
      : (user.assignedCategory ? [user.assignedCategory] : []);

    setFormData({
      name: user.name || '',
      companyName: user.companyName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      role: user.role || 'client',
      status: user.status || 'active',
      parentAdminId: user.parentAdminId?._id || user.parentAdminId || '',
      categories: userCats,
      assignedCategory: user.assignedCategory || userCats[0] || ''
    });
    setShowPassword(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and Email are required');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        categories: formData.categories || [],
        assignedCategory: formData.categories?.[0] || formData.assignedCategory || ''
      };
      await userApi.create(payload);
      toast.success('New user account created successfully');
      setIsAddModalOpen(false);
      fetchUsers();
      fetchAdminsList();
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
        name: formData.name.trim(),
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
        parentAdminId: formData.role === 'client' ? formData.parentAdminId : null,
        categories: formData.categories || [],
        assignedCategory: formData.categories?.[0] || formData.assignedCategory || ''
      };

      if (formData.password && formData.password.trim().length >= 6) {
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

  const handleStatusChange = async (user, newStatus) => {
    if (!newStatus || user.status === newStatus) return;
    try {
      await userApi.update(user._id, { status: newStatus });
      toast.success(`${user.name} is now ${newStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const toggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    handleStatusChange(user, nextStatus);
  };

  // Stats calculation
  const totalCount = users.length;
  const superadminsCount = users.filter((u) => u.role === 'superadmin').length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;
  const clientsCount = users.filter((u) => u.role === 'client').length;
  const usersCount = users.filter((u) => u.role === 'user').length;
  // Dynamically compute available branch Admins by merging adminsList and users currently in state
  const branchAdmins = React.useMemo(() => {
    const map = new Map();
    // 1. Add from adminsList (which includes clientCount)
    (adminsList || []).forEach((a) => {
      if (a && a._id && (a.role === 'admin' || !a.role) && a.role !== 'superadmin') {
        map.set(String(a._id), a);
      }
    });
    // 2. Add from current users state (guaranteed to include all admins visible in table)
    (users || []).forEach((u) => {
      if (u && u._id && u.role === 'admin') {
        const idStr = String(u._id);
        if (!map.has(idStr)) {
          map.set(idStr, u);
        } else {
          const prev = map.get(idStr);
          map.set(idStr, { ...prev, ...u });
        }
      }
    });
    return Array.from(map.values());
  }, [adminsList, users]);

  const roleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-800 border border-amber-300 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Superadmin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300 rounded-full">
            <UserCheck className="w-3.5 h-3.5 text-stone-700" />
            Admin
          </span>
        );
      case 'client':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Client Studio
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200 rounded-full">
            <User className="w-3.5 h-3.5 text-stone-500" />
            User
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title={isSuperAdmin ? 'Hierarchy & User Directory' : isClient ? 'My Category Users Directory' : 'My Client Accounts'}
      subtitle={
        isClient
          ? 'MANAGE REGISTERED CUSTOMERS & TEAM USERS UNDER YOUR ASSIGNED SECTORS'
          : 'ROLE-BASED ACCESS CONTROL (RBAC) • SUPERADMIN • ADMIN • CLIENTS'
      }
      actions={
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
          <span>{isSuperAdmin ? '+ Add User Account' : isClient ? '+ Add Category User' : '+ Add Client Studio'}</span>
        </button>
      }
    >
      {/* 1. Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
            {isSuperAdmin ? 'Total Accounts' : isClient ? 'My Category Users' : 'My Total Clients'}
          </span>
          <div className="text-2xl font-extrabold text-stone-900">{totalCount}</div>
        </div>

        {isSuperAdmin && (
          <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
              Superadmin (Owner)
            </span>
            <div className="text-2xl font-extrabold text-amber-900">{superadminsCount}</div>
          </div>
        )}

        {isSuperAdmin && (
          <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-stone-700 font-bold block mb-1">
              Branch Admins
            </span>
            <div className="text-2xl font-extrabold text-stone-900">{adminsCount}</div>
          </div>
        )}

        <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-blue-800 font-bold block mb-1">
            {isSuperAdmin ? 'Total Studio Clients' : isClient ? 'Active Users' : 'Active Studios'}
          </span>
          <div className="text-2xl font-extrabold text-blue-900">
            {isSuperAdmin ? clientsCount : users.filter((u) => u.status === 'active').length}
          </div>
        </div>
      </div>

      {/* 2. Hierarchy Structure Banner (Superadmin View) */}
      {isSuperAdmin && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              3-Tier Management Hierarchy
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white border border-stone-200 rounded-lg p-3">
              <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                <span>Tier 1: Superadmin</span>
                <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded font-mono">Full Access</span>
              </div>
              <p className="text-[11px] text-stone-500">
                System owner with master rights over catalog, AI engine, Admins, and billing.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-3">
              <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                <span>Tier 2: Regional Admins</span>
                <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-mono">{adminsCount} Active</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Manages assigned client studios, catalog designs, and customer enquiries.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-3">
              <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                <span>Tier 3: Client Studios</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">{clientsCount} Studios</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Specialized sector clients (Modular Kitchen, Furniture, Tiles, Decor) managing their category users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => handleRoleFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            All Accounts ({totalCount})
          </button>
          {isSuperAdmin && (
            <>
              <button
                onClick={() => handleRoleFilterChange('admin')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === 'admin'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                Admins ({adminsCount})
              </button>
              <button
                onClick={() => handleRoleFilterChange('superadmin')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === 'superadmin'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                Superadmin ({superadminsCount})
              </button>
            </>
          )}
          {!isClient && (
            <button
              onClick={() => handleRoleFilterChange('client')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === 'client'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              Clients ({clientsCount})
            </button>
          )}
          <button
            onClick={() => handleRoleFilterChange('user')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              roleFilter === 'user'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            End Users ({usersCount})
          </button>
        </div>

        {/* Dynamic Category & Admin Filter & Search Box */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between sm:justify-end flex-wrap">
          {/* Dynamic Sector / Category Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="text-xs px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-700 cursor-pointer font-medium"
              title="Filter by Specialized Sector / Category"
            >
              <option value="all">All Sectors & Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.badge?.split(' ')[0] || '🏷️'} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {isSuperAdmin && branchAdmins.length > 0 && (
            <div className="flex items-center gap-1.5">
              <select
                value={adminFilter}
                onChange={(e) => handleAdminFilterChange(e.target.value)}
                className="text-xs px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-700 cursor-pointer font-medium"
                title="Filter Clients by Admin"
              >
                <option value="all">All Managing Admins</option>
                {branchAdmins.map((adm) => (
                  <option key={adm._id} value={adm._id}>
                    {adm.name} {adm.clientCount != null ? `(${adm.clientCount} Clients)` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, studio, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* 3.1 Active Category Filter Banner */}
      {categoryFilter !== 'all' && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>
                  Filtered by Category: {getClientCategoryMeta(categoryFilter)?.label || categoryFilter}
                </span>
                <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                  {getClientCategoryMeta(categoryFilter)?.badge || 'Specialized'}
                </span>
              </div>
              <div className="text-[11px] text-amber-800 mt-0.5">
                Showing all accounts and users scoped under this sector.
              </div>
            </div>
          </div>
          <button
            onClick={() => handleCategoryFilterChange('all')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-amber-300 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <X className="w-3.5 h-3.5 text-stone-500" />
            <span>Clear Category Filter</span>
          </button>
        </div>
      )}

      {/* 3.2 Active Admin Filter Banner for Superadmin */}
      {isSuperAdmin && adminFilter !== 'all' && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>
                  Filtered: Clients of {adminsList.find((a) => a._id === adminFilter)?.name || 'Admin'}
                </span>
                <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                  {adminsList.find((a) => a._id === adminFilter)?.role || 'admin'}
                </span>
              </div>
              <div className="text-[11px] text-amber-800 mt-0.5">
                Showing accounts managed by this studio administrator ({adminsList.find((a) => a._id === adminFilter)?.email || ''})
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              handleAdminFilterChange('all');
              handleRoleFilterChange('all');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-amber-300 rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <X className="w-3.5 h-3.5 text-stone-500" />
            <span>Clear Filter (Show All Accounts)</span>
          </button>
        </div>
      )}

      {/* 4. Users Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner text="Loading accounts directory..." />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No accounts found</h3>
            <p className="text-xs text-stone-500 mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            {/* Tablet & Desktop Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                    <th className="py-3.5 px-4">User & Studio</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Hierarchy / Managed By</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {users.map((u) => {
                    const isSelf = u._id === currentUser?._id;
                    const canEdit = isSuperAdmin || u.role === 'client';
                    const canDelete = isSuperAdmin ? !isSelf : u.role === 'client';

                    return (
                      <tr key={u._id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Name, Company & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs border border-stone-200 shrink-0">
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <span className="font-bold text-stone-900 block">
                                {u.name} {isSelf && <span className="text-[10px] text-amber-700 font-semibold">(You)</span>}
                              </span>
                              {u.companyName ? (
                                <span className="text-[11px] text-blue-700 font-medium block">
                                  🏢 {u.companyName}
                                </span>
                              ) : null}
                              <span className="text-[10px] text-stone-400">
                                Joined {new Date(u.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5 text-stone-600">
                            <a
                              href={`mailto:${u.email}`}
                              className="flex items-center gap-1.5 hover:text-amber-800 transition-colors truncate"
                            >
                              <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span>{u.email}</span>
                            </a>
                            {u.phone ? (
                              <span className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span>{u.phone}</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-stone-400 italic">No phone</span>
                            )}
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">{roleBadge(u.role)}</td>

                        {/* Hierarchy / Parent Admin */}
                        <td className="py-3.5 px-4">
                          {u.role === 'client' ? (
                            <span className="text-stone-400 font-medium">—</span>
                          ) : u.role === 'admin' ? (
                            isSuperAdmin ? (
                              <button
                                onClick={() => {
                                  handleAdminFilterChange(u._id);
                                  handleRoleFilterChange('client');
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                title={`View Client Studios assigned to ${u.name}`}
                              >
                                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                                <span>View Clients</span>
                              </button>
                            ) : (
                              <span className="text-stone-400 font-medium">—</span>
                            )
                          ) : u.role === 'superadmin' ? (
                            <span className="inline-flex items-center text-[11px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                              System Owner
                            </span>
                          ) : (
                            <span className="text-stone-400 font-medium">—</span>
                          )}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4">
                          {canEdit && !isSelf ? (
                            <div className="relative inline-block">
                              <select
                                value={u.status}
                                onChange={(e) => handleStatusChange(u, e.target.value)}
                                className={`text-[11px] font-bold py-1 pl-2.5 pr-7 rounded-full border cursor-pointer appearance-none transition-all focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                                  u.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/80'
                                    : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100/80'
                                }`}
                                title="Change user status (Active / Inactive)"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                              <ChevronDown
                                className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                                  u.status === 'active' ? 'text-emerald-700' : 'text-rose-700'
                                }`}
                              />
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                                u.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              />
                              <span className="capitalize">{u.status}</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {canEdit && (
                              <button
                                onClick={() => openEditModal(u)}
                                className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit user"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => setUserToDelete(u)}
                                className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

            {/* Mobile Native Card View (< 640px) */}
            <div className="block sm:hidden divide-y divide-stone-100">
              {users.map((u) => {
                const isSelf = u._id === currentUser?._id;
                const canEdit = isSuperAdmin || u.role === 'client';
                const canDelete = isSuperAdmin ? !isSelf : u.role === 'client';

                return (
                  <div key={u._id} className="p-4 bg-white space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs border border-stone-200 shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-stone-900 text-sm truncate">
                            {u.name} {isSelf && <span className="text-[10px] text-amber-700 font-semibold">(You)</span>}
                          </h4>
                          {u.companyName ? (
                            <p className="text-[11px] text-blue-700 font-medium truncate mt-0.5">
                              🏢 {u.companyName}
                            </p>
                          ) : null}
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      {canEdit && !isSelf ? (
                        <div className="relative inline-block shrink-0">
                          <select
                            value={u.status}
                            onChange={(e) => handleStatusChange(u, e.target.value)}
                            className={`text-[10px] font-bold py-1 pl-2 pr-6 rounded-full border cursor-pointer appearance-none transition-all focus:outline-none ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                          <ChevronDown
                            className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                              u.status === 'active' ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          />
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span className="capitalize">{u.status}</span>
                        </span>
                      )}
                    </div>

                    {/* Role & Managed By Row */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-50">
                      <div>{roleBadge(u.role)}</div>

                      {u.role === 'admin' && isSuperAdmin && (
                        <button
                          onClick={() => {
                            handleAdminFilterChange(u._id);
                            handleRoleFilterChange('client');
                          }}
                          className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Building2 className="w-3 h-3 text-amber-600" />
                          <span>View Clients</span>
                        </button>
                      )}
                    </div>

                    {/* Contact Row */}
                    <div className="flex items-center gap-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                      <a
                        href={`mailto:${u.email}`}
                        className="flex-1 flex items-center gap-1.5 hover:text-amber-800 truncate"
                      >
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate text-[11px]">{u.email}</span>
                      </a>
                      {u.phone && (
                        <a
                          href={`tel:${u.phone}`}
                          className="flex items-center gap-1 hover:text-amber-800 shrink-0 text-[11px] font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{u.phone}</span>
                        </a>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {(canEdit || canDelete) && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                            <span>Edit Account</span>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 5. CREATE USER / CLIENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 rounded-2xl shadow-2xl p-6 sm:p-7 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 mb-1">
              {isSuperAdmin ? 'Create New Account' : isClient ? 'Add New Category User' : 'Add New Client Studio'}
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              {isSuperAdmin
                ? 'Create a new Admin or Client account with customized hierarchical access and sector assignment.'
                : isClient
                ? 'Create a new customer or team member account under your assigned sector.'
                : 'Add a new client studio or category partner under your Admin account.'}
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Studio / Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Living Studio"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@studio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
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
                    className="w-full px-3 py-2 pr-10 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role & Parent Admin Selection */}
              {isSuperAdmin ? (
                <div className={`grid gap-3.5 ${formData.role === 'client' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Role & Permissions *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setFormData({
                          ...formData,
                          role: newRole,
                          parentAdminId: newRole === 'admin' ? '' : formData.parentAdminId
                        });
                      }}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 font-medium cursor-pointer"
                    >
                      <option value="client">Client (Category Sector Partner)</option>
                      <option value="admin">Admin (Manage Projects & Clients)</option>
                      <option value="user">User (Customer / Viewer)</option>
                    </select>
                    {formData.role === 'admin' && (
                      <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
                        Admin will have dedicated rights to manage their own projects and oversee assigned clients.
                      </p>
                    )}
                  </div>

                  {formData.role === 'client' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-stone-800">
                          Assign to Managing Admin
                        </label>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {branchAdmins.length} {branchAdmins.length === 1 ? 'Admin' : 'Admins'} available
                        </span>
                      </div>
                      <select
                        value={formData.parentAdminId}
                        onChange={(e) => setFormData({ ...formData, parentAdminId: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 font-medium cursor-pointer"
                      >
                        <option value="">-- Choose Admin to Assign (Optional) --</option>
                        {branchAdmins.map((adm) => (
                          <option key={adm._id} value={adm._id}>
                            {adm.name} ({adm.email}) {adm.clientCount != null ? `• ${adm.clientCount} clients` : ''}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Choose which Admin will oversee this Client Studio.
                      </p>
                    </div>
                  )}
                </div>
              ) : isClient ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 mb-0.5">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>Category Scoped User</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    This user account will be automatically associated with your assigned sectors ({currentUser?.categories?.map((c) => getClientCategoryMeta(c)?.label || c).join(', ') || 'Your Studio'}).
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-600 rounded-lg">
                  <span className="font-bold text-stone-900">Account Level:</span> Client (Interior Studio)
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    This client will be automatically managed under your Admin account.
                  </p>
                </div>
              )}

              {/* Dynamic Category Sector Cards Selection */}
              {formData.role === 'client' && (
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-bold text-amber-800 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        <span>SELECT CLIENT CATEGORY</span>
                      </label>
                      <p className="text-[11px] text-stone-500">
                        {availableCategories.length} Specialized Sectors • Select 1 or multiple sectors this client will manage.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {formData.categories.length} {formData.categories.length === 1 ? 'Sector' : 'Sectors'} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1.5 border border-stone-200 rounded-xl bg-stone-50/70">
                    {availableCategories.map((cat) => {
                      const isSelected =
                        formData.categories.includes(cat.id) ||
                        formData.categories.includes(cat.label);

                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleCategorySelection(cat.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between select-none ${
                            isSelected
                              ? 'bg-[#18181b] text-white border-amber-500 shadow-md ring-1 ring-amber-500/60'
                              : 'bg-white hover:bg-stone-100/80 text-stone-900 border-stone-200 hover:border-amber-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                  isSelected
                                    ? 'bg-stone-800 text-amber-400 border border-stone-700'
                                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                                }`}
                              >
                                {renderCategoryIcon(cat.iconKey)}
                              </div>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-stone-300" />
                              )}
                            </div>
                            <div className="font-bold text-xs leading-snug mb-1">
                              {cat.label}
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-stone-300' : 'text-stone-500'
                              }`}
                            >
                              {cat.badge}
                            </div>
                          </div>

                          <div
                            className={`pt-2 mt-2 border-t flex items-center justify-between text-[10px] ${
                              isSelected
                                ? 'border-stone-800 text-stone-400'
                                : 'border-stone-100 text-stone-400'
                            }`}
                          >
                            <span>{cat.objects?.length || 10} Objects</span>
                            <span className={isSelected ? 'text-amber-400 font-semibold' : ''}>
                              {isSelected ? '✓ Assigned' : '+ Add'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EDIT USER / CLIENT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 rounded-2xl shadow-2xl p-6 sm:p-7 relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 mb-1">Edit Account</h3>
            <p className="text-xs text-stone-500 mb-5">
              Modify account details, sector assignments, hierarchy, or access status.
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Studio / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Change Password (Leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password (optional)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 cursor-pointer"
                  >
                    <option value="active">Active (Access Allowed)</option>
                    <option value="inactive">Inactive (Deactivated)</option>
                  </select>
                </div>

                {isSuperAdmin && formData.role === 'client' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-stone-800">
                        Managing Admin
                      </label>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {branchAdmins.length} Admins
                      </span>
                    </div>
                    <select
                      value={formData.parentAdminId}
                      onChange={(e) => setFormData({ ...formData, parentAdminId: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 cursor-pointer font-medium"
                    >
                      <option value="">-- Choose Admin to Assign --</option>
                      {branchAdmins.map((adm) => (
                        <option key={adm._id} value={adm._id}>
                          {adm.name} ({adm.email}) {adm.clientCount != null ? `• ${adm.clientCount} clients` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Dynamic Category Sector Cards Selection in Edit Modal */}
              {formData.role === 'client' && (
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-bold text-amber-800 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        <span>ASSIGNED CLIENT CATEGORIES</span>
                      </label>
                      <p className="text-[11px] text-stone-500">
                        {availableCategories.length} Specialized Sectors • Manage 1 or multiple sectors for this client.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {formData.categories.length} {formData.categories.length === 1 ? 'Sector' : 'Sectors'} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1.5 border border-stone-200 rounded-xl bg-stone-50/70">
                    {availableCategories.map((cat) => {
                      const isSelected =
                        formData.categories.includes(cat.id) ||
                        formData.categories.includes(cat.label);

                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleCategorySelection(cat.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between select-none ${
                            isSelected
                              ? 'bg-[#18181b] text-white border-amber-500 shadow-md ring-1 ring-amber-500/60'
                              : 'bg-white hover:bg-stone-100/80 text-stone-900 border-stone-200 hover:border-amber-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                                  isSelected
                                    ? 'bg-stone-800 text-amber-400 border border-stone-700'
                                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                                }`}
                              >
                                {renderCategoryIcon(cat.iconKey)}
                              </div>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-stone-300" />
                              )}
                            </div>
                            <div className="font-bold text-xs leading-snug mb-1">
                              {cat.label}
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-stone-300' : 'text-stone-500'
                              }`}
                            >
                              {cat.badge}
                            </div>
                          </div>

                          <div
                            className={`pt-2 mt-2 border-t flex items-center justify-between text-[10px] ${
                              isSelected
                                ? 'border-stone-800 text-stone-400'
                                : 'border-stone-100 text-stone-400'
                            }`}
                          >
                            <span>{cat.objects?.length || 10} Objects</span>
                            <span className={isSelected ? 'text-amber-400 font-semibold' : ''}>
                              {isSelected ? '✓ Assigned' : '+ Add'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full border border-stone-200 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Permanently Delete Account?
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Are you sure you want to delete <strong className="text-stone-900">{userToDelete.name}</strong> ({userToDelete.email})? This action cannot be undone.
                </p>

                <div className="flex items-center justify-end gap-2.5 mt-6">
                  <button
                    onClick={() => setUserToDelete(null)}
                    disabled={saving}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={saving}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? 'Deleting...' : 'Yes, Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUsers;
