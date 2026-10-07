import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  X,
  Layers,
  MapPin,
  Maximize2,
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronRight,
  Eye,
  ChevronDown,
  Check,
  Filter
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { projectApi } from '../services/api';
import toast from 'react-hot-toast';

// 5 Specialized Client Sectors (from Screenshot 2)
const clientSectors = [
  {
    id: 'furniture-manufacturers-dealers',
    label: 'Furniture Manufacturers & Dealers',
    subtitle: 'Loose & Fixed Furniture',
    icon: '🛋️'
  },
  {
    id: 'interior-design-companies-designers',
    label: 'Interior Design Companies & Designers',
    subtitle: 'Turnkey Spatial Concepts',
    icon: '📐'
  },
  {
    id: 'real-estate-developers-builders',
    label: 'Real Estate Developers & Builders',
    subtitle: 'Model Suites & Turnkey Fit-Outs',
    icon: '🏢'
  },
  {
    id: 'home-decor-tiles-flooring',
    label: 'Home Décor, Tiles & Flooring Brands',
    subtitle: 'Surfaces & Architectural Finishes',
    icon: '🏺'
  },
  {
    id: 'modular-kitchen-wardrobe-companies',
    label: 'Modular Kitchen & Wardrobe Companies',
    subtitle: 'Millwork & Cabinetry Systems',
    icon: '🍳'
  }
];

const getCategoryLabel = (id) => {
  if (!id || id === 'all') return 'All Projects';
  const sector = clientSectors.find((s) => s.id === id);
  if (sector) return sector.label;
  return id.replace(/-/g, ' ');
};

const ManageProjects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const data = await projectApi.getAll(params);
      setProjects(Array.isArray(data) ? data : []);
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

  const totalProjects = projects.length;
  const featuredProjects = projects.filter((p) => p.featured).length;

  return (
    <AdminLayout
      title="Projects & Portfolio"
      subtitle="MASTERWORKS • ARCHITECTURAL & INTERIOR CATALOG"
      actions={
        <Link
          to="/admin/projects/add"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>+ Add New Project</span>
        </Link>
      }
    >
      {/* 1. Metric Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Total Portfolio</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{totalProjects}</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Featured Works</span>
          <div className="text-2xl font-extrabold text-amber-800 mt-1">{featuredProjects}</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">Active Filter</span>
          <div className="text-base font-bold text-blue-900 mt-1 truncate" title={getCategoryLabel(categoryFilter)}>
            {getCategoryLabel(categoryFilter)}
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Live Status</span>
          <div className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live on Website
          </div>
        </div>
      </div>

      {/* 2. Filter, Search & View Mode Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: All Projects Button & Category Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* "All Projects" Button (Screenshot 1) */}
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('all');
              searchParams.delete('category');
              setSearchParams(searchParams);
              setIsDropdownOpen(false);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            All Projects
          </button>

          {/* Category Dropdown (Replaces Screenshot 3 horizontal space with clean popup) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                categoryFilter !== 'all'
                  ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span className="max-w-[130px] sm:max-w-[180px] truncate">
                {categoryFilter !== 'all' ? getCategoryLabel(categoryFilter) : 'Select Category'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180 text-amber-600' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Popup */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-stone-100 animate-in fade-in duration-150">
                {/* 5 Specialized Client Sectors (Screenshot 2) */}
                <div className="p-2">
                  <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    <span>Select Client Category</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">5 Sectors</span>
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {clientSectors.map((sector) => {
                      const isSelected = categoryFilter === sector.id;
                      return (
                        <button
                          key={sector.id}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(sector.id);
                            setSearchParams({ category: sector.id });
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-white font-bold'
                              : 'text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="text-sm shrink-0">{sector.icon}</span>
                            <div className="truncate">
                              <p className={`truncate text-xs ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                                {sector.label}
                              </p>
                              <p className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                                {sector.subtitle}
                              </p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>



                {/* Reset button inside dropdown */}
                {categoryFilter !== 'all' && (
                  <div className="p-2 bg-stone-50">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter('all');
                        searchParams.delete('category');
                        setSearchParams(searchParams);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      Clear Category Filter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Clear Filter button */}
          {categoryFilter !== 'all' && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('all');
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs rounded-lg transition-colors cursor-pointer"
              title="Clear category filter"
            >
              <span>Reset</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Note: The 3rd screenshot horizontal space is now empty and uncluttered! */}

        {/* Right: Layout Toggle & Search Box */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-400 text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* 3. Projects Showcase (Grid or Table View) */}
      {loading ? (
        <div className="py-24 bg-white border border-stone-200 rounded-xl">
          <LoadingSpinner text="Fetching architectural portfolio works..." />
        </div>
      ) : projects.length > 0 ? (
        viewMode === 'grid' ? (
          /* ========================================================
             LUXURY GRID VIEW
             ======================================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {projects.map((p) => {
              const liveUrl = `${import.meta.env.VITE_SITE_URL || 'https://ainterior-design-frontend.vercel.app'}/projects/${p._id}`;

              return (
                <div
                  key={p._id}
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Project Cover Image */}
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                      <img
                        src={p.mainImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                          {p.category?.replace('-', ' ') || 'Interior'}
                        </span>
                        {p.featured && (
                          <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-bold text-stone-900 text-sm truncate group-hover:text-amber-800 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                        <span>{p.location || 'Studio Project'}</span>
                      </p>
                      <div className="text-[11px] text-stone-400 pt-1 flex items-center gap-2">
                        <span>{p.area || 'Turnkey'}</span>
                        <span>•</span>
                        <span>{p.style || 'Modern'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold text-[11px]"
                      title="View on Live Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/projects/edit/${p._id}`}
                        className="px-2.5 py-1 text-stone-700 hover:text-amber-800 hover:bg-stone-200/60 font-semibold rounded transition-colors text-[11px] flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(p)}
                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================
             CLEAN TABLE VIEW
             ======================================================== */
          <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Area & Style</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {projects.map((p) => {
                    const liveUrl = `${import.meta.env.VITE_SITE_URL || 'https://ainterior-design-frontend.vercel.app'}/projects/${p._id}`;

                    return (
                      <tr key={p._id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.mainImage}
                              alt={p.title}
                              className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                                {p.title}
                              </h4>
                              <span className="text-[10px] text-stone-400 font-mono truncate block">
                                {p.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-800 capitalize">
                          {p.category?.replace('-', ' ')}
                        </td>
                        <td className="py-3 px-4 text-stone-500">{p.location || 'Studio'}</td>
                        <td className="py-3 px-4 text-stone-700">
                          <span>{p.area}</span> • <span className="text-stone-400">{p.style}</span>
                        </td>
                        <td className="py-3 px-4">
                          {p.featured ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full border border-amber-300">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Regular</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                              title="View on Live Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <Link
                              to={`/admin/projects/edit/${p._id}`}
                              className="p-1.5 text-stone-700 hover:text-amber-800 hover:bg-stone-100 rounded-lg transition-colors"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setProjectToDelete(p)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="p-16 text-center bg-white border border-stone-200 rounded-xl shadow-xs">
          <Layers className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-stone-700">Koi project nahi mila</h4>
          <p className="text-xs text-stone-500 mt-1 mb-5">Filter change karein ya naya portfolio work add karein</p>
          <Link
            to="/admin/projects/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Create First Project</span>
          </Link>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Delete Portfolio Project</h3>
                <p className="text-xs text-stone-500 mt-0.5">Yeh action undo nahi kiya ja sakta</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
              Kya aap sach mein project "
              <strong className="text-stone-900">{projectToDelete.title}</strong>" ko permanently delete karna chahte hain?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageProjects;
