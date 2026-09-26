import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { projectApi } from '../services/api';
import toast from 'react-hot-toast';

const filterCategories = [
  { id: 'all', label: 'All' },
  { id: 'living-room', label: 'Living Room' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'full-home', label: 'Full Home' },
  { id: 'furniture', label: 'Furniture' }
];

const ManageProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const data = await projectApi.getAll(params);
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [categoryFilter, searchQuery]);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      await projectApi.delete(projectToDelete._id);
      toast.success('Project deleted successfully');
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Manage Portfolio Projects"
      subtitle="Content Management System"
      actions={
        <Link
          to="/admin/projects/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Project</span>
        </Link>
      }
    >
      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 border border-studio-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {filterCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategoryFilter(c.id);
                if (c.id === 'all') {
                  searchParams.delete('category');
                  setSearchParams(searchParams);
                } else {
                  setSearchParams({ category: c.id });
                }
              }}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                categoryFilter === c.id
                  ? 'bg-studio-charcoal text-white'
                  : 'bg-studio-bg text-studio-charcoal hover:bg-studio-sand border border-studio-border'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-studio-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-studio-bg border border-studio-border text-xs focus:outline-none focus:border-studio-bronze"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-studio-border shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching projects..." />
        ) : projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-studio-sand/70 border-b border-studio-border text-studio-charcoal uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Area & Style</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-border">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-studio-bg/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage}
                          alt={p.title}
                          className="w-12 h-12 object-cover border border-studio-border flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-studio-charcoal">
                            {p.title}
                          </h4>
                          <span className="text-[10px] text-studio-muted">{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-studio-bronze">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 text-studio-muted">{p.location}</td>
                    <td className="py-3 px-4 text-studio-charcoal">
                      <span>{p.area}</span> • <span className="text-studio-muted">{p.style}</span>
                    </td>
                    <td className="py-3 px-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Regular</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/project/${p._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-stone-500 hover:text-studio-charcoal border border-transparent hover:border-studio-border rounded transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/projects/edit/${p._id}`}
                          className="p-1.5 text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 rounded transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setProjectToDelete(p)}
                          className="p-1.5 text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 rounded transition-colors"
                          title="Delete Project"
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
            <p className="text-sm text-studio-muted mb-4">No projects found matching criteria.</p>
            <Link
              to="/admin/projects/add"
              className="px-4 py-2 bg-studio-charcoal text-white text-xs uppercase tracking-wider inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Project</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 max-w-md w-full border border-studio-border shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-2xl text-studio-charcoal">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-studio-muted leading-relaxed">
              Are you sure you want to permanently delete project "
              <strong className="text-studio-charcoal">{projectToDelete.title}</strong>"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-studio-muted hover:text-studio-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-semibold shadow-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageProjects;
