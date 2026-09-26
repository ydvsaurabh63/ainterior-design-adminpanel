import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { projectApi } from '../services/api';
import toast from 'react-hot-toast';

const categoryOptions = [
  { value: 'living-room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'full-home', label: 'Full Home' },
  { value: 'furniture', label: 'Furniture' }
];

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectApi.getById(id);
        const p = data.project || data;
        setFormData({
          title: p.title || '',
          category: p.category || 'living-room',
          location: p.location || '',
          area: p.area || '',
          style: p.style || '',
          description: p.description || '',
          materials: Array.isArray(p.materials) ? p.materials.join(', ') : '',
          featured: p.featured || false,
          mainImageUrl: p.mainImage || '',
          galleryImageUrls: Array.isArray(p.galleryImages) ? p.galleryImages.join('\n') : ''
        });
        setMainImagePreview(p.mainImage || '');
      } catch (err) {
        toast.error('Failed to load project details');
        navigate('/admin/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

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

      await projectApi.update(id, data);
      toast.success('Project updated successfully!');
      navigate('/admin/projects');
    } catch (err) {
      toast.error(err.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Project" subtitle="Portfolio Management">
        <LoadingSpinner text="Loading project details..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Edit Project: ${formData.title}`}
      subtitle="Portfolio Management"
      actions={
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-studio-muted hover:text-studio-charcoal"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-6 sm:p-10 border border-studio-border shadow-sm space-y-8">
        <div>
          <h3 className="font-serif text-xl text-studio-charcoal mb-4 pb-2 border-b border-studio-border">
            Project Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Project Name / Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

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

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Design Style *
              </label>
              <input
                type="text"
                name="style"
                required
                value={formData.style}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Site Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Area / Dimension *
              </label>
              <input
                type="text"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>

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

        {/* Description & Materials */}
        <div>
          <h3 className="font-serif text-xl text-studio-charcoal mb-4 pb-2 border-b border-studio-border">
            Architectural Narrative & Materials
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Project Narrative & Description *
              </label>
              <textarea
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Materials & Finishes (Comma-separated)
              </label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze"
              />
            </div>
          </div>
        </div>

        {/* Media & Images */}
        <div>
          <h3 className="font-serif text-xl text-studio-charcoal mb-4 pb-2 border-b border-studio-border">
            Project Visuals
          </h3>

          <div className="space-y-6">
            <div className="p-4 bg-studio-bg border border-studio-border">
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Main Cover Photo
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainFileChange}
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-studio-charcoal file:text-white hover:file:bg-studio-bronze"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    name="mainImageUrl"
                    placeholder="Image URL"
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
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-studio-bg border border-studio-border">
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Gallery Photos (Upload additional or edit URLs)
              </label>

              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryFilesChange}
                  className="text-xs file:mr-3 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-studio-charcoal file:text-white hover:file:bg-studio-bronze"
                />

                <textarea
                  name="galleryImageUrls"
                  rows="3"
                  value={formData.galleryImageUrls}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-studio-border text-xs focus:outline-none resize-none font-mono"
                />
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
            {submitting ? 'Updating Project...' : 'Save & Update Project'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProject;
