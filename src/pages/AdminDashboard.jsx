import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Sofa,
  Bed,
  Utensils,
  Home,
  Inbox,
  PlusCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  PenTool,
  Building2,
  Palette,
  Eye,
  X,
  MessageCircle
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardApi, enquiryApi } from '../services/api';
import { CLIENT_CATEGORIES } from '../constants/catalogCategories';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { admin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [updatingEnquiryId, setUpdatingEnquiryId] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    setUpdatingEnquiryId(enquiryId);
    try {
      await enquiryApi.updateStatus(enquiryId, newStatus);
      toast.success(`Enquiry marked as ${newStatus}`);
      await fetchStats();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingEnquiryId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle="Loading Operations">
        <div className="py-24">
          <LoadingSpinner text="Loading studio operations & project telemetry..." />
        </div>
      </AdminLayout>
    );
  }

  const counts = stats?.counts || {};
  const recentEnquiries = stats?.recentEnquiries || [];
  const recentProjects = stats?.recentProjects || [];

  const filteredEnquiries = recentEnquiries.filter((enq) => {
    if (enquiryFilter === 'all') return true;
    return enq.status?.toLowerCase() === enquiryFilter.toLowerCase();
  });

  const totalEnq = counts.totalEnquiries || 0;
  const closedEnq = counts.closedEnquiries || 0;
  const conversionRate = totalEnq > 0 ? Math.round((closedEnq / totalEnq) * 100) : 0;

  const clientSectorIcons = {
    'furniture-manufacturers-dealers': Sofa,
    'interior-design-companies-designers': PenTool,
    'real-estate-developers-builders': Building2,
    'home-decor-tiles-flooring': Layers,
    'modular-kitchen-wardrobe-companies': Utensils
  };

  const clientSectors = CLIENT_CATEGORIES.slice(0, 5).map((cat) => ({
    ...cat,
    icon: clientSectorIcons[cat.id] || Layers
  }));

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="DAILY STUDIO OPERATIONS • PROJECTS & LEADS"
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          {isSuperAdmin && (
            <Link
              to="/superadmin/dashboard"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg hover:border-amber-400 hover:bg-stone-50 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Superadmin View</span>
            </Link>
          )}
          <Link
            to="/admin/projects/add"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Add New Project</span>
          </Link>
        </div>
      }
    >

      {/* 2. 4 Clean High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 mb-6 sm:mb-7">
        {/* Card 1: Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-amber-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Client Inquiries</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{counts.totalEnquiries || 0}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {counts.newEnquiries || 0} New
            </span>
          </div>
          <Link
            to="/admin/enquiries"
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center justify-between group"
          >
            <span>Review Leads</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 2: Portfolio Projects */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-stone-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Live Projects</span>
            <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{counts.totalProjects || 0}</span>
            <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Published
            </span>
          </div>
          <Link
            to="/admin/projects"
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center justify-between group"
          >
            <span>Manage Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 3: Try-On Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-amber-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Try-On Items</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{counts.totalPopularItems || 0}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Interactive
            </span>
          </div>
          <Link
            to="/admin/popular-items"
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center justify-between group"
          >
            <span>Configure Showcase</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 4: Client Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-blue-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Client Accounts</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{counts.totalClients || 0}</span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Portals
            </span>
          </div>
          <Link
            to="/admin/users"
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between group"
          >
            <span>View Clients Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* 3. Middle Section: Project Distribution Matrix & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-6 sm:mb-7">
        {/* Left Column: 5 Client Specialized Categories (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block mb-0.5">
                  5 Specialized Sectors
                </span>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-600" />
                  Select Client Category
                </h3>
              </div>
              <Link to="/admin/catalog" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2 sm:space-y-2.5">
              {clientSectors.map((sector) => {
                const Icon = sector.icon;
                return (
                  <Link
                    key={sector.id}
                    to="/admin/catalog"
                    className="p-2.5 sm:p-3 rounded-xl border border-stone-200/90 hover:border-amber-400 hover:bg-stone-50/80 transition-all flex items-center justify-between gap-2.5 sm:gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-stone-100 group-hover:bg-amber-100/70 border border-stone-200 group-hover:border-amber-300 flex items-center justify-center text-stone-700 group-hover:text-amber-900 shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-900 transition-colors">
                          {sector.label}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-stone-500 truncate mt-0.5">
                          {sector.badge}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="text-[10px] font-bold font-mono px-1.5 sm:px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                        {sector.objects.length} Objects
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-stone-100">
            <Link
              to="/admin/catalog"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage Client Catalog & 5 Sectors</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Featured Projects Cards (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-4 sm:p-5 lg:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-stone-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Featured Portfolio Projects
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Recently updated interior works live on website
              </p>
            </div>
            <Link to="/admin/projects" className="text-xs font-bold text-amber-700 hover:text-amber-800 shrink-0">
              Manage ({counts.totalProjects || 0})
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              Abhi koi project add nahi hua hai
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {recentProjects.slice(0, 4).map((proj) => (
                <div
                  key={proj._id}
                  className="border border-stone-200 rounded-lg p-2.5 hover:border-amber-300 transition-all bg-white flex flex-col justify-between group"
                >
                  <div className="relative h-36 sm:h-28 bg-stone-100 rounded-md overflow-hidden mb-2">
                    <img
                      src={proj.mainImage || proj.images?.[0]}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                      {proj.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-stone-900 truncate">{proj.title}</h4>
                    <p className="text-[11px] text-stone-400 truncate mt-0.5">
                      {proj.location || 'Studio Project'}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <Link
                      to={`/admin/projects/edit/${proj._id}`}
                      className="text-stone-700 hover:text-amber-700 font-semibold"
                    >
                      Edit Project
                    </Link>
                    <a
                      href={`${import.meta.env.VITE_SITE_URL || 'https://ainterior-design-frontend.vercel.app'}/projects/${proj._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-400 hover:text-stone-700 flex items-center gap-1"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Section: Turnkey Inquiries & Leads */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-600" />
              Customer Inquiries & Consultations
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customer leads ko status ke according update aur follow-up karein
            </p>
          </div>

          <div className="w-full sm:w-auto overflow-x-auto flex items-center gap-1 bg-stone-100 p-1 rounded-lg scrollbar-none">
            {['all', 'New', 'Contacted', 'Closed'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setEnquiryFilter(status)}
                className={`flex-1 sm:flex-initial text-center px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize whitespace-nowrap cursor-pointer ${
                  enquiryFilter === status
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-medium">Koi inquiry nahi mili iss filter ke liye</p>
          </div>
        ) : (
          <>
            {/* Desktop & Tablet Table (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredEnquiries.slice(0, 6).map((enq) => (
                    <tr key={enq._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900">{enq.name}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                          {enq.phone && <span>{enq.phone}</span>}
                          {enq.email && <span>• {enq.email}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={enq.status || 'New'}
                          disabled={updatingEnquiryId === enq._id}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider focus:outline-none cursor-pointer border transition-colors ${
                            enq.status === 'New'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : enq.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enq)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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

            {/* Mobile Native Card View (< 640px) */}
            <div className="block sm:hidden space-y-3">
              {filteredEnquiries.slice(0, 6).map((enq) => (
                <div
                  key={enq._id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{enq.name}</h4>
                      <p className="text-[11px] text-stone-500">
                        {enq.phone || enq.email}
                      </p>
                    </div>
                    <select
                      value={enq.status || 'New'}
                      disabled={updatingEnquiryId === enq._id}
                      onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider focus:outline-none cursor-pointer border transition-colors shrink-0 ${
                        enq.status === 'New'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* View Details Action Button */}
                  <div className="pt-1 border-t border-stone-200 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(enq)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-stone-300" />
                      <span>View Inquiry</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Consultation Details Modal with WhatsApp Link */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl relative p-6 sm:p-7 space-y-5 animate-fade-in">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 block mb-1">
                Consultation Request Details
              </span>
              <h3 className="text-xl font-bold text-stone-900">
                {selectedEnquiry.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Phone</span>
                {selectedEnquiry.phone ? (
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-stone-800 hover:text-amber-700">
                    {selectedEnquiry.phone}
                  </a>
                ) : (
                  <span className="text-stone-400">N/A</span>
                )}
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Email</span>
                {selectedEnquiry.email ? (
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-stone-800 hover:text-amber-700 truncate block">
                    {selectedEnquiry.email}
                  </a>
                ) : (
                  <span className="text-stone-400">N/A</span>
                )}
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">City</span>
                <span className="font-medium text-stone-800">{selectedEnquiry.city || 'India'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                <span className="font-medium text-stone-800 font-mono">
                  {new Date(selectedEnquiry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Space / Property</span>
                <span className="font-medium text-stone-800 capitalize">
                  {selectedEnquiry.propertyType || selectedEnquiry.projectType || 'Interior Space'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Budget</span>
                <span className="font-semibold text-amber-800 font-mono">
                  {selectedEnquiry.budget || 'Custom Budget'}
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
                    `Hello ${selectedEnquiry.name}, regarding your interior design inquiry for ${selectedEnquiry.propertyType || 'your space'} on Aiterior:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
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

export default AdminDashboard;
