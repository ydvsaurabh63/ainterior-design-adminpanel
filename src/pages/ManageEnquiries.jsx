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
  AlertTriangle,
  Building,
  Filter,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
  TrendingUp,
  User,
  ArrowRight
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { enquiryApi, userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CLIENT_CATEGORIES, getClientCategoryMeta } from '../constants/catalogCategories';
import toast from 'react-hot-toast';

const ManageEnquiries = () => {
  const { isSuperAdmin, isAdmin, isClient } = useAuth();

  const [enquiries, setEnquiries] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [assignedClientSelect, setAssignedClientSelect] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // Load clients list for lead assignment (Superadmin & Admin)
  useEffect(() => {
    if (isSuperAdmin || isAdmin) {
      userApi.getAll({ role: 'client' })
        .then((clients) => setClientsList(clients || []))
        .catch((err) => console.warn('Could not load clients list:', err));
    }
  }, [isSuperAdmin, isAdmin]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (clientFilter !== 'all') params.clientId = clientFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await enquiryApi.getAll(params);
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, clientFilter, categoryFilter, searchQuery]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await enquiryApi.updateStatus(id, { status: newStatus });
      toast.success(`Enquiry marked as ${newStatus}`);
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleAssignClient = async (enquiryId, targetClientId) => {
    setAssigning(true);
    try {
      const updated = await enquiryApi.updateStatus(enquiryId, {
        clientId: targetClientId || null
      });
      toast.success(targetClientId ? 'Lead assigned to client studio' : 'Lead unassigned');
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
        setSelectedEnquiry(updated);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to assign lead');
    } finally {
      setAssigning(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await enquiryApi.delete(itemToDelete._id);
      toast.success('Enquiry deleted successfully');
      setItemToDelete(null);
      if (selectedEnquiry && selectedEnquiry._id === itemToDelete._id) {
        setSelectedEnquiry(null);
      }
      fetchEnquiries();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const openDetailModal = (enq) => {
    setSelectedEnquiry(enq);
    setAssignedClientSelect(enq.clientId?._id || enq.clientId || '');
  };

  // Quick Counts
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => (e.status || 'New').toLowerCase() === 'new').length;
  const contactedCount = enquiries.filter((e) => (e.status || '').toLowerCase() === 'contacted').length;
  const closedCount = enquiries.filter((e) => (e.status || '').toLowerCase() === 'closed').length;

  return (
    <AdminLayout
      title="Customer Enquiries & Leads"
      subtitle="LEAD PIPELINE • CLIENT CONSULTATIONS & CRM"
      actions={
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{newCount} Leads Awaiting Action</span>
          </span>
        </div>
      }
    >
      {/* 1. Quick KPI Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Total Enquiries</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">New Leads</span>
          <div className="text-2xl font-extrabold text-amber-800 mt-1">{newCount}</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">In Discussion</span>
          <div className="text-2xl font-extrabold text-blue-800 mt-1">{contactedCount}</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Closed / Converted</span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">{closedCount}</div>
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: totalCount },
            { id: 'New', label: 'New', count: newCount },
            { id: 'Contacted', label: 'Contacted', count: contactedCount },
            { id: 'Closed', label: 'Closed', count: closedCount }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === s.id
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {s.label} ({s.count})
            </button>
          ))}
        </div>

        {/* Client Studio Filter & Category Filter & Search */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Sector / Category Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-amber-400 font-medium"
              title="Filter Enquiries by Sector / Category"
            >
              <option value="all">All Sectors & Categories</option>
              {CLIENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.badge?.split(' ')[0] || '🏷️'} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-400 text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* 3. Modern Enquiries Table */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20">
            <LoadingSpinner text="Loading enquiries & consultation requests..." />
          </div>
        ) : enquiries.length > 0 ? (
          <>
            {/* Tablet & Desktop Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Sector / Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {enquiries.map((enq) => {
                    const initials = enq.name ? enq.name.substring(0, 2).toUpperCase() : 'CU';

                    return (
                      <tr key={enq._id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 text-xs sm:text-sm">{enq.name}</div>
                              <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                <span>{enq.city || 'India'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Sector / Category */}
                        <td className="py-3 px-4">
                          {enq.category || enq.clientCategory ? (
                            (() => {
                              const catMeta = getClientCategoryMeta(enq.category || enq.clientCategory);
                              return (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
                                  <span>{catMeta?.badge?.split(' ')[0] || '🏷️'}</span>
                                  <span className="truncate max-w-[140px]" title={catMeta?.label || enq.category}>
                                    {catMeta?.label || enq.category}
                                  </span>
                                </span>
                              );
                            })()
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">General Consultation</span>
                          )}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3 px-4">
                          <select
                            value={enq.status || 'New'}
                            onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                            className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider focus:outline-none cursor-pointer border ${
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

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openDetailModal(enq)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              title="View Full Consultation Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(isSuperAdmin || isAdmin) && (
                              <button
                                type="button"
                                onClick={() => setItemToDelete(enq)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Native Card View (< 640px) */}
            <div className="block sm:hidden divide-y divide-stone-100">
              {enquiries.map((enq) => {
                const initials = enq.name ? enq.name.substring(0, 2).toUpperCase() : 'CU';
                const catMeta = getClientCategoryMeta(enq.category || enq.clientCategory);

                return (
                  <div key={enq._id} className="p-4 bg-white space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-stone-900 text-sm truncate">{enq.name}</h4>
                          <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{enq.city || 'India'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={enq.status || 'New'}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider focus:outline-none cursor-pointer border shrink-0 ${
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

                    {/* Sector Badge */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      {catMeta ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
                          <span>{catMeta.badge?.split(' ')[0] || '🏷️'}</span>
                          <span className="truncate max-w-[200px]">{catMeta.label}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">General Consultation</span>
                      )}
                    </div>

                    {/* Actions: View Details (with WhatsApp in modal) & Delete */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => openDetailModal(enq)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-300" />
                        <span>View Details</span>
                      </button>

                      {(isSuperAdmin || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => setItemToDelete(enq)}
                          className="p-2 border border-stone-200 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-16 text-center text-stone-400">
            <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <h4 className="text-sm font-semibold text-stone-700">Koi enquiry nahi mili</h4>
            <p className="text-xs text-stone-500 mt-0.5">Filter change karein ya search clear karein</p>
          </div>
        )}
      </div>

      {/* 4. DETAIL & LEAD ALLOCATION MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
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
                <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-stone-800 hover:text-amber-700">
                  {selectedEnquiry.phone || 'N/A'}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Email</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-stone-800 hover:text-amber-700 truncate block">
                  {selectedEnquiry.email || 'N/A'}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Property Type</span>
                <span className="font-bold text-stone-800 capitalize">
                  {selectedEnquiry.propertyType || selectedEnquiry.projectType || 'Residential Space'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Budget Range</span>
                <span className="font-bold text-amber-800 font-mono">
                  {selectedEnquiry.budget || 'Standard Budget'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Category / Sector</span>
                <span className="font-bold text-stone-800 flex items-center gap-1">
                  <span>{getClientCategoryMeta(selectedEnquiry.category || selectedEnquiry.clientCategory)?.badge?.split(' ')[0] || '🏷️'}</span>
                  <span>{getClientCategoryMeta(selectedEnquiry.category || selectedEnquiry.clientCategory)?.label || selectedEnquiry.category || 'General Consultation'}</span>
                </span>
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
            </div>

            {/* Customer Message */}
            {selectedEnquiry.message && (
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-stone-700 block mb-1.5">
                  Customer Message / Requirements:
                </span>
                <p className="text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed italic whitespace-pre-wrap">
                  "{selectedEnquiry.message}"
                </p>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500 uppercase">Status:</span>
                <select
                  value={selectedEnquiry.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
                  className="text-xs px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider bg-white focus:outline-none cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {selectedEnquiry.phone && (
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Delete Enquiry</h3>
                <p className="text-xs text-stone-500 mt-0.5">Yeh action undo nahi kiya ja sakta</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200">
              Kya aap sach mein <strong>{itemToDelete.name}</strong> ki enquiry delete karna chahte hain?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
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
