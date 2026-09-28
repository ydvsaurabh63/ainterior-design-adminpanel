import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Sofa,
  Bed,
  Utensils,
  Home,
  Inbox,
  MessageSquareQuote,
  PlusCircle,
  ArrowRight,
  Clock,
  Eye,
  Sparkles,
  ShieldCheck,
  Users,
  TrendingUp,
  Activity,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Building,
  Briefcase,
  Sliders,
  DollarSign,
  Palette
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardApi, enquiryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { admin, isSuperAdmin, role } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [updatingEnquiryId, setUpdatingEnquiryId] = useState(null);

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
      <AdminLayout
        title={isSuperAdmin ? 'Executive Studio Suite' : 'Operations Command'}
        subtitle="Initializing Studio Intelligence"
      >
        <div className="py-24">
          <LoadingSpinner text="Compiling architectural telemetry & real-time metrics..." />
        </div>
      </AdminLayout>
    );
  }

  const counts = stats?.counts || {};
  const recentEnquiries = stats?.recentEnquiries || [];
  const recentProjects = stats?.recentProjects || [];
  const popularItemsSample = stats?.popularItemsSample || [];

  // Filtered enquiries
  const filteredEnquiries = recentEnquiries.filter((enq) => {
    if (enquiryFilter === 'all') return true;
    return enq.status?.toLowerCase() === enquiryFilter.toLowerCase();
  });

  // Calculate Conversion Rate
  const totalEnq = counts.totalEnquiries || 0;
  const closedEnq = counts.closedEnquiries || 0;
  const conversionRate = totalEnq > 0 ? Math.round((closedEnq / totalEnq) * 100) : 0;

  // Category Breakdown Data
  const categories = [
    { label: 'Living Rooms', count: counts.livingRoomProjects || 0, icon: Sofa, color: 'bg-amber-600' },
    { label: 'Master Bedroom Suites', count: counts.bedroomProjects || 0, icon: Bed, color: 'bg-stone-700' },
    { label: 'Chef Kitchens', count: counts.kitchenProjects || 0, icon: Utensils, color: 'bg-stone-500' },
    { label: 'Turnkey Full Homes', count: counts.fullHomeProjects || 0, icon: Home, color: 'bg-emerald-700' }
  ];

  const totalCatProjects = counts.totalProjects || 1;

  return (
    <AdminLayout
      title={
        isSuperAdmin ? (
          <span className="flex items-center gap-2.5">
            <span>Executive Studio Director Suite</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded-full font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>DIRECTOR ACCESS</span>
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2.5">
            <span>Studio Lead Architect & Operations Desk</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-stone-100 text-stone-700 border border-stone-300 rounded-full font-mono">
              <Briefcase className="w-3 h-3 text-studio-bronze" />
              <span>PROJECT MANAGER</span>
            </span>
          </span>
        )
      }
      subtitle={isSuperAdmin ? 'Master Architecture Governance & Revenue Overview' : 'Turnkey Project Execution & Client Consultations'}
      actions={
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/popular-items"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-studio-border bg-white text-studio-charcoal text-xs uppercase tracking-wider font-semibold hover:border-studio-bronze transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Try-On Items</span>
          </Link>
          <Link
            to="/admin/projects/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add New Project</span>
          </Link>
        </div>
      }
    >
      {/* 1. Grand Hero Welcome Banner (Tailored for Superadmin vs Admin) */}
      <div className="relative overflow-hidden mb-8 bg-gradient-to-r from-stone-950 via-[#181716] to-stone-900 text-white p-6 sm:p-8 border border-stone-800 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-studio-bronze font-bold font-mono">
                {isSuperAdmin ? 'STUDIO DIRECTOR COMMAND' : 'ACTIVE STUDIO SHIFT'} • LIVE TELEMETRY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-white">
              Welcome back, <span className="text-amber-200 font-light italic">{admin?.name || 'Administrator'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              {isSuperAdmin
                ? 'Comprehensive spatial governance, client pipeline health, and turnkey architectural assets under management.'
                : 'Manage real-time incoming consultations, assign spatial concepts, and coordinate turnkey deliveries seamlessly.'}
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-none min-w-[130px]">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Pending Inquiries</span>
              <span className="text-2xl font-serif text-amber-300 font-semibold mt-0.5 block">
                {counts.newEnquiries || 0}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <Activity className="w-2.5 h-2.5" /> High priority
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-none min-w-[130px]">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Portfolio Works</span>
              <span className="text-2xl font-serif text-white font-semibold mt-0.5 block">
                {counts.totalProjects || 0}
              </span>
              <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-1">
                <Layers className="w-2.5 h-2.5 text-studio-bronze" /> Live published
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-none min-w-[130px]">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Conversion Rate</span>
              <span className="text-2xl font-serif text-white font-semibold mt-0.5 block">
                {conversionRate}%
              </span>
              <span className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-2.5 h-2.5" /> Client closure
              </span>
            </div>
          </div>
        </div>

        {/* Ambient gold radial glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-amber-600/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Primary KPI Grid (High Impact luxury cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Turnkey Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 border border-studio-border hover:border-studio-bronze transition-all shadow-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
                Client Design Inquiries
              </span>
              <div className="w-9 h-9 bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                <Inbox className="w-4 h-4 text-amber-700" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif text-studio-charcoal font-semibold">
                {counts.totalEnquiries || 0}
              </span>
              <span className="text-xs text-amber-700 font-mono font-bold bg-amber-100/70 px-2 py-0.5">
                {counts.newEnquiries || 0} New
              </span>
            </div>
            <p className="text-[11px] text-studio-muted mt-2 font-light">
              {counts.contactedEnquiries || 0} currently in active architectural consultation
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="mt-4 pt-3 border-t border-studio-border/60 text-xs font-semibold text-studio-bronze flex items-center justify-between group-hover:text-studio-charcoal transition-colors"
          >
            <span>Review Inquiries</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 2: Portfolio Projects */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white p-6 border border-studio-border hover:border-studio-bronze transition-all shadow-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
                Portfolio Masterworks
              </span>
              <div className="w-9 h-9 bg-stone-100 border border-stone-200 flex items-center justify-center text-studio-charcoal">
                <Layers className="w-4 h-4 text-studio-bronze" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif text-studio-charcoal font-semibold">
                {counts.totalProjects || 0}
              </span>
              <span className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5">
                Turnkey Active
              </span>
            </div>
            <p className="text-[11px] text-studio-muted mt-2 font-light">
              Across Living, Bedroom, Kitchen and Full-Home categories
            </p>
          </div>
          <Link
            to="/admin/projects"
            className="mt-4 pt-3 border-t border-studio-border/60 text-xs font-semibold text-studio-bronze flex items-center justify-between group-hover:text-studio-charcoal transition-colors"
          >
            <span>Manage Portfolio</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 3: Try-On Furniture Catalog */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-6 border border-studio-border hover:border-studio-bronze transition-all shadow-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
                Homepage Try-On Items
              </span>
              <div className="w-9 h-9 bg-lime-50 border border-lime-200 flex items-center justify-center text-lime-800">
                <Sparkles className="w-4 h-4 text-lime-700" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif text-studio-charcoal font-semibold">
                {counts.totalPopularItems || 0}
              </span>
              <span className="text-xs text-[#84cc16] font-mono font-bold bg-lime-100/60 px-2 py-0.5">
                Interactive
              </span>
            </div>
            <p className="text-[11px] text-studio-muted mt-2 font-light">
              Active in "Popular items tried by customers" showcase
            </p>
          </div>
          <Link
            to="/admin/popular-items"
            className="mt-4 pt-3 border-t border-studio-border/60 text-xs font-semibold text-studio-bronze flex items-center justify-between group-hover:text-studio-charcoal transition-colors"
          >
            <span>Configure Showcase</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 4: Studio Accounts & Privileges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white p-6 border border-studio-border hover:border-studio-bronze transition-all shadow-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
                {isSuperAdmin ? 'Studio Governance & Users' : 'Client Accounts'}
              </span>
              <div className="w-9 h-9 bg-stone-100 border border-stone-200 flex items-center justify-center text-studio-charcoal">
                <Users className="w-4 h-4 text-studio-bronze" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif text-studio-charcoal font-semibold">
                {counts.totalClients || 0}
              </span>
              <span className="text-xs text-stone-600 font-mono font-bold bg-stone-100 px-2 py-0.5">
                Client Portals
              </span>
            </div>
            <p className="text-[11px] text-studio-muted mt-2 font-light">
              {isSuperAdmin
                ? `${counts.totalAdmins || 0} Executive Staff & Administrator accounts`
                : 'Direct client access enabled for design review'}
            </p>
          </div>
          <Link
            to="/admin/users"
            className="mt-4 pt-3 border-t border-studio-border/60 text-xs font-semibold text-studio-bronze flex items-center justify-between group-hover:text-studio-charcoal transition-colors"
          >
            <span>{isSuperAdmin ? 'Manage All Roles' : 'Manage Clients'}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* 3. Operational Workflow & Spatial Distribution (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
        {/* Left Column: Spatial Category Portfolio Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 border border-studio-border space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-studio-charcoal">
                Spatial Execution Matrix
              </h3>
              <p className="text-[11px] text-studio-muted font-light">
                Project delivery allocation across residential categories
              </p>
            </div>
            <Link
              to="/admin/projects"
              className="text-[11px] text-studio-bronze hover:underline font-semibold uppercase tracking-wider"
            >
              View All
            </Link>
          </div>

          {/* Category Bars */}
          <div className="space-y-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const percent = Math.round((cat.count / totalCatProjects) * 100);
              return (
                <div key={cat.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-studio-charcoal font-medium">
                      <Icon className="w-3.5 h-3.5 text-studio-bronze" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="font-mono text-studio-charcoal font-semibold">
                      {cat.count} <span className="text-studio-muted text-[10px]">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full ${cat.color} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Studio System Status (Superadmin exclusive highlight) */}
          <div className="p-4 bg-stone-50 border border-stone-200 space-y-2.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-studio-muted block">
              Architectural Engine Telemetry
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>AI Redesign Engine: <strong>Active</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Cloudinary Media CDN: <strong>Ready</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>MongoDB Cluster: <strong>Online</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>REST API: <strong>200 OK</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Priority Enquiries / Client Design Pipeline (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 border border-studio-border space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-studio-border/60 pb-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-studio-charcoal">
                Turnkey Client Inquiries & Consultations
              </h3>
              <p className="text-[11px] text-studio-muted font-light">
                Direct client requests received from website and client portal
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 border border-stone-200">
              {['all', 'New', 'Contacted', 'Closed'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setEnquiryFilter(status)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    enquiryFilter === status
                      ? 'bg-studio-charcoal text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Enquiry Cards List */}
          {filteredEnquiries.length === 0 ? (
            <div className="py-12 text-center text-studio-muted">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              <p className="text-xs">No inquiries matching this status.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredEnquiries.map((enq) => {
                const isUpdating = updatingEnquiryId === enq._id;
                return (
                  <div
                    key={enq._id}
                    className="p-4 border border-stone-200 hover:border-studio-bronze transition-colors bg-white flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm font-semibold text-studio-charcoal">
                            {enq.name}
                          </h4>
                          <span
                            className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border ${
                              enq.status === 'New'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : enq.status === 'Contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 mt-1">
                          {enq.phone && (
                            <a
                              href={`tel:${enq.phone}`}
                              className="inline-flex items-center gap-1 hover:text-studio-bronze"
                            >
                              <Phone className="w-3 h-3 text-studio-bronze" />
                              <span>{enq.phone}</span>
                            </a>
                          )}
                          {enq.email && (
                            <a
                              href={`mailto:${enq.email}`}
                              className="inline-flex items-center gap-1 hover:text-studio-bronze"
                            >
                              <Mail className="w-3 h-3 text-studio-bronze" />
                              <span>{enq.email}</span>
                            </a>
                          )}
                          {enq.city && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-studio-muted" />
                              <span>{enq.city}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Property Type & Budget */}
                      <div className="text-right text-[11px]">
                        <span className="font-semibold text-studio-charcoal block">
                          {enq.propertyType || 'Residential'}
                        </span>
                        <span className="font-mono text-studio-bronze font-medium">
                          {enq.budget || 'Custom Budget'}
                        </span>
                      </div>
                    </div>

                    {/* Message snippet */}
                    {enq.message && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 border-l-2 border-studio-bronze font-light line-clamp-2">
                        "{enq.message}"
                      </p>
                    )}

                    {/* Status Changer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(enq.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {enq.status !== 'Contacted' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(enq._id, 'Contacted')}
                            className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {enq.status !== 'Closed' && (
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(enq._id, 'Closed')}
                            className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
                          >
                            Mark Closed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 text-right">
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-studio-bronze hover:text-studio-charcoal inline-flex items-center gap-1"
            >
              <span>View All Studio Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Portfolio Works Showcase */}
      <div className="bg-white p-6 sm:p-8 border border-studio-border space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-studio-border/60 pb-3">
          <div>
            <h3 className="font-serif text-lg font-semibold text-studio-charcoal">
              Featured Portfolio Projects
            </h3>
            <p className="text-xs text-studio-muted font-light">
              Recently added interior case studies on the live public portfolio
            </p>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs font-semibold text-studio-bronze hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>Manage All ({counts.totalProjects || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <p className="text-xs text-studio-muted py-6 text-center">No projects in portfolio yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentProjects.slice(0, 4).map((proj) => (
              <div
                key={proj._id}
                className="border border-stone-200 hover:border-studio-bronze transition-colors flex flex-col justify-between group overflow-hidden bg-white"
              >
                <div className="relative h-36 bg-stone-100 overflow-hidden">
                  <img
                    src={proj.mainImage}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold px-2 py-0.5 tracking-wider">
                    {proj.category}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <h4 className="font-serif text-xs font-semibold text-studio-charcoal truncate">
                    {proj.title}
                  </h4>
                  <p className="text-[10px] text-stone-400 truncate">
                    {proj.location || 'Studio Project'} • {proj.area || 'Turnkey'}
                  </p>
                </div>
                <div className="p-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <Link
                    to={`/admin/projects/edit/${proj._id}`}
                    className="text-stone-600 hover:text-studio-bronze font-medium"
                  >
                    Edit
                  </Link>
                  <a
                    href={`${import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}/projects/${proj._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-studio-muted hover:text-studio-charcoal flex items-center gap-1"
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
    </AdminLayout>
  );
};

export default AdminDashboard;
