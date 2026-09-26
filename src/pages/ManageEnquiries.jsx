import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Eye,
  X,
  Inbox,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { enquiryApi } from '../services/api';
import toast from 'react-hot-toast';

const statusFilters = [
  { id: 'all', label: 'All Enquiries' },
  { id: 'New', label: 'New' },
  { id: 'Contacted', label: 'Contacted' },
  { id: 'Closed', label: 'Closed' }
];

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const data = await enquiryApi.getAll(params);
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await enquiryApi.updateStatus(id, newStatus);
      toast.success(`Enquiry marked as ${newStatus}`);
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await enquiryApi.delete(itemToDelete._id);
      toast.success('Enquiry deleted');
      setItemToDelete(null);
      if (selectedEnquiry && selectedEnquiry._id === itemToDelete._id) {
        setSelectedEnquiry(null);
      }
      fetchEnquiries();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <AdminLayout
      title="Client Enquiries & Consultation Bookings"
      subtitle="Inbound Leads CRM"
    >
      {/* Search & Status Filters */}
      <div className="bg-white p-4 sm:p-6 border border-studio-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {statusFilters.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
                statusFilter === s.id
                  ? 'bg-studio-charcoal text-white'
                  : 'bg-studio-bg text-studio-charcoal hover:bg-studio-sand border border-studio-border'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-studio-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-studio-bg border border-studio-border text-xs focus:outline-none focus:border-studio-bronze"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white border border-studio-border shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading enquiries..." />
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-studio-sand/70 border-b border-studio-border text-studio-charcoal uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Type & Budget</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-border">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-studio-bg/60 transition-colors">
                    <td className="py-3 px-4 font-serif text-sm font-semibold text-studio-charcoal">
                      {enq.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-studio-charcoal font-medium">{enq.phone}</span>
                        <span className="text-[11px] text-studio-muted">{enq.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-studio-muted">{enq.city}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-studio-bronze">{enq.propertyType}</span>
                        <span className="text-[11px] text-stone-500">{enq.budget}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`text-xs px-2 py-1 border font-semibold uppercase tracking-wider focus:outline-none ${
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
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="p-1.5 text-studio-charcoal hover:bg-studio-sand rounded border border-studio-border"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(enq)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Inbox className="w-10 h-10 text-studio-muted mx-auto mb-3 opacity-40" />
            <p className="text-xs text-studio-muted">No client consultation enquiries found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 max-w-lg w-full border border-studio-border shadow-2xl relative space-y-6">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-studio-muted hover:text-studio-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-studio-bronze font-bold block mb-1">
                Consultation Request
              </span>
              <h3 className="font-serif text-2xl text-studio-charcoal">
                {selectedEnquiry.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-studio-bg p-4 border border-studio-border">
              <div>
                <span className="text-studio-muted block text-[10px] uppercase">Phone</span>
                <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-studio-charcoal hover:underline">
                  {selectedEnquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-studio-muted block text-[10px] uppercase">Email</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-studio-charcoal hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <span className="text-studio-muted block text-[10px] uppercase">Property Type</span>
                <span className="font-semibold text-studio-bronze">{selectedEnquiry.propertyType}</span>
              </div>
              <div>
                <span className="text-studio-muted block text-[10px] uppercase">Budget Range</span>
                <span className="font-semibold text-studio-charcoal">{selectedEnquiry.budget}</span>
              </div>
              <div>
                <span className="text-studio-muted block text-[10px] uppercase">City</span>
                <span className="font-medium text-studio-charcoal">{selectedEnquiry.city}</span>
              </div>
              <div>
                <span className="text-studio-muted block text-[10px] uppercase">Submitted Date</span>
                <span className="font-medium text-studio-charcoal">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal block mb-2">
                Project Vision & Client Message:
              </span>
              <p className="text-xs sm:text-sm text-studio-charcoal bg-studio-sand/40 p-4 border border-studio-border/80 leading-relaxed italic whitespace-pre-wrap">
                "{selectedEnquiry.message}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-studio-border">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-studio-muted font-bold">Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
                  className="text-xs px-3 py-1.5 border font-semibold uppercase tracking-wider bg-white focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs uppercase tracking-wider font-semibold"
              >
                Reply via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-md w-full border border-studio-border shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-2xl text-studio-charcoal">Delete Enquiry</h3>
            </div>
            <p className="text-xs text-studio-muted leading-relaxed">
              Are you sure you want to delete the enquiry from <strong>{itemToDelete.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs uppercase text-studio-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white text-xs uppercase font-semibold hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageEnquiries;
