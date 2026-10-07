import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Inbox,
  Building2,
  Phone,
  Mail,
  PlusCircle,
  X,
  ExternalLink,
  ArrowUpRight,
  Users,
  Palette,
  Layers,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Tag,
  ShieldCheck,
  Package,
  Eye,
  MessageCircle
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { userApi, enquiryApi, catalogApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CLIENT_CATEGORIES, getClientCategoryMeta } from '../constants/catalogCategories';
import toast from 'react-hot-toast';

const ClientPortal = () => {
  const { admin: authUser } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'inquiries' | 'users' | 'catalog' | 'request'

  // Modals & sub-state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [categoryUsers, setCategoryUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [categoryCatalog, setCategoryCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Form state for creating a new design request to admin
  const [requestForm, setRequestForm] = useState({
    propertyType: 'Living Room',
    budget: '₹10L - ₹25L',
    phone: '',
    message: ''
  });

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await userApi.getClientOverview();
      setOverview(data);
      if (data?.client?.phone) {
        setRequestForm((prev) => ({ ...prev, phone: data.client.phone }));
      }
    } catch (err) {
      console.error('Failed to load client overview:', err);
      toast.error('Could not load client details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Fetch category users when user tab selected
  const fetchCategoryUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await userApi.getAll({ role: 'user' });
      setCategoryUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Could not load category users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch category catalog items
  const fetchCategoryCatalog = async (cats) => {
    setLoadingCatalog(true);
    try {
      const primaryCat = cats?.[0];
      const data = await catalogApi.getAll({
        clientCategory: primaryCat || undefined
      });
      setCategoryCatalog(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Could not load catalog:', err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && categoryUsers.length === 0) {
      fetchCategoryUsers();
    }
    if (activeTab === 'catalog' && categoryCatalog.length === 0) {
      const clientCats = overview?.client?.categories?.length
        ? overview.client.categories
        : (overview?.client?.assignedCategory ? [overview.client.assignedCategory] : []);
      fetchCategoryCatalog(clientCats);
    }
  }, [activeTab, overview]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await enquiryApi.updateStatus(enquiryId, { status: newStatus });
      toast.success(`Enquiry marked as ${newStatus}`);
      fetchOverview();
    } catch (err) {
      toast.error(err.message || 'Failed to update enquiry status');
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!requestForm.message.trim()) {
      toast.error('Please enter your project requirements');
      return;
    }

    setSubmitting(true);
    try {
      await enquiryApi.create({
        name: overview?.client?.name || authUser?.name || 'Client',
        email: overview?.client?.email || authUser?.email,
        phone: requestForm.phone || overview?.client?.phone || '',
        propertyType: requestForm.propertyType,
        budget: requestForm.budget,
        message: requestForm.message
      });
      toast.success('Your design request has been submitted successfully!');
      setIsModalOpen(false);
      setRequestForm((prev) => ({ ...prev, message: '' }));
      await fetchOverview();
    } catch (err) {
      toast.error(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Client Dashboard" subtitle="Loading your workspace...">
        <div className="py-24">
          <LoadingSpinner text="Loading client portal..." />
        </div>
      </AdminLayout>
    );
  }

  const client = overview?.client || authUser;
  const assignedAdmin = client?.assignedAdmin;
  const enquiries = overview?.enquiries || [];
  const stats = overview?.stats || {};

  // Client's Assigned Categories (supports 1, 2, or multiple categories dynamically)
  const clientCategories = Array.isArray(client?.categories) && client.categories.length > 0
    ? client.categories
    : (client?.assignedCategory ? [client.assignedCategory] : []);

  // Filter enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchStatus =
      inquiryStatusFilter === 'all' ||
      (enq.status || 'New').toLowerCase() === inquiryStatusFilter.toLowerCase();

    const searchLow = inquirySearch.toLowerCase().trim();
    const matchSearch =
      !searchLow ||
      (enq.name && enq.name.toLowerCase().includes(searchLow)) ||
      (enq.email && enq.email.toLowerCase().includes(searchLow)) ||
      (enq.phone && enq.phone.includes(searchLow)) ||
      (enq.city && enq.city.toLowerCase().includes(searchLow));

    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout
      title="Client Studio Dashboard"
      subtitle={`WELCOME, ${client?.name || 'CLIENT'} ${
        client?.companyName ? `• ${client.companyName.toUpperCase()}` : ''
      }`}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-stone-600" />
            <span>Manage Users</span>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>New Request to Admin</span>
          </button>
        </div>
      }
    >
      {/* 1. Dynamic Client Category Hero Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-md border border-stone-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Assigned Business Sectors & Categories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {client?.companyName || client?.name || 'Studio Partner'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Your client account is dynamically configured to receive and manage leads, users, and 3D catalog objects for the specialized sectors below.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
            <a
              href="https://ainterior-design-frontend.vercel.app/ai-designer"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>Launch AI Visualizer</span>
              <ArrowUpRight className="w-3 h-3 text-stone-950" />
            </a>
          </div>
        </div>

        {/* Assigned Sector Badges / Cards */}
        <div className="mt-4 pt-4 border-t border-stone-700/60 flex flex-wrap gap-2.5">
          {clientCategories.length > 0 ? (
            clientCategories.map((catKey) => {
              const meta = getClientCategoryMeta(catKey);
              return (
                <div
                  key={catKey}
                  className="bg-white/10 backdrop-blur-xs border border-white/15 px-3.5 py-2 rounded-xl flex items-center gap-2.5"
                >
                  <span className="text-base">{meta?.badge?.split(' ')[0] || '🏷️'}</span>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {meta?.label || catKey}
                    </div>
                    <div className="text-[10px] text-amber-300/90 font-medium">
                      {meta?.badge?.split(' ').slice(1).join(' ') || 'Active Sector'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-stone-400 italic">
              No specific sector assigned yet. Contact your regional admin to configure specialized categories.
            </div>
          )}
        </div>
      </div>

      {/* 2. Dynamic KPI Metric Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Card 1: Category Leads */}
        <div
          onClick={() => setActiveTab('inquiries')}
          className="bg-white p-4 sm:p-5 border border-stone-200 rounded-xl shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold">
              Category Leads
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {stats.totalEnquiries || enquiries.length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {stats.newEnquiries || enquiries.filter((e) => (e.status || 'New').toLowerCase() === 'new').length} Awaiting Action
          </div>
        </div>

        {/* Card 2: Category Users */}
        <div
          onClick={() => setActiveTab('users')}
          className="bg-white p-4 sm:p-5 border border-stone-200 rounded-xl shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold">
              My Category Users
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {stats.myUsersCount || categoryUsers.length || 0}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            Managed Customers & Team
          </div>
        </div>

        {/* Card 3: Catalog Objects */}
        <div
          onClick={() => setActiveTab('catalog')}
          className="bg-white p-4 sm:p-5 border border-stone-200 rounded-xl shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold">
              Category Catalog
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {stats.catalogCount || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Specialized 3D Products
          </div>
        </div>

        {/* Card 4: Assigned Regional Admin */}
        <div className="bg-white p-4 sm:p-5 border border-stone-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold">
              Studio Admin
            </span>
            <span className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-sm font-bold text-stone-900 mt-1 truncate">
            {assignedAdmin?.name || 'Studio Administrator'}
          </div>
          <div className="text-[11px] text-stone-500 truncate mt-0.5">
            {assignedAdmin?.email || 'Dedicated support'}
          </div>
        </div>
      </div>

      {/* 3. Dynamic Interactive Dashboard Navigation Tabs */}
      <div className="bg-white border border-stone-200 rounded-xl p-2 mb-6 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inquiries'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Category Inquiries ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Category Users</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Category Catalog & Objects</span>
        </button>

        <button
          onClick={() => setActiveTab('request')}
          className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'request'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Request to Admin</span>
        </button>
      </div>

      {/* ========================================================
          TAB CONTENT: 1. OVERVIEW
          ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Inquiries Preview */}
          <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Recent Inquiries for Your Category
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Direct customer leads routed based on your assigned sector
                </p>
              </div>
              <button
                onClick={() => setActiveTab('inquiries')}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Inquiries</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {enquiries.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                <Inbox className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">No customer inquiries yet</p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  When visitors submit enquiries for your category on the website, they will appear here automatically.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop & Tablet Table (>= 640px) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Sector</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {enquiries.slice(0, 5).map((enq) => (
                        <tr key={enq._id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{enq.name}</div>
                            {enq.city && <div className="text-[11px] text-stone-400">{enq.city}</div>}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded">
                              {getClientCategoryMeta(enq.category || enq.clientCategory)?.badge?.split(' ')[0] || '🏷️'}
                              <span className="truncate max-w-[120px]">
                                {getClientCategoryMeta(enq.category || enq.clientCategory)?.label || enq.category || 'Lead'}
                              </span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={enq.status || 'New'}
                              onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border cursor-pointer transition-colors ${
                                (enq.status || 'New').toLowerCase() === 'new'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : (enq.status || '').toLowerCase() === 'contacted'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedEnquiry(enq)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title="View Consultation Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-600" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Native Card List (< 640px) */}
                <div className="block sm:hidden divide-y divide-stone-100">
                  {enquiries.slice(0, 5).map((enq) => (
                    <div key={enq._id} className="p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                            {enq.name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-stone-900 text-xs truncate">{enq.name}</h4>
                            {enq.city && <p className="text-[10px] text-stone-400 truncate">{enq.city}</p>}
                          </div>
                        </div>

                        <span className="shrink-0 text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                          {getClientCategoryMeta(enq.category || enq.clientCategory)?.label || 'Lead'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-50">
                        <select
                          value={enq.status || 'New'}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border cursor-pointer ${
                            (enq.status || 'New').toLowerCase() === 'new'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : (enq.status || '').toLowerCase() === 'contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-600" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs hover:border-amber-400 transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-800">
                  Manage Category Users
                </h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  Add team accounts, view customer signups and profile permissions.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/catalog"
              className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs hover:border-amber-400 transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-800">
                  Manage Category Catalog
                </h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  Upload & curate 3D furniture, modular cabinetry, tiles, and decor objects.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/playground"
              className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs hover:border-amber-400 transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-800">
                  AI Studio Playground
                </h4>
                <p className="text-[11px] text-stone-500 mt-1">
                  Test virtual room staging with your category items and visualize rooms.
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB CONTENT: 2. INQUIRIES & LEADS
          ======================================================== */}
      {activeTab === 'inquiries' && (
        <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['all', 'New', 'Contacted', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setInquiryStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    inquiryStatusFilter === st
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' ? 'All Leads' : st}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by name, phone..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-400 text-stone-900"
              />
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="py-16 text-center text-stone-500">
              <Inbox className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-stone-700">No matching inquiries found</h4>
              <p className="text-[11px] text-stone-400 mt-1">
                Try clearing search terms or changing your status filter.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Table (>= 640px) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Sector</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          <div>{enq.name}</div>
                          {enq.city && <div className="text-[11px] text-stone-400 font-normal">{enq.city}</div>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
                            <span>{getClientCategoryMeta(enq.category || enq.clientCategory)?.badge?.split(' ')[0] || '🏷️'}</span>
                            <span className="truncate max-w-[140px]">
                              {getClientCategoryMeta(enq.category || enq.clientCategory)?.label || enq.category || 'General'}
                            </span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={enq.status || 'New'}
                            onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                            className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border cursor-pointer ${
                              (enq.status || 'New').toLowerCase() === 'new'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : (enq.status || '').toLowerCase() === 'contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="View Consultation Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-stone-600" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Native Card List (< 640px) */}
              <div className="block sm:hidden divide-y divide-stone-100">
                {filteredEnquiries.map((enq) => (
                  <div key={enq._id} className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {enq.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-stone-900 text-xs truncate">{enq.name}</h4>
                          {enq.city && <p className="text-[10px] text-stone-400 truncate">{enq.city}</p>}
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                        {getClientCategoryMeta(enq.category || enq.clientCategory)?.label || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-50">
                      <select
                        value={enq.status || 'New'}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border cursor-pointer ${
                          (enq.status || 'New').toLowerCase() === 'new'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : (enq.status || '').toLowerCase() === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>

                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================
          TAB CONTENT: 3. MY CATEGORY USERS
          ======================================================== */}
      {activeTab === 'users' && (
        <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Registered Users Under Your Sector
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Customer accounts and team members assigned to your studio categories
              </p>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Full User Directory & Add User</span>
            </Link>
          </div>

          {loadingUsers ? (
            <div className="py-12">
              <LoadingSpinner text="Loading category users..." />
            </div>
          ) : categoryUsers.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-stone-700">No users found under your category</h4>
              <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto">
                You can create sub-accounts or team members for your studio using the user directory.
              </p>
              <Link
                to="/admin/users"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
              >
                <span>Go to User Directory</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categoryUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900">{u.name}</td>
                      <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">{u.email}</td>
                      <td className="py-3 px-4 text-stone-600">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {u.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB CONTENT: 4. CATEGORY CATALOG & OBJECTS
          ======================================================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Objects Breakdown for Assigned Sectors */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Supported Objects in Your Assigned Sectors
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Items that your studio specializes in and can offer via the catalog
                </p>
              </div>
              <Link
                to="/admin/catalog"
                className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
              >
                <span>Full Catalog Manager</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientCategories.map((catKey) => {
                const meta = getClientCategoryMeta(catKey);
                return (
                  <div
                    key={catKey}
                    className="border border-stone-200 rounded-xl p-4 bg-stone-50/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{meta?.badge?.split(' ')[0] || '🏷️'}</span>
                        <span>{meta?.label || catKey}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {meta?.objects?.length || 0} Objects
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {meta?.objects?.map((objName) => (
                        <span
                          key={objName}
                          className="text-[10px] px-2 py-1 bg-white border border-stone-200 text-stone-700 rounded-md font-medium"
                        >
                          {objName}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Catalog Items Grid / Preview */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Products in Your Specialized Categories
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Items currently listed in the studio 3D catalog
                </p>
              </div>
              <Link
                to="/admin/catalog"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Add Item in Catalog</span>
              </Link>
            </div>

            {loadingCatalog ? (
              <div className="py-10">
                <LoadingSpinner text="Loading catalog items..." />
              </div>
            ) : categoryCatalog.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-stone-700">No catalog items uploaded yet</h4>
                <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto">
                  Upload catalog furniture or cabinetry items to let customers visualize them in their rooms.
                </p>
                <Link
                  to="/admin/catalog"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                >
                  <span>Open Catalog Manager</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryCatalog.slice(0, 6).map((item) => (
                  <div
                    key={item._id}
                    className="border border-stone-200 rounded-xl overflow-hidden hover:border-amber-400 transition-colors bg-stone-50/50 flex flex-col justify-between"
                  >
                    <div className="h-40 bg-stone-200 overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {item.objectCategory}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                      <div className="text-[11px] text-amber-800 font-mono font-bold mt-1">
                        {item.price ? `₹${item.price.toLocaleString()}` : 'Custom Quotation'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB CONTENT: 5. REQUEST TO ADMIN
          ======================================================== */}
      {activeTab === 'request' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs max-w-2xl mx-auto">
          <div className="mb-5 pb-4 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900">
              Submit Design Brief to Managing Admin
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Your assigned studio admin will review the requirements, prepare quotation estimates, and get in touch.
            </p>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Space / Room Type *
              </label>
              <select
                value={requestForm.propertyType}
                onChange={(e) => setRequestForm({ ...requestForm, propertyType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 font-medium cursor-pointer"
              >
                <option value="Living Room">Living Room</option>
                <option value="Master Bedroom">Master Bedroom</option>
                <option value="Modular Kitchen">Modular Kitchen</option>
                <option value="Full Home / Apartment">Full Home / Apartment</option>
                <option value="Villa / Penthouse">Villa / Penthouse</option>
                <option value="Commercial / Office">Commercial / Office</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Budget Estimate
                </label>
                <select
                  value={requestForm.budget}
                  onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 font-medium cursor-pointer"
                >
                  <option value="Under ₹10L">Under ₹10 Lakhs</option>
                  <option value="₹10L - ₹25L">₹10L - ₹25 Lakhs</option>
                  <option value="₹25L - ₹50L">₹25L - ₹50 Lakhs</option>
                  <option value="₹50L+">₹50 Lakhs+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={requestForm.phone}
                  onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Project Details / Requirements *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your design preference, floor area, or what you want changed..."
                value={requestForm.message}
                onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit Request to Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Modal for New Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-stone-200 rounded-2xl shadow-xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-stone-900 mb-1">New Design Request</h3>
            <p className="text-xs text-stone-500 mb-4">
              Submit your room or project requirements directly to your managing studio admin.
            </p>

            <form onSubmit={handleCreateRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Space / Room Type *
                </label>
                <select
                  value={requestForm.propertyType}
                  onChange={(e) => setRequestForm({ ...requestForm, propertyType: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 font-medium cursor-pointer"
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Master Bedroom">Master Bedroom</option>
                  <option value="Modular Kitchen">Modular Kitchen</option>
                  <option value="Full Home / Apartment">Full Home / Apartment</option>
                  <option value="Villa / Penthouse">Villa / Penthouse</option>
                  <option value="Commercial / Office">Commercial / Office</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Budget Estimate
                  </label>
                  <select
                    value={requestForm.budget}
                    onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 font-medium cursor-pointer"
                  >
                    <option value="Under ₹10L">Under ₹10 Lakhs</option>
                    <option value="₹10L - ₹25L">₹10L - ₹25 Lakhs</option>
                    <option value="₹25L - ₹50L">₹25L - ₹50 Lakhs</option>
                    <option value="₹50L+">₹50 Lakhs+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={requestForm.phone}
                    onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Project Details / Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your design preference, floor area, or what you want changed..."
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consultation Details Modal with Direct WhatsApp Action */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-2xs">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0">
                {selectedEnquiry.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-stone-900 truncate">
                  {selectedEnquiry.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {getClientCategoryMeta(selectedEnquiry.category || selectedEnquiry.clientCategory)?.label || 'General Inquiry'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-semibold text-stone-800 font-mono">
                  {selectedEnquiry.phone || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-semibold text-stone-800 truncate block">
                  {selectedEnquiry.email || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">City / Location</span>
                <span className="font-semibold text-stone-800">
                  {selectedEnquiry.city || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Status</span>
                <span className="font-semibold text-amber-800">
                  {selectedEnquiry.status || 'New'}
                </span>
              </div>
            </div>

            {selectedEnquiry.message && (
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-stone-700 block mb-1.5">
                  Client Note / Requirements
                </span>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed max-h-36 overflow-y-auto">
                  {selectedEnquiry.message}
                </div>
              </div>
            )}

            {/* Quick Actions inside Modal: Direct WhatsApp & Call */}
            <div className="flex items-center gap-3 pt-3 border-t border-stone-100 flex-wrap sm:flex-nowrap">
              {selectedEnquiry.phone ? (
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedEnquiry.name}, regarding your interior design inquiry on Aiterior:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              ) : null}

              {selectedEnquiry.phone ? (
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4 text-stone-600" />
                  <span>Call</span>
                </a>
              ) : null}

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-colors cursor-pointer ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ClientPortal;
