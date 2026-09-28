import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  XCircle,
  Tag
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { popularItemApi } from '../services/api';
import toast from 'react-hot-toast';

const ManagePopularItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const data = await popularItemApi.getAll(params);
      setItems(data);
    } catch (err) {
      console.error('Failed to load popular items:', err);
      toast.error('Failed to load popular items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [categoryFilter, searchQuery]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await popularItemApi.delete(itemToDelete._id);
      toast.success('Product removed successfully');
      setItemToDelete(null);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to remove product');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = !item.isPopular;
      await popularItemApi.update(item._id, { isPopular: newStatus });
      toast.success(`Product ${newStatus ? 'shown in' : 'hidden from'} Popular Items`);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Distinct categories from existing items
  const uniqueCategories = [
    'all',
    ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))
  ];

  return (
    <AdminLayout
      title="Popular Items Tried by Customers"
      subtitle="Homepage Showcase & Try-On Catalog"
      actions={
        <div className="flex items-center gap-3">
          <a
            href={import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-studio-border bg-white text-studio-charcoal text-xs uppercase tracking-wider font-semibold hover:border-studio-bronze transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-studio-bronze" />
            <span>View On Website</span>
          </a>
          <Link
            to="/admin/popular-items/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add New Product</span>
          </Link>
        </div>
      }
    >
      {/* Informative Guidance Banner */}
      <div className="mb-6 p-4 sm:p-5 bg-stone-900 text-stone-200 border-l-4 border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs sm:text-sm font-medium text-white">
              Live Showcase: "Popular items tried by customers"
            </p>
            <p className="text-[11px] sm:text-xs text-stone-400 font-light mt-0.5">
              Any product added or edited here instantly reflects on the website homepage in the interactive furniture try-on slider.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-mono uppercase tracking-wider font-bold rounded flex-shrink-0">
          {items.length} Active Items
        </span>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 border border-studio-border mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? 'bg-studio-charcoal text-white'
                  : 'bg-studio-sand/50 text-studio-muted hover:text-studio-charcoal'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted" />
          <input
            type="text"
            placeholder="Search by name, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
          />
        </div>
      </div>

      {/* Products Content */}
      {loading ? (
        <LoadingSpinner text="Loading popular items..." />
      ) : items.length === 0 ? (
        <div className="bg-white border border-studio-border p-12 text-center">
          <Tag className="w-12 h-12 text-studio-bronze mx-auto mb-4 opacity-50" />
          <h3 className="font-serif text-lg text-studio-charcoal font-medium mb-1">
            No Popular Products Found
          </h3>
          <p className="text-xs text-studio-muted mb-6">
            {searchQuery
              ? 'No products matched your search term.'
              : 'Add your first product to appear in "Popular items tried by customers".'}
          </p>
          <Link
            to="/admin/popular-items/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Add First Product</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-studio-border hover:border-studio-bronze transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
            >
              <div>
                {/* Product Thumbnail Container */}
                <div className="relative w-full h-48 bg-[#F7F7F6] overflow-hidden flex items-center justify-center p-4 border-b border-studio-border/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Brand Pill */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-studio-charcoal text-[10px] font-bold px-2 py-0.5 shadow-xs uppercase tracking-wider border border-stone-200">
                    {item.brand}
                  </span>

                  {/* Time Badge */}
                  <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-full font-mono">
                    {item.time || 'Recently'}
                  </span>

                  {/* Popular Status Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    title={item.isPopular ? 'Active in showcase' : 'Hidden from showcase'}
                    className={`absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1 shadow-sm transition-colors ${
                      item.isPopular
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-stone-200 text-stone-600 border border-stone-300'
                    }`}
                  >
                    {item.isPopular ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-stone-500" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-studio-muted">
                    <span className="uppercase tracking-wider font-semibold text-studio-bronze truncate">
                      {item.category}
                    </span>
                    <span className="font-mono font-bold text-studio-charcoal">
                      {item.price}
                    </span>
                  </div>

                  <h3
                    className="font-serif text-sm font-semibold text-studio-charcoal line-clamp-2 leading-snug group-hover:text-studio-bronze transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </h3>

                  <div className="text-[11px] text-stone-400 font-mono pt-1">
                    <span>Dimensions: </span>
                    <span className="text-stone-600">{item.dimensions || 'Standard'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-stone-50 border-t border-studio-border/60 flex items-center justify-between">
                {item.productUrl ? (
                  <a
                    href={item.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-studio-muted hover:text-studio-bronze flex items-center gap-1 transition-colors"
                  >
                    <span>Store Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-stone-400">Direct studio item</span>
                )}

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/admin/popular-items/edit/${item._id}`}
                    className="p-1.5 text-stone-500 hover:text-studio-charcoal hover:bg-white rounded transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 border border-studio-border shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-studio-border">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-lg font-medium text-studio-charcoal">
                  Confirm Removal
                </h3>
              </div>
              <button
                onClick={() => setItemToDelete(null)}
                className="text-studio-muted hover:text-studio-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-studio-muted leading-relaxed">
              Are you sure you want to remove{' '}
              <strong className="text-studio-charcoal font-semibold">"{itemToDelete.name}"</strong>? It will no longer appear in the "Popular items tried by customers" carousel on the website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-studio-border text-xs uppercase tracking-wider font-semibold text-studio-muted hover:text-studio-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 text-white text-xs uppercase tracking-wider font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Removing...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManagePopularItems;
