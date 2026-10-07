import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  Inbox,
  ArrowRight,
  PlusCircle,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  UserPlus,
  MessageCircle,
  Building2,
  Eye,
  X
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardApi, enquiryApi, userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SuperadminDashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [updatingEnquiryId, setUpdatingEnquiryId] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [statsData, adminsData] = await Promise.all([
        dashboardApi.getStats(),
        userApi.getAdminsList().catch(() => [])
      ]);
      setStats(statsData);
      setAdminsList(Array.isArray(adminsData) ? adminsData : []);
    } catch (err) {
      console.error('Failed to load Superadmin metrics:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    setUpdatingEnquiryId(enquiryId);
    try {
      await enquiryApi.updateStatus(enquiryId, newStatus);
      toast.success(`Enquiry marked as ${newStatus}`);
      await fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update enquiry status');
    } finally {
      setUpdatingEnquiryId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Superadmin Dashboard" subtitle="Loading Overview">
        <div className="py-24">
          <LoadingSpinner text="Loading studio statistics & administration data..." />
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

  return (
    <AdminLayout
      title="Superadmin Dashboard"
      subtitle="MASTER OVERVIEW • ACCESS & OPERATIONS"
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          <Link
            to="/admin/users"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/dashboard"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Briefcase className="w-3.5 h-3.5 text-stone-600" />
            <span>Admin Ops</span>
          </Link>
          <Link
            to="/admin/projects/add"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Project</span>
          </Link>
        </div>
      }
    >
      {/* 1. Elegant Welcome Card */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 mb-6 sm:mb-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] sm:text-[11px] font-bold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>SUPERADMIN ACCESS</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
              Welcome back, {admin?.name || 'Director'} 👋
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl leading-relaxed">
              Yahan se aap apne saare Admins, Clients, Interior Portfolio Projects aur aayi hui Customer Enquiries ko ek nazar mein monitor kar sakte hain.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto bg-stone-50 border border-stone-200/80 p-3 rounded-xl justify-between sm:justify-start">
            <div className="w-10 h-10 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500">System Status</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Services Active & Healthy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 Clean, High-Impact KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 mb-6 sm:mb-7">
        {/* Card 1: Admins */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-amber-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Studio Admins</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{counts.totalAdmins || 0}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Active Staff
            </span>
          </div>
          <Link
            to="/admin/users"
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center justify-between group"
          >
            <span>Manage Admins</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 2: Clients */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
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
            <span>View Client Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 3: Projects */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
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
            <span>Manage Projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Card 4: Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-emerald-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Inquiries & Leads</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{counts.totalEnquiries || 0}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {counts.newEnquiries || 0} New
            </span>
          </div>
          <Link
            to="/admin/enquiries"
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-between group"
          >
            <span>Review Leads ({conversionRate}% Conv.)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* 3. Middle Section: Active Admins List & Recent Projects Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-7">
        {/* Left Column: Active Admins (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-4 sm:p-5 lg:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Active Studio Administrators
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Aapke system mein assigned Admins jo clients aur projects handle kar rahe hain
              </p>
            </div>
            <Link
              to="/admin/users"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Manage All ({adminsList.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {adminsList.length === 0 ? (
            <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">Abhi koi dusra Admin add nahi hai</p>
              <p className="text-xs text-stone-500 mt-0.5">Aap Superadmin account se naya Admin create kar sakte hain</p>
              <Link
                to="/admin/users"
                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Add Studio Admin</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {adminsList.slice(0, 5).map((adm) => (
                <div key={adm._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 font-bold flex items-center justify-center text-xs">
                      {adm.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-stone-900">{adm.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200">
                          {adm.role}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-stone-400" /> {adm.email}</span>
                        {adm.phone && <span className="flex items-center gap-1 hidden sm:inline-flex"><Phone className="w-3 h-3 text-stone-400" /> {adm.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <Link
                      to={`/admin/users?role=client&adminId=${adm._id}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-950 border border-stone-200 transition-colors"
                      title={`View ${adm.name}'s assigned client studios`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Clients ({adm.clientCount || 0})</span>
                      <ChevronRight className="w-3 h-3 text-stone-400" />
                    </Link>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Projects Spotlight (1/3 width) */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-700" />
                Latest Projects
              </h3>
              <Link to="/admin/projects" className="text-xs font-bold text-stone-600 hover:text-stone-900">
                View All
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-xl text-stone-500 text-xs">
                Koi project upload nahi hai
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.slice(0, 3).map((proj) => (
                  <div key={proj._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors">
                    {proj.mainImage || proj.images?.[0] || proj.galleryImages?.[0] ? (
                      <img
                        src={proj.mainImage || proj.images?.[0] || proj.galleryImages?.[0]}
                        alt={proj.title}
                        className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0">
                        <Layers className="w-5 h-5 text-stone-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{proj.title}</h4>
                      <p className="text-[11px] text-stone-500 capitalize">{proj.category || 'Interior Space'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin/projects/add"
            className="mt-4 w-full py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-stone-700" />
            <span>Upload New Portfolio Project</span>
          </Link>
        </div>
      </div>

      {/* 4. Bottom Section: Customer Enquiries & Leads */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-600" />
              Recent Customer Inquiries & Leads
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Website se aane wali nayi client inquiries ko yahan se direct follow-up karein
            </p>
          </div>

          {/* Filter Pills */}
          <div className="w-full sm:w-auto overflow-x-auto flex items-center gap-1 bg-stone-100 p-1 rounded-lg scrollbar-none">
            {['all', 'new', 'contacted', 'closed'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setEnquiryFilter(filter)}
                className={`flex-1 sm:flex-initial text-center px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize whitespace-nowrap cursor-pointer ${
                  enquiryFilter === filter
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {filter}
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
                        <div className="text-[11px] text-stone-500">{enq.phone || enq.email}</div>
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
                          title="View Inquiry Details"
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

      {/* 5. Consultation & Inquiry Details Modal with WhatsApp Link */}
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

export default SuperadminDashboard;
