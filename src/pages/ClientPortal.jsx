import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Inbox,
  Clock,
  Layers,
  ExternalLink,
  PlusCircle,
  CheckCircle,
  Building,
  Calendar,
  Send,
  UserCheck
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { userApi, enquiryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ClientPortal = () => {
  const { admin: clientUser } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New enquiry form
  const [enquiryForm, setEnquiryForm] = useState({
    name: clientUser?.name || '',
    email: clientUser?.email || '',
    phone: clientUser?.phone || '',
    city: 'Mumbai',
    propertyType: '3 BHK',
    budget: '₹25L - ₹40L',
    message: ''
  });

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await userApi.getClientOverview();
      setOverview(data);
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

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!enquiryForm.message.trim() || !enquiryForm.phone.trim()) {
      toast.error('Please fill in phone and project requirements');
      return;
    }

    setSubmitting(true);
    try {
      await enquiryApi.create({
        ...enquiryForm,
        name: clientUser?.name || enquiryForm.name,
        email: clientUser?.email || enquiryForm.email
      });
      toast.success('Your consultation request has been submitted to the design team!');
      setIsEnquiryModalOpen(false);
      setEnquiryForm({
        ...enquiryForm,
        message: ''
      });
      fetchOverview();
    } catch (err) {
      toast.error(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Client Portal" subtitle="Welcome">
        <div className="py-20">
          <LoadingSpinner text="Loading your interior portfolio..." />
        </div>
      </AdminLayout>
    );
  }

  const enquiries = overview?.enquiries || [];
  const featured = overview?.featuredProjects || [];

  return (
    <AdminLayout
      title={`Welcome, ${clientUser?.name || 'Client'}`}
      subtitle="Exclusive Client Sanctuary"
      actions={
        <button
          onClick={() => setIsEnquiryModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-xs uppercase tracking-wider font-semibold shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Design Request</span>
        </button>
      }
    >
      {/* Client Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-studio-charcoal to-stone-900 text-white p-6 sm:p-8 mb-8 border border-stone-800">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-studio-bronze font-bold block mb-2">
            Personal Studio Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-light mb-3">
            Transform your living space with our bespoke architectural vision.
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed mb-6">
            Track your ongoing consultations, review proposed room aesthetics, or launch our cutting-edge AI Room Redesigner to generate photorealistic conceptual visualizations instantly.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`${import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}/ai-designer`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Room Visualizer</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>

            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs uppercase tracking-wider font-semibold border border-stone-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-studio-bronze" />
              <span>Consult Lead Architect</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 -bottom-8 w-1/3 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 border border-studio-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
              My Design Inquiries
            </span>
            <Inbox className="w-4 h-4 text-studio-bronze" />
          </div>
          <span className="text-2xl font-serif text-studio-charcoal block mt-2">
            {enquiries.length}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">Active project requests</span>
        </div>

        <div className="bg-white p-5 border border-studio-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
              Studio Showcase
            </span>
            <Layers className="w-4 h-4 text-studio-bronze" />
          </div>
          <span className="text-2xl font-serif text-studio-charcoal block mt-2">
            {overview?.stats?.studioProjects || 0}
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">Curated designs to explore</span>
        </div>

        <div className="bg-white p-5 border border-studio-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
              Account Status
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-base font-semibold text-emerald-700 block mt-2">
            Verified Client
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">{clientUser?.email}</span>
        </div>
      </div>

      {/* Enquiries Section */}
      <div className="bg-white border border-studio-border p-6 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-studio-border">
          <div>
            <h3 className="text-lg font-serif text-studio-charcoal">My Project Requests & Status</h3>
            <p className="text-xs text-studio-muted">
              Live progress and updates on your submitted interior design inquiries.
            </p>
          </div>
          <button
            onClick={() => setIsEnquiryModalOpen(true)}
            className="text-xs text-studio-bronze hover:underline font-semibold"
          >
            + New Request
          </button>
        </div>

        {enquiries.length === 0 ? (
          <div className="py-12 text-center">
            <Inbox className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-serif text-studio-charcoal">No inquiries submitted yet</h4>
            <p className="text-xs text-studio-muted mt-1 max-w-sm mx-auto">
              Ready to transform your home? Click 'New Design Request' above to connect directly with our architects.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((enq) => {
              const statusClass =
                enq.status === 'Contacted'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : enq.status === 'Closed'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-blue-50 text-blue-800 border-blue-200';

              return (
                <div
                  key={enq._id}
                  className="p-4 border border-stone-200 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-studio-charcoal">
                        {enq.propertyType} • {enq.city}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        (Budget: {enq.budget})
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2">{enq.message}</p>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Submitted on {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span
                      className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${statusClass}`}
                    >
                      {enq.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured Projects Preview */}
      <div className="bg-white border border-studio-border p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-studio-border">
          <div>
            <h3 className="text-lg font-serif text-studio-charcoal">Curated Studio Inspirations</h3>
            <p className="text-xs text-studio-muted">
              Recent luxury residential and bespoke living spaces by our team.
            </p>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs text-studio-bronze hover:underline font-semibold flex items-center gap-1"
          >
            <span>Browse Full Gallery</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <div
              key={p._id}
              className="group border border-studio-border bg-stone-50 overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                <img
                  src={p.mainImage}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-studio-bronze font-bold block mb-1">
                    {p.category} • {p.style}
                  </span>
                  <h4 className="font-serif text-xs text-studio-charcoal font-semibold line-clamp-1">
                    {p.title}
                  </h4>
                  <span className="text-[11px] text-stone-500 block mt-0.5">{p.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW DESIGN REQUEST MODAL */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full border border-studio-border shadow-2xl p-6 relative">
            <h3 className="text-xl font-serif text-studio-charcoal mb-1">
              Submit Design Consultation Request
            </h3>
            <p className="text-xs text-studio-muted mb-6">
              Our principal designers will analyze your room requirements and respond shortly.
            </p>

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={enquiryForm.city}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Property Configuration *
                  </label>
                  <select
                    value={enquiryForm.propertyType}
                    onChange={(e) =>
                      setEnquiryForm({ ...enquiryForm, propertyType: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="Villa">Luxury Villa</option>
                    <option value="Other">Commercial / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                    Approx. Budget *
                  </label>
                  <select
                    value={enquiryForm.budget}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, budget: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                  >
                    <option value="₹10L - ₹15L">₹10L - ₹15L</option>
                    <option value="₹15L - ₹25L">₹15L - ₹25L</option>
                    <option value="₹25L - ₹40L">₹25L - ₹40L</option>
                    <option value="₹50L - ₹1 Cr">₹50L - ₹1 Cr</option>
                    <option value="₹1 Cr+">₹1 Cr+ (Ultra Luxury)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-studio-charcoal uppercase tracking-wider mb-1">
                  Design Requirements & Preferences *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the space, preferred styles (e.g. Japandi, Modern Minimalist, Parisian), and timeline..."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-studio-bronze focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ClientPortal;
