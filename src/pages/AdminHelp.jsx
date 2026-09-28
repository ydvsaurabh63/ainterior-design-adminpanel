import React from 'react';
import AdminLayout from './AdminLayout';
import { HelpCircle, BookOpen, MessageSquare, Video, ExternalLink } from 'lucide-react';

const AdminHelp = () => {
  return (
    <AdminLayout
      title="Help & Support Documentation"
      subtitle="TAB 08 // KNOWLEDGE CENTER & GUIDES"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs space-y-2">
            <div className="w-10 h-10 bg-amber-50 text-studio-bronze rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Documentation Guide</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Step-by-step guides on managing catalog items, setting up AI prompts, and monitoring enquiries.
            </p>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs space-y-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Video Tutorials</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Learn how to quickly add new room designs and integrate Cloudinary image storage.
            </p>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs space-y-2">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Developer Support</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Contact our engineering team for custom AI engine integrations and API token upgrades.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <div className="p-3 bg-stone-50 rounded-lg">
              <h4 className="font-bold text-xs text-stone-900">How do I add new room designs to the frontend section?</h4>
              <p className="text-xs text-stone-600 mt-1">Go to TAB 02 (Catalog), click "Add New Room Design", upload image and choose category.</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <h4 className="font-bold text-xs text-stone-900">How does the customer lead enquiry CRM work?</h4>
              <p className="text-xs text-stone-600 mt-1">All forms submitted on the frontend site land instantly in TAB 06 (Enquiries) where status can be updated.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHelp;
