import React, { useState, useEffect, useRef } from 'react';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  X,
  Eye,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Palette,
  Layers,
  Bed,
  Sofa,
  UtensilsCrossed,
  Paintbrush
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { roomDesignApi } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'bedroom', label: 'Bedroom', icon: Bed },
  { id: 'living-room', label: 'Living Room', icon: Sofa },
  { id: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
  { id: 'wall-paint-colors', label: 'Wall Paint Colors', icon: Paintbrush }
];

const ManageRoomDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('bedroom');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formOrder, setFormOrder] = useState(0);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'

  // Delete Confirmation State
  const [designToDelete, setDesignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const data = await roomDesignApi.getAll(params);
      setDesigns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load room designs:', err);
      toast.error('Failed to load room designs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [categoryFilter, searchQuery]);

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingDesign(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory(categoryFilter !== 'all' ? categoryFilter : 'bedroom');
    setFormImageUrl('');
    setFormImageFile(null);
    setImagePreview('');
    setFormOrder(0);
    setUploadMode('file');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (design) => {
    setEditingDesign(design);
    setFormTitle(design.title || '');
    setFormDescription(design.description || '');
    setFormCategory(design.category || 'bedroom');
    setFormImageUrl(design.imageUrl || '');
    setFormImageFile(null);
    setImagePreview(design.imageUrl || '');
    setFormOrder(design.order || 0);
    setUploadMode('url');
    setIsModalOpen(true);
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WEBP)');
      return;
    }

    setFormImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit Form (Create or Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Design title is required');
      return;
    }

    if (!formCategory) {
      toast.error('Category is required');
      return;
    }

    if (!editingDesign && !formImageFile && !formImageUrl.trim()) {
      toast.error('Please upload an image or provide an Image URL');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', formTitle.trim());
      formData.append('description', formDescription.trim());
      formData.append('category', formCategory);
      formData.append('order', formOrder);

      if (formImageFile) {
        formData.append('image', formImageFile);
      } else if (formImageUrl.trim()) {
        formData.append('imageUrl', formImageUrl.trim());
      }

      if (editingDesign) {
        await roomDesignApi.update(editingDesign._id || editingDesign.id, formData);
        toast.success('Room design updated successfully');
      } else {
        await roomDesignApi.create(formData);
        toast.success('New room design added successfully');
      }

      setIsModalOpen(false);
      fetchDesigns();
    } catch (err) {
      console.error('Error saving room design:', err);
      toast.error(err.message || 'Failed to save room design');
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!designToDelete) return;
    setDeleting(true);
    try {
      await roomDesignApi.delete(designToDelete._id || designToDelete.id);
      toast.success('Room design removed successfully');
      setDesignToDelete(null);
      fetchDesigns();
    } catch (err) {
      toast.error(err.message || 'Failed to remove room design');
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'bedroom':
        return { label: 'Bedroom', bg: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60' };
      case 'living-room':
        return { label: 'Living Room', bg: 'bg-amber-950/70 text-amber-300 border-amber-700/60' };
      case 'kitchen':
        return { label: 'Kitchen', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60' };
      case 'wall-paint-colors':
        return { label: 'Wall Paint Colors', bg: 'bg-rose-950/70 text-rose-300 border-rose-700/60' };
      default:
        return { label: cat, bg: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  return (
    <AdminLayout
      title="Decore Room Catalog"
      subtitle="DECORE UR ROOM WITHOUT BUY IT"
      actions={
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Design
        </button>
      }
    >
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-studio-charcoal text-white border-studio-charcoal shadow-sm'
                    : 'bg-white text-studio-muted border-studio-border hover:border-studio-bronze hover:text-studio-charcoal'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-studio-bronze' : 'text-studio-muted'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search design title or desc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-studio-border text-xs text-studio-charcoal placeholder-studio-muted focus:outline-none focus:border-studio-bronze transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-studio-muted hover:text-studio-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : designs.length === 0 ? (
        <div className="bg-white border border-studio-border p-12 text-center my-6">
          <Palette className="w-12 h-12 text-studio-bronze/60 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-studio-charcoal mb-2">No Room Designs Found</h3>
          <p className="text-xs text-studio-muted max-w-md mx-auto mb-6">
            {searchQuery
              ? 'No design matched your search filter. Try clearing your search keyword.'
              : 'Start by uploading reference designs for Bedroom, Living Room, Kitchen, or Wall Paint Colors.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add First Design
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((design) => {
            const badge = getCategoryBadge(design.category);
            return (
              <div
                key={design._id || design.id || design.title}
                className="bg-white border border-studio-border group overflow-hidden flex flex-col justify-between hover:border-studio-bronze/70 transition-all shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Image Aspect ratio container */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img
                      src={design.imageUrl}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-studio-charcoal mb-1 line-clamp-1 group-hover:text-studio-bronze transition-colors">
                      {design.title}
                    </h3>
                    <p className="text-xs text-studio-muted line-clamp-2 leading-relaxed">
                      {design.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-studio-bg/60 border-t border-studio-border flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-studio-muted">
                    Order: #{design.order || 0}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(design)}
                      className="p-1.5 text-studio-muted hover:text-studio-charcoal hover:bg-white border border-transparent hover:border-studio-border transition-colors"
                      title="Edit Design"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDesignToDelete(design)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                      title="Delete Design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-studio-border max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-studio-border flex items-center justify-between bg-studio-bg/50 sticky top-0 z-10 backdrop-blur-md">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-studio-bronze block mb-0.5">
                  DECORE UR ROOM CATALOG
                </span>
                <h2 className="text-lg font-bold text-studio-charcoal">
                  {editingDesign ? 'Edit Room Design' : 'Add New Room Design'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-studio-muted hover:text-studio-charcoal hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-5">
              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formCategory === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setFormCategory(cat.id)}
                        className={`p-2.5 text-center flex flex-col items-center justify-center gap-1.5 border transition-all text-xs font-semibold ${
                          isSelected
                            ? 'bg-studio-charcoal text-white border-studio-charcoal shadow-sm'
                            : 'bg-studio-bg text-studio-muted border-studio-border hover:border-studio-bronze hover:text-studio-charcoal'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-studio-bronze' : 'text-studio-muted'}`} />
                        <span className="text-[11px] leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                  Design Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Japandi Minimalist Master Suite"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-xs text-studio-charcoal placeholder-studio-muted focus:outline-none focus:border-studio-bronze transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Materials, colors, aesthetics, lighting cues..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-studio-bg border border-studio-border text-xs text-studio-charcoal placeholder-studio-muted focus:outline-none focus:border-studio-bronze transition-colors"
                />
              </div>

              {/* Image Input Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                    Design Reference Image *
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-2 py-0.5 font-medium transition-colors ${
                        uploadMode === 'file'
                          ? 'bg-studio-charcoal text-white'
                          : 'text-studio-muted hover:text-studio-charcoal'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`px-2 py-0.5 font-medium transition-colors ${
                        uploadMode === 'url'
                          ? 'bg-studio-charcoal text-white'
                          : 'text-studio-muted hover:text-studio-charcoal'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {uploadMode === 'file' ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-studio-border hover:border-studio-bronze p-6 text-center cursor-pointer transition-colors bg-studio-bg/40 group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-studio-muted group-hover:text-studio-bronze mx-auto mb-2 transition-colors" />
                    <p className="text-xs font-semibold text-studio-charcoal mb-1">
                      {formImageFile ? formImageFile.name : 'Click to upload design image from device'}
                    </p>
                    <p className="text-[11px] text-studio-muted">
                      PNG, JPG, WEBP up to 15MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formImageUrl}
                      onChange={(e) => {
                        setFormImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-xs text-studio-charcoal placeholder-studio-muted focus:outline-none focus:border-studio-bronze transition-colors"
                    />
                  </div>
                )}

                {/* Preview Thumbnail */}
                {imagePreview && (
                  <div className="mt-3 relative w-full aspect-[16/9] bg-stone-100 border border-studio-border overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => toast.error('Could not load image preview from provided source')}
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm">
                      Image Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Order index */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 bg-studio-bg border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-studio-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-studio-border text-xs uppercase tracking-wider text-studio-muted hover:text-studio-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {saving && <LoadingSpinner size="sm" />}
                  {saving ? 'Saving...' : editingDesign ? 'Update Design' : 'Save Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {designToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-studio-border max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-studio-charcoal mb-1">
                  Delete Room Design?
                </h3>
                <p className="text-xs text-studio-muted leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-studio-charcoal">"{designToDelete.title}"</span>? This will remove it from the public category slider.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDesignToDelete(null)}
                className="px-4 py-2 border border-studio-border text-xs uppercase tracking-wider text-studio-muted hover:text-studio-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <LoadingSpinner size="sm" />}
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageRoomDesigns;
