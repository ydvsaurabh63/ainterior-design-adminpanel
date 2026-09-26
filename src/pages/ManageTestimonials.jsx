import React, { useState, useEffect } from 'react';
import {
  Plus,
  Star,
  Trash2,
  Edit2,
  X,
  MessageSquareQuote,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { testimonialApi } from '../services/api';
import toast from 'react-hot-toast';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Homeowner',
    rating: 5,
    review: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await testimonialApi.getAll();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: 'Homeowner',
      rating: 5,
      review: '',
      imageUrl: ''
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role || 'Homeowner',
      rating: item.rating || 5,
      review: item.review,
      imageUrl: item.image || ''
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.review.trim()) {
      toast.error('Client name and review are required');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('rating', formData.rating);
      data.append('review', formData.review);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl.trim()) {
        data.append('imageUrl', formData.imageUrl.trim());
      }

      if (editingItem) {
        await testimonialApi.update(editingItem._id, data);
        toast.success('Testimonial updated successfully');
      } else {
        await testimonialApi.create(data);
        toast.success('Testimonial added successfully');
      }

      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await testimonialApi.delete(itemToDelete._id);
      toast.success('Testimonial deleted successfully');
      setItemToDelete(null);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <AdminLayout
      title="Client Testimonials Management"
      subtitle="Social Proof & Reviews"
      actions={
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      }
    >
      {/* Testimonials List */}
      <div className="bg-white border border-studio-border shadow-sm p-6">
        {loading ? (
          <LoadingSpinner text="Loading client reviews..." />
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div
                key={item._id}
                className="p-6 bg-studio-bg border border-studio-border flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < item.rating
                              ? 'text-studio-gold fill-studio-gold'
                              : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1 text-studio-muted hover:text-blue-600 transition-colors"
                        title="Edit Review"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1 text-studio-muted hover:text-red-600 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-studio-charcoal italic leading-relaxed font-light mb-6">
                    "{item.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-studio-border/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-studio-border flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-studio-charcoal">
                      {item.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-studio-muted block">
                      {item.role || 'Homeowner'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-xs text-studio-muted mb-4">No client reviews in the database.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-medium"
            >
              Add First Testimonial
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 max-w-lg w-full border border-studio-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-studio-muted hover:text-studio-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-studio-charcoal mb-6">
              {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika & Vikram Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-studio-bg border border-studio-border text-xs focus:outline-none focus:border-studio-bronze"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Client Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4BHK Owner, Mumbai"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-studio-bg border border-studio-border text-xs focus:outline-none focus:border-studio-bronze"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-studio-bg border border-studio-border text-xs focus:outline-none focus:border-studio-bronze"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                    <option value={2}>2 Stars (Fair)</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Review Text *
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Client feedback and praise for studio craftsmanship..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full px-3 py-2 bg-studio-bg border border-studio-border text-xs focus:outline-none focus:border-studio-bronze resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Client Avatar Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-xs file:mr-2 file:py-1 file:px-3 file:border-0 file:bg-studio-charcoal file:text-white mb-2"
                />
                <input
                  type="url"
                  placeholder="Or paste image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-studio-bg border border-studio-border text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-studio-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-studio-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-md w-full border border-studio-border shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-2xl text-studio-charcoal">Delete Testimonial</h3>
            </div>
            <p className="text-xs text-studio-muted">
              Are you sure you want to remove the review by <strong>{itemToDelete.name}</strong>?
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

export default ManageTestimonials;
