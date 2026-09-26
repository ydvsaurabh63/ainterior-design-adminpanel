import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  ArrowLeft,
  Plus,
  X,
  Layers,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { projectApi } from '../services/api';
import toast from 'react-hot-toast';

const categoryOptions = [
  { value: 'living-room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'full-home', label: 'Full Home' },
  { value: 'furniture', label: 'Furniture' }
];

const AddProject = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'living-room',
    location: '',
    area: '',
    style: '',
    description: '',
    materials: '',
    featured: false,
    mainImageUrl: '',
    galleryImageUrls: ''
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMainFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }
    if (!mainImageFile && !formData.mainImageUrl.trim()) {
      toast.error('Please provide a main project image (file or image URL)');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('area', formData.area);
      data.append('style', formData.style);
      data.append('description', formData.description);
      data.append('featured', formData.featured);

      // Parse materials into array
      const materialsArray = formData.materials
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      data.append('materials', JSON.stringify(materialsArray));

      if (mainImageFile) {
        data.append('mainImage', mainImageFile);
      } else if (formData.mainImageUrl.trim()) {
        data.append('mainImageUrl', formData.mainImageUrl.trim());
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          data.append('galleryImages', file);
        });
      }

      if (formData.galleryImageUrls.trim()) {
        const urls = formData.galleryImageUrls
          .split('\n')
          .map((u) => u.trim())
          .filter(Boolean);
        data.append('galleryImageUrls', JSON.stringify(urls));
      }

      await projectApi.create(data);
      toast.success('Project created successfully!');
      navigate('/admin/projects');
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Create New Project"
      subtitle="Portfolio Management"
      actions={
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-studio-muted hover:text-studio-charcoal"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-6 sm:p-10 border border-studio-border shadow-sm space-y-8">
        {/* Basic Info */}
        <div>
          <h3 className="font-serif text-xl text-studio-charcoal mb-4 pb-2 border-b border-studio-border">
            Project Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Project Name / Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. The Serene Japandi Haven"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

            {/* Category (Strictly 4) */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              >
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Design Style */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Design Style *
              </label>
              <input
                type="text"
                name="style"
                required
                placeholder="e.g. Modern Minimalist / Japandi / Neo-Classical"
                value={formData.style}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Site Location *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Bandra West, Mumbai"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Area / Dimension *
              </label>
              <input
                type="text"
                name="area"
                required
                placeholder="e.g. 650 sq.ft / 4,200 sq.ft"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="sm:col-span-2 pt-2">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-studio-bronze rounded border-studio-border focus:ring-studio-bronze"
                />
                <span className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-studio-bronze" />
                  Mark as Featured Project on Homepage
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Narrative & Materials */}
        <div>
          <h3 className="font-serif text-xl text-studio-charcoal mb-4 pb-2 border-b border-studio-border">
            Architectural Narrative & Materials
          </h3>

          <div className="space-y-5">
            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Project Narrative & Description *
              </label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Describe the architectural concept, color palette, lighting design, and tailored spatial solution..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze resize-none"
              />
            </div>

            {/* Materials List */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Materials & Finishes (Comma-separated)
              </label>
              <p className="text-[11px] text-studio-muted mb-2">
                e.g. Roman Travertine, Fumed Oak Veneer, Brushed Brass, Boucle Wool
              </p>
              <input
                type="text"
                name="materials"
                placeholder="Roman Travertine, Fumed Oak Veneer, Brushed Brass"
                value={formData.materials}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>
          </div>
        </div>

        {/* Media / Images Upload */}
        <div>
          <h3 className="font-serif text-xl text-studio-charcoal mb-4 pb-2 border-b border-studio-border">
            Project Visuals & Cloudinary Upload
          </h3>

          <div className="space-y-6">
            {/* Main Cover Image */}
            <div className="p-4 bg-studio-bg border border-studio-border">
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Main Cover Photo *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainFileChange}
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-studio-charcoal file:text-white hover:file:bg-studio-bronze"
                  />
                  <p className="text-[11px] text-studio-muted mt-2">
                    Supports JPG, PNG, WEBP. Uploads to Cloudinary.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-studio-muted block mb-1">
                    Or Paste Remote Image URL
                  </label>
                  <input
                    type="url"
                    name="mainImageUrl"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.mainImageUrl}
                    onChange={(e) => {
                      handleChange(e);
                      setMainImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-studio-border text-xs focus:outline-none"
                  />
                </div>
              </div>

              {mainImagePreview && (
                <div className="mt-4 aspect-[16/9] max-w-xs overflow-hidden border border-studio-border">
                  <img
                    src={mainImagePreview}
                    alt="Main Cover Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="p-4 bg-studio-bg border border-studio-border">
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Additional Gallery Photos (Optional)
              </label>

              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryFilesChange}
                  className="text-xs file:mr-3 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-studio-charcoal file:text-white hover:file:bg-studio-bronze"
                />

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-studio-muted block mb-1">
                    Or Paste Multiple Image URLs (One URL per line)
                  </label>
                  <textarea
                    name="galleryImageUrls"
                    rows="3"
                    placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                    value={formData.galleryImageUrls}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-studio-border text-xs focus:outline-none resize-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-studio-border flex items-center justify-end gap-4">
          <Link
            to="/admin/projects"
            className="px-6 py-3 text-xs uppercase tracking-wider text-studio-muted hover:text-studio-charcoal font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Publishing Project...' : 'Publish Project to Live Gallery'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProject;
