import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Clock,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import AdminLayout from './AdminLayout';

const faqsData = [
  {
    category: 'portfolio',
    question: 'How do I add a new project to the live portfolio?',
    answer:
      'Navigate to "Projects & Portfolio" in the sidebar, click the "+ Add New Project" button at the top right, fill in the project title, description, and upload the cover image. Once saved, it instantly goes live on the client-facing website showcase.'
  },
  {
    category: 'portfolio',
    question: 'How does the category dropdown filter work in Projects?',
    answer:
      'In the Projects page, click the "Select Category" dropdown next to "All Projects" to filter projects by the 5 Specialized Client Sectors (Furniture Manufacturers, Interior Designers, Real Estate Builders, Home Décor, Modular Kitchen). Selecting "All Projects" resets the view.'
  },
  {
    category: 'ai',
    question: 'How does the AI Room Designer & Playground work?',
    answer:
      'The AI Playground allows you to upload a room photograph, select a Client Sector, target object, and optional custom prompt. The engine automatically produces architectural spatial renders visualizing high-end material finishes and furniture layouts.'
  },
  {
    category: 'enquiries',
    question: 'How are customer enquiries and leads tracked?',
    answer:
      'When customers submit forms on the frontend site, their details land in the "Leads & Enquiries" CRM. You can filter by status (New, In Review, Quoted, Closed), click the WhatsApp icon to open a pre-filled direct chat with the client, or update notes.'
  },
  {
    category: 'hierarchy',
    question: 'What is the difference between Superadmin and Regional Admins?',
    answer:
      'Superadmin is the system owner with full master permissions over global catalog items, AI engine controls, billing, and admin management. Regional Admins manage assigned client studios, catalog designs, and customer enquiries under their jurisdiction.'
  },
  {
    category: 'hierarchy',
    question: 'How do I assign a new Client Studio to an Admin?',
    answer:
      'Go to "Hierarchy & Users", click "+ Add User Account", select role "Client Studio", and pick the managing Admin from the "Assign to Managing Admin" dropdown. The client will be automatically linked to that admin.'
  }
];

const AdminHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const filteredFaqs = faqsData.filter((faq) => {
    const matchesCategory =
      activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="Help & Support Center"
      subtitle="SYSTEM KNOWLEDGE BASE • FREQUENTLY ASKED QUESTIONS • CONCIERGE DESK"
      actions={
        <a
          href="https://wa.me/919876543210?text=Hello%20Aiterior%20Support%2C%20I%20need%20help%20with%20my%20dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Concierge</span>
        </a>
      }
    >
      <div className="space-y-6">
        {/* 1. Hero Search & Quick Guide */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-850 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/20 text-amber-300 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Studio Support & Documentation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              How can we assist your studio today?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed">
              Find quick answers on managing project portfolios, client sectors, AI renders, lead CRM, and user access control.
            </p>

            {/* Search Input */}
            <div className="relative max-w-lg">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. portfolio, AI playground, enquiries, roles)..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800/80 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:bg-stone-800 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="absolute right-6 -bottom-6 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 2. Three Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                Studio Operations Manual
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Step-by-step guidance on managing the 5 Client Sectors, portfolio media uploads, and AI prompt engineering.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-800">
              <span>Read Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                RBAC & Security Guide
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Configure regional branch admin assignments, client studio access limits, and credentials.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-blue-800">
              <span>Security Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-3">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-1">
                Direct Engineering Desk
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Need AI quota upgrades or custom architectural model tuning? Connect directly with our dev team.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Instant WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* 3. Interactive FAQ Section */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Frequently Answered Questions
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Quick solutions to common workflows across your dashboard
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'ai', label: 'AI Engine' },
                { id: 'enquiries', label: 'CRM Leads' },
                { id: 'hierarchy', label: 'Hierarchy' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center">
              <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">No matching questions found</p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for a different keyword or reset filters.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className={`border rounded-xl transition-all overflow-hidden ${
                      isOpen
                        ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-stone-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-amber-700' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-200/50 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Direct Contact Support Strip */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Need Immediate Architectural Support?
              </h4>
              <p className="text-xs text-stone-500">
                Studio hours: Mon - Sat (9:30 AM to 7:00 PM IST) • Average response under 15 minutes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="mailto:support@aiterior.com"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-stone-600" />
              <span>support@aiterior.com</span>
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHelp;
