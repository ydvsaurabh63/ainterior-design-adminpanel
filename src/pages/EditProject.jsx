import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  ArrowLeft,
  X,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { projectApi } from '../services/api';
import toast from 'react-hot-toast';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mainImageUrl: ''
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectApi.getById(id);
        const p = data.project || data;
        setFormData({
          title: p.title || '',
          description: p.description || '',
          mainImageUrl: p.mainImage || ''
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (JPG, PNG, WEBP)');
        return;
      }
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, mainImageUrl: '' }));
    }
  };

  const handleRemoveImage = () => {
    setMainImageFile(null);
    setMainImagePreview('');
    setFormData((prev) => ({ ...prev, mainImageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Project Name is required');
      return;
    }

    if (!mainImageFile && !formData.mainImageUrl.trim() && !mainImagePreview) {
      toast.error('Please upload an image for the project');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());

      if (mainImageFile) {
        data.append('mainImage', mainImageFile);
      } else if (formData.mainImageUrl.trim()) {
        data.append('mainImageUrl', formData.mainImageUrl.trim());
      }

      await projectApi.update(id, data);
      toast.success('Project updated successfully!');
      navigate('/admin/projects');
    } catch (err) {
      console.error('Project update error:', err);
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
      subtitle="Quick Portfolio & Showcase Management"
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
      <div className="max-w-2xl bg-white border border-studio-border shadow-sm p-6 sm:p-10">
        <div className="mb-6 pb-4 border-b border-studio-border/70 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-studio-charcoal font-medium">
              Edit Project Details
            </h2>
            <p className="text-xs text-studio-muted mt-1">
              Update the project name, description, and photo.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Live Sync
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Project Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-studio-charcoal mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. The Serene Japandi Haven"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze focus:bg-white transition-all rounded-xs"
            />
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-studio-charcoal mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the architectural concept, color palette, lighting design, and tailored spatial solution..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze focus:bg-white transition-all rounded-xs resize-y"
            />
          </div>

          {/* 3. Image Upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-studio-charcoal mb-2">
              Project Image *
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {!mainImagePreview && !formData.mainImageUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-studio-border hover:border-studio-bronze bg-studio-bg/60 hover:bg-studio-bg p-8 sm:p-10 rounded-sm text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-studio-border group-hover:scale-105 group-hover:border-studio-bronze transition-all flex items-center justify-center text-studio-muted group-hover:text-studio-bronze shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-studio-charcoal">
                    Click to upload project photo
                  </p>
                  <p className="text-xs text-studio-muted mt-1">
                    Supports JPG, PNG, WEBP (High resolution recommended)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative border border-studio-border rounded-sm overflow-hidden bg-studio-bg">
                <div className="aspect-[16/9] w-full max-h-80 overflow-hidden flex items-center justify-center bg-black/5">
                  <img
                    src={mainImagePreview || formData.mainImageUrl}
                    alt="Project Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-white border-t border-studio-border flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <ImageIcon className="w-4 h-4 text-studio-bronze flex-shrink-0" />
                    <span className="text-xs font-medium text-studio-charcoal truncate">
                      {mainImageFile ? mainImageFile.name : 'Current Image Loaded'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 bg-studio-bg hover:bg-studio-border text-studio-charcoal text-xs font-medium transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-studio-bronze hover:underline font-medium inline-flex items-center gap-1"
              >
                {showUrlInput ? 'Hide web image URL' : 'Or paste an image URL instead'}
              </button>
            </div>

            {showUrlInput && (
              <div className="mt-2">
                <input
                  type="url"
                  name="mainImageUrl"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.mainImageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value.trim()) {
                      setMainImagePreview(e.target.value.trim());
                      setMainImageFile(null);
                    }
                  }}
                  className="w-full px-3 py-2 bg-studio-bg border border-studio-border text-xs text-studio-charcoal focus:outline-none focus:border-studio-bronze"
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-studio-border flex items-center justify-end gap-3">
            <Link
              to="/admin/projects"
              className="px-5 py-2.5 text-xs uppercase tracking-wider text-studio-muted hover:text-studio-charcoal font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 bg-studio-charcoal text-white text-xs uppercase tracking-[0.18em] font-bold hover:bg-studio-bronze transition-all shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{submitting ? 'Saving Changes...' : 'Update Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProject;
