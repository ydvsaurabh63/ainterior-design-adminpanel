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
  MessageSquareQuote,
  PlusCircle,
  ArrowRight,
  Clock,
  Eye
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardApi, enquiryApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
    try {
      await enquiryApi.updateStatus(enquiryId, newStatus);
      toast.success(`Enquiry marked as ${newStatus}`);
      fetchStats();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Studio Overview" subtitle="Admin Dashboard">
        <LoadingSpinner text="Compiling metrics..." />
      </AdminLayout>
    );
  }

  const counts = stats?.counts || {};
  const recentEnquiries = stats?.recentEnquiries || [];
  const recentProjects = stats?.recentProjects || [];

  const kpis = [
    {
      title: 'Total Projects',
      value: counts.totalProjects || 0,
      icon: Layers,
      link: '/admin/projects',
      color: 'text-studio-charcoal'
    },
    {
      title: 'Living Room',
      value: counts.livingRoomProjects || 0,
      icon: Sofa,
      link: '/admin/projects?category=living-room',
      color: 'text-studio-bronze'
    },
    {
      title: 'Bedroom Suites',
      value: counts.bedroomProjects || 0,
      icon: Bed,
      link: '/admin/projects?category=bedroom',
      color: 'text-studio-bronze'
    },
    {
      title: 'Chef Kitchens',
      value: counts.kitchenProjects || 0,
      icon: Utensils,
      link: '/admin/projects?category=kitchen',
      color: 'text-studio-bronze'
    },
    {
      title: 'Full Home Turnkey',
      value: counts.fullHomeProjects || 0,
      icon: Home,
      link: '/admin/projects?category=full-home',
      color: 'text-studio-bronze'
    },
    {
      title: 'Total Enquiries',
      value: counts.totalEnquiries || 0,
      subtitle: `${counts.newEnquiries || 0} New Pending`,
      icon: Inbox,
      link: '/admin/enquiries',
      color: 'text-amber-700'
    },
    {
      title: 'Client Testimonials',
      value: counts.totalTestimonials || 0,
      icon: MessageSquareQuote,
      link: '/admin/testimonials',
      color: 'text-studio-charcoal'
    }
  ];

  return (
    <AdminLayout
      title="Studio Management Dashboard"
      subtitle="Overview & Operations"
      actions={
        <Link
          to="/admin/projects/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Project</span>
        </Link>
      }
    >
      {/* 1. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white p-6 border border-studio-border shadow-sm flex flex-col justify-between hover:border-studio-bronze transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded-none bg-studio-bg border border-studio-border flex items-center justify-center text-studio-charcoal">
                  <Icon className="w-4 h-4 text-studio-bronze" />
                </div>
              </div>

              <div>
                <span className={`font-serif text-3xl sm:text-4xl font-normal block ${kpi.color}`}>
                  {kpi.value}
                </span>
                {kpi.subtitle && (
                  <span className="text-[11px] text-amber-700 font-semibold uppercase tracking-wider block mt-1">
                    {kpi.subtitle}
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-studio-border/50 flex items-center justify-between">
                <Link
                  to={kpi.link}
                  className="text-[11px] uppercase tracking-wider text-studio-bronze font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Grid: Recent Enquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-studio-border shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-studio-border">
            <div>
              <h2 className="font-serif text-2xl text-studio-charcoal">Recent Inquiries</h2>
              <p className="text-xs text-studio-muted">Latest prospective homeowner bookings</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs uppercase tracking-wider font-semibold text-studio-bronze hover:underline"
            >
              View All ({counts.totalEnquiries}) →
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="space-y-4">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="p-4 bg-studio-bg border border-studio-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-serif text-lg font-medium text-studio-charcoal">
                        {enq.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 bg-white border border-studio-border uppercase font-semibold text-studio-muted">
                        {enq.propertyType}
                      </span>
                    </div>
                    <p className="text-xs text-studio-muted">
                      {enq.phone} • {enq.city} • <strong className="text-studio-charcoal">{enq.budget}</strong>
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-1 italic mt-1">
                      "{enq.message}"
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      className={`text-xs px-2.5 py-1 border font-semibold uppercase tracking-wider focus:outline-none ${
                        enq.status === 'New'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-green-50 text-green-800 border-green-300'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <span className="text-[10px] text-stone-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-studio-muted py-6 text-center">No enquiries yet.</p>
          )}
        </div>

        {/* Recent Projects (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-studio-border shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-studio-border">
            <div>
              <h2 className="font-serif text-2xl text-studio-charcoal">Recent Projects</h2>
              <p className="text-xs text-studio-muted">Latest portfolio additions</p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs uppercase tracking-wider font-semibold text-studio-bronze hover:underline"
            >
              Manage →
            </Link>
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 p-3 bg-studio-bg border border-studio-border/70"
                >
                  <img
                    src={p.mainImage}
                    alt={p.title}
                    className="w-14 h-14 object-cover border border-studio-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-base font-medium text-studio-charcoal truncate">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-studio-muted uppercase tracking-wider">
                      {p.category} • {p.location}
                    </p>
                  </div>
                  <Link
                    to={`/admin/projects/edit/${p._id}`}
                    className="p-1.5 text-studio-muted hover:text-studio-charcoal"
                    title="Edit Project"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-studio-muted py-6 text-center">No projects in database.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
