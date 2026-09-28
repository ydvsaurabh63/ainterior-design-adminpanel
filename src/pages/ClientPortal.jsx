import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Inbox,
  Clock,
  Layers,
  ExternalLink,
  PlusCircle,
  CheckCircle,
  CheckCircle2,
  Building,
  Calendar,
  Send,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  X,
  Compass,
  FileText,
  Palette,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Award,
  ArrowUpRight
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { userApi, enquiryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const projectStages = [
  {
    step: 1,
    title: 'Architectural Discovery',
    desc: 'Spatial planning, lifestyle brief & preliminary site survey',
    status: 'completed',
    date: 'Completed'
  },
  {
    step: 2,
    title: '3D Spatial Modeling & AI Concept',
    desc: 'Photorealistic architectural renders, custom lighting & finishes',
    status: 'current',
    date: 'In Progress (Phase 2)'
  },
  {
    step: 3,
    title: 'Material Curation & Millwork',
    desc: 'Italian marble sourcing, custom woodwork & architectural fittings',
    status: 'upcoming',
    date: 'Upcoming'
  },
  {
    step: 4,
    title: 'Turnkey Handover & Styling',
    desc: 'Final site execution, bespoke furniture staging & photoshoot',
    status: 'upcoming',
    date: 'Final Handover'
  }
];

const aestheticStyles = [
  'Warm Contemporary Luxury',
  'Minimalist Japandi',
  'Neo-Classical Elegance',
  'Industrial Loft Architecture',
  'Modern Coastal Mediterranean'
];

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
    propertyType: '3 BHK Luxury Apartment',
    budget: '₹25L - ₹40L',
    stylePreference: 'Warm Contemporary Luxury',
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
      toast.error('Please enter your phone number and project requirements');
      return;
    }

    setSubmitting(true);
    try {
      const formattedMessage = `[Preferred Aesthetic: ${enquiryForm.stylePreference}]\n${enquiryForm.message}`;
      await enquiryApi.create({
        ...enquiryForm,
        message: formattedMessage,
        name: clientUser?.name || enquiryForm.name,
        email: clientUser?.email || enquiryForm.email
      });
      toast.success('Your consultation request has been submitted to your lead architect!');
      setIsEnquiryModalOpen(false);
      setEnquiryForm((prev) => ({
        ...prev,
        message: ''
      }));
      await fetchOverview();
    } catch (err) {
      toast.error(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Private Client Suite" subtitle="Welcome">
        <div className="py-24">
          <LoadingSpinner text="Connecting to your bespoke spatial portfolio..." />
        </div>
      </AdminLayout>
    );
  }

  const enquiries = overview?.enquiries || [];
  const featured = overview?.featuredProjects || [];

  return (
    <AdminLayout
      title={`Residence Suite • Welcome, ${clientUser?.name || 'Valued Client'}`}
      subtitle="Exclusive Client Sanctuary"
      actions={
        <button
          onClick={() => setIsEnquiryModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-studio-bronze hover:bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Design Consultation</span>
        </button>
      }
    >
      {/* 1. Grand Luxury Client Hero Banner */}
      <div className="relative overflow-hidden mb-8 bg-gradient-to-r from-stone-950 via-[#181716] to-stone-900 text-white p-6 sm:p-9 border border-stone-800 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-studio-bronze font-bold font-mono">
                BESPOKE ARCHITECTURAL PORTAL
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-white tracking-tight">
              Curating your sanctuary with <span className="text-amber-200 font-light italic">uncompromising precision</span>.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Track spatial design milestones, inspect curated material moodboards, or test your real rooms with our AI Virtual Room Redesigner.
            </p>
          </div>

          {/* Lead Architect Concierge Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 font-mono">
                YOUR LEAD ARCHITECT
              </span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-white">Ar. Saurabh Yadav</h4>
              <p className="text-[11px] text-stone-400">Principal Design Director</p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs">
              <a
                href="tel:+919999911111"
                className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 text-stone-200 text-center text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3 text-amber-300" />
                <span>Call Studio</span>
              </a>
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(true)}
                className="flex-1 py-1.5 px-2 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-center text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient gold radial glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-amber-600/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Interactive Living Space Redesign Timeline */}
      <div className="bg-white p-6 sm:p-8 border border-studio-border mb-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-studio-border/60 pb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-studio-charcoal flex items-center gap-2">
              <Compass className="w-4 h-4 text-studio-bronze" />
              <span>Project Execution Roadmap</span>
            </h3>
            <p className="text-xs text-studio-muted font-light">
              Current progress on your residential interior transformation
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-studio-bronze bg-amber-50 px-3 py-1 border border-amber-200 uppercase tracking-wider">
            Phase 2: Active Visualization (50% Complete)
          </span>
        </div>

        {/* Horizontal Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {projectStages.map((stg) => {
            const isCompleted = stg.status === 'completed';
            const isCurrent = stg.status === 'current';
            return (
              <div
                key={stg.step}
                className={`p-4 border transition-all flex flex-col justify-between relative ${
                  isCurrent
                    ? 'border-studio-bronze bg-amber-50/20 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-stone-200 bg-stone-50/50 opacity-70'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 right-3 bg-studio-bronze text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 shadow-xs">
                    Current Phase
                  </span>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-studio-bronze text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stg.step}
                    </span>
                    <span className="text-[10px] font-mono text-studio-muted font-semibold uppercase tracking-wider">
                      {stg.date}
                    </span>
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-studio-charcoal">
                    {stg.title}
                  </h4>
                  <p className="text-[11px] text-studio-muted leading-relaxed font-light">
                    {stg.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. AI Room Redesign Quick Studio Banner */}
      <div className="mb-8 p-6 sm:p-7 bg-stone-900 border border-stone-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-semibold text-white">
              Try Out Room Concepts with Our AI Interior Designer
            </h3>
            <p className="text-xs text-stone-300 font-light max-w-xl leading-relaxed">
              Upload a snapshot of any room in your home and visualize it in Japandi, Warm Minimalist, or Luxury Contemporary styles in seconds.
            </p>
          </div>
        </div>
        <a
          href={`${import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}/ai-designer`}
          target="_blank"
          rel="noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-studio-bronze hover:bg-studio-bronze/90 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors shadow-md"
        >
          <span>Launch AI Studio</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* 4. Client's Submitted Enquiries / Consultations */}
      <div className="bg-white p-6 sm:p-8 border border-studio-border mb-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-studio-border/60 pb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-studio-charcoal">
              My Design Requests & Consultations
            </h3>
            <p className="text-xs text-studio-muted font-light">
              Record of your architectural briefs submitted to the studio
            </p>
          </div>
          <span className="text-xs text-studio-bronze font-mono font-bold">
            {enquiries.length} Active Records
          </span>
        </div>

        {enquiries.length === 0 ? (
          <div className="py-12 text-center text-studio-muted">
            <Inbox className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-xs">No active design requests found.</p>
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit First Request</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enquiries.map((enq) => (
              <div
                key={enq._id}
                className="p-5 border border-stone-200 hover:border-studio-bronze transition-colors bg-white flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-sm font-semibold text-studio-charcoal">
                      {enq.propertyType || 'Residential Design Brief'}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border ${
                        enq.status === 'New'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {enq.status === 'New' ? 'Received & Under Review' : enq.status === 'Contacted' ? 'Architect Assigned' : 'Design Finalized'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-2 font-mono">
                    <span>Budget: <strong>{enq.budget || 'Custom'}</strong></span>
                    {enq.city && <span>City: <strong>{enq.city}</strong></span>}
                  </div>

                  {enq.message && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2.5 mt-3 border-l-2 border-studio-bronze font-light">
                      "{enq.message}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>Submitted on {new Date(enq.createdAt).toLocaleDateString()}</span>
                  <span className="text-studio-bronze font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Studio Connected</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Curated Studio Masterworks & Inspirations */}
      {featured.length > 0 && (
        <div className="bg-white p-6 sm:p-8 border border-studio-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-studio-charcoal">
                Curated Design Inspirations
              </h3>
              <p className="text-xs text-studio-muted font-light">
                Handcrafted spatial aesthetics selected for your property profile
              </p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs text-studio-bronze hover:underline uppercase tracking-wider font-semibold"
            >
              Explore Portfolio
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="group border border-stone-200 hover:border-studio-bronze transition-colors flex flex-col justify-between overflow-hidden"
              >
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={item.mainImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] uppercase font-bold px-2 py-0.5 tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-serif text-sm font-semibold text-studio-charcoal truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-studio-muted font-light line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500 font-mono">{item.location || 'Luxury Residence'}</span>
                  <a
                    href={`${import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}/projects/${item._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-studio-bronze hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View Case Study</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Consultation Request Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 border border-studio-border shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-studio-border pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-studio-bronze font-bold block">
                  CONCIERGE CONSULTATION
                </span>
                <h3 className="font-serif text-xl font-medium text-studio-charcoal">
                  Request New Design Brief
                </h3>
              </div>
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="text-studio-muted hover:text-studio-charcoal p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-studio-charcoal font-bold mb-1.5">
                    Property Type
                  </label>
                  <select
                    value={enquiryForm.propertyType}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, propertyType: e.target.value })}
                    className="w-full px-3 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                  >
                    <option value="3 BHK Luxury Apartment">3 BHK Luxury Apartment</option>
                    <option value="4 BHK Penthouse Suite">4 BHK Penthouse Suite</option>
                    <option value="Independent Luxury Villa">Independent Luxury Villa</option>
                    <option value="Duplex Residence">Duplex Residence</option>
                    <option value="Bespoke Master Bedroom Suite">Bespoke Master Bedroom Suite</option>
                    <option value="Chef Kitchen & Dining">Chef Kitchen & Dining</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-studio-charcoal font-bold mb-1.5">
                    Target Budget
                  </label>
                  <select
                    value={enquiryForm.budget}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                  >
                    <option value="₹15L - ₹25L">₹15L - ₹25L</option>
                    <option value="₹25L - ₹40L">₹25L - ₹40L</option>
                    <option value="₹40L - ₹75L">₹40L - ₹75L</option>
                    <option value="₹75L - ₹1.5 Cr">₹75L - ₹1.5 Cr</option>
                    <option value="₹1.5 Cr+ Luxury Turnkey">₹1.5 Cr+ Luxury Turnkey</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-studio-charcoal font-bold mb-1.5">
                  Preferred Architectural Style
                </label>
                <select
                  value={enquiryForm.stylePreference}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, stylePreference: e.target.value })}
                  className="w-full px-3 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                >
                  {aestheticStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-studio-charcoal font-bold mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-studio-charcoal font-bold mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={enquiryForm.city}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    className="w-full px-3 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-studio-charcoal font-bold mb-1.5">
                  Design Vision & Specific Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  placeholder="Describe your vision, timeline, specific spaces to renovate, and any special material requests..."
                  className="w-full px-3 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="px-4 py-2 border border-studio-border text-xs uppercase tracking-wider font-semibold text-studio-muted hover:text-studio-charcoal transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-studio-bronze hover:bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow"
                >
                  {submitting ? 'Submitting...' : 'Send Brief to Architect'}
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
