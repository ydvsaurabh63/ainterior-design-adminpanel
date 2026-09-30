import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { catalogApi } from '../services/api';
import { CLIENT_CATEGORIES, getObjectsForClientCategory } from '../constants/catalogCategories';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  RefreshCw,
  X,
  AlertCircle,
  Eye,
  Wand2,
  SlidersHorizontal,
  Package,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageCatalog = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [selectedClientCategory, setSelectedClientCategory] = useState('all');
  const [selectedObjectCategory, setSelectedObjectCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Active item for Edit/Delete
  const [currentItem, setCurrentItem] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formClientCategory, setFormClientCategory] = useState(CLIENT_CATEGORIES[0].label);
  const [formObjectCategory, setFormObjectCategory] = useState(CLIENT_CATEGORIES[0].objects[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formStagedImageFile, setFormStagedImageFile] = useState(null);
  const [formStagedImageUrl, setFormStagedImageUrl] = useState('');
  const [stagedImagePreview, setStagedImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch catalog items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await catalogApi.getAll({
        clientCategory: selectedClientCategory !== 'all' ? selectedClientCategory : undefined,
        objectCategory: selectedObjectCategory !== 'all' ? selectedObjectCategory : undefined,
        search: searchTerm.trim() !== '' ? searchTerm.trim() : undefined
      });
      setItems(data || []);
    } catch (err) {
      console.warn('Catalog API error:', err.message);
      toast.error('Failed to load catalog items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedClientCategory, selectedObjectCategory, searchTerm]);

  // Handle Client Category change in form (Updates dynamic Object Category options)
  const handleFormClientCategoryChange = (newCategoryLabel) => {
    setFormClientCategory(newCategoryLabel);
    const availableObjects = getObjectsForClientCategory(newCategoryLabel);
    if (availableObjects.length > 0) {
      setFormObjectCategory(availableObjects[0]);
    }
  };

  // Image Upload File Handler (Product Image)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Staged Room Scene File Handler
  const handleStagedImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormStagedImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setStagedImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormName('');
    const defaultClientCat = CLIENT_CATEGORIES[0].label;
    setFormClientCategory(defaultClientCat);
    setFormObjectCategory(CLIENT_CATEGORIES[0].objects[0]);
    setFormDescription('');
    setFormBrand('');
    setFormPrice('');
    setFormImageFile(null);
    setFormImageUrl('');
    setImagePreview('');
    setFormStagedImageFile(null);
    setFormStagedImageUrl('');
    setStagedImagePreview('');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormName(item.name || '');
    setFormClientCategory(item.clientCategory || CLIENT_CATEGORIES[0].label);
    setFormObjectCategory(item.objectCategory || CLIENT_CATEGORIES[0].objects[0]);
    setFormDescription(item.description || '');
    setFormBrand(item.brand || '');
    setFormPrice(item.price || '');
    setFormImageFile(null);
    setFormImageUrl(item.imageUrl || '');
    setImagePreview(item.imageUrl || '');
    setFormStagedImageFile(null);
    setFormStagedImageUrl(item.stagedRoomImage || '');
    setStagedImagePreview(item.stagedRoomImage || '');
    setShowEditModal(true);
  };

  // Open Delete Modal
  const openDeleteModal = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  // Submit Add
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Product/Object Name is required');
      return;
    }
    if (!formImageFile && !formImageUrl.trim()) {
      toast.error('Please upload an image file or enter an image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', formName.trim());
      formData.append('clientCategory', formClientCategory);
      formData.append('objectCategory', formObjectCategory);
      formData.append('description', formDescription.trim());
      formData.append('brand', formBrand.trim());
      formData.append('price', formPrice.trim());
      formData.append('section', 'catalog');

      if (formImageFile) {
        formData.append('image', formImageFile);
      } else {
        formData.append('imageUrl', formImageUrl.trim());
      }

      if (formStagedImageFile) {
        formData.append('stagedRoomImage', formStagedImageFile);
      } else if (formStagedImageUrl.trim()) {
        formData.append('stagedRoomImage', formStagedImageUrl.trim());
      }

      await catalogApi.create(formData);
      toast.success(`Catalog item "${formName}" added successfully!`);
      setShowAddModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to add catalog item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentItem) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', formName.trim());
      formData.append('clientCategory', formClientCategory);
      formData.append('objectCategory', formObjectCategory);
      formData.append('description', formDescription.trim());
      formData.append('brand', formBrand.trim());
      formData.append('price', formPrice.trim());

      if (formImageFile) {
        formData.append('image', formImageFile);
      } else if (formImageUrl.trim()) {
        formData.append('imageUrl', formImageUrl.trim());
      }

      if (formStagedImageFile) {
        formData.append('stagedRoomImage', formStagedImageFile);
      } else if (formStagedImageUrl.trim()) {
        formData.append('stagedRoomImage', formStagedImageUrl.trim());
      }

      await catalogApi.update(currentItem._id, formData);
      toast.success(`Catalog item "${formName}" updated successfully!`);
      setShowEditModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to update catalog item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete
  const handleDeleteSubmit = async () => {
    if (!currentItem) return;
    setIsSubmitting(true);
    try {
      await catalogApi.delete(currentItem._id);
      toast.success('Catalog item deleted successfully');
      setShowDeleteModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.message || 'Failed to delete item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Available Objects for current filter dropdown
  const filterAvailableObjects =
    selectedClientCategory !== 'all' ? getObjectsForClientCategory(selectedClientCategory) : [];

  return (
    <AdminLayout
      title="Catalog Management"
      subtitle="TAB 02 // PRODUCTS & OBJECTS DIRECTORY"
      actions={
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" /> Add Catalog Item
        </button>
      }
    >
      <div className="space-y-6">
        {/* ========================================================
            TOP FILTER & SEARCH BAR
            ======================================================== */}
        <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog by name, brand or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:border-studio-bronze"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Client Category Filter Dropdown */}
            <div className="w-full md:w-64">
              <select
                value={selectedClientCategory}
                onChange={(e) => {
                  setSelectedClientCategory(e.target.value);
                  setSelectedObjectCategory('all');
                }}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none focus:border-studio-bronze cursor-pointer"
              >
                <option value="all">All Categories ({CLIENT_CATEGORIES.length})</option>
                {CLIENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Object Category Filter */}
            {selectedClientCategory !== 'all' && (
              <div className="w-full md:w-48">
                <select
                  value={selectedObjectCategory}
                  onChange={(e) => setSelectedObjectCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-none focus:border-studio-bronze cursor-pointer"
                >
                  <option value="all">All Objects ({filterAvailableObjects.length})</option>
                  {filterAvailableObjects.map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            CATALOG ITEMS GRID
            ======================================================== */}
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-studio-bronze mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-medium">Loading catalog items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center bg-white border border-dashed border-stone-300 rounded-xl p-6">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No products available in this category yet.</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Click "Add Catalog Item" above to upload items for this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => (
              <div
                key={item._id || item.id || item.name}
                className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {item.objectCategory}
                    </span>
                    {item.stagedRoomImage && (
                      <span className="absolute bottom-2 right-2 bg-emerald-700/90 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Staged Scene
                      </span>
                    )}
                  </div>

                  {/* Client Category badge */}
                  <div className="text-[10px] font-semibold text-studio-bronze uppercase tracking-wider mb-1 line-clamp-1">
                    {item.clientCategory}
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-xs sm:text-[13px] text-stone-900 leading-snug line-clamp-2 mb-1">
                    {item.name}
                  </h4>

                  {/* Description */}
                  {item.description && (
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-2 font-light">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs mt-2">
                  <span className="font-bold text-stone-700 text-[11px]">
                    {item.brand || 'AURA'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
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
      </div>

      {/* ========================================================
          ADD / EDIT MODAL FORM
          ======================================================== */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 max-w-2xl w-full rounded-2xl p-6 sm:p-7 shadow-2xl relative my-8 animate-fade-in max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-stone-900 mb-1">
              {showAddModal ? 'Add Catalog Item' : 'Edit Catalog Item'}
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Upload product details and select Client & Object category specifications.
            </p>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
              {/* Product/Object Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product/Object Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tufted Corduroy Armless Sofa"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze"
                />
              </div>

              {/* Client Category Select */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Client Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formClientCategory}
                  onChange={(e) => handleFormClientCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold focus:outline-none focus:border-studio-bronze cursor-pointer"
                >
                  {CLIENT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* DYNAMIC Object/Product Category Select */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Object/Product Category <span className="text-rose-500">*</span>
                  <span className="text-[10px] font-normal text-stone-400 ml-1.5">
                    (Filtered by Client Category)
                  </span>
                </label>
                <select
                  value={formObjectCategory}
                  onChange={(e) => setFormObjectCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-semibold focus:outline-none focus:border-studio-bronze cursor-pointer"
                >
                  {getObjectsForClientCategory(formClientCategory).map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Brand / Dealer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Joss & Main / IKEA"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Price / Range</label>
                  <input
                    type="text"
                    placeholder="e.g. $1,299"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of spatial features and materials..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze"
                />
              </div>

              {/* Dual Image Uploads: Product Image & Furnished Room Scene */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                {/* 1. Product Image */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-800">
                      1. Product Image <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase">Sidebar</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    Individual furniture/item photo shown on the left sidebar cards.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="Or paste image URL..."
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze bg-white"
                  />
                  {imagePreview && (
                    <div className="relative aspect-video max-h-28 rounded-lg overflow-hidden border border-stone-200 bg-white">
                      <img src={imagePreview} alt="Product Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* 2. Furnished Room Staged Scene */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-800">
                      2. Furnished Room Scene
                    </label>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase">Right Canvas</span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    The room with this item placed inside. Opens 100% fit on right canvas.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStagedImageFileChange}
                    className="w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-studio-bronze file:text-white hover:file:bg-studio-bronzeDark cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="Or paste staged room URL..."
                    value={formStagedImageUrl}
                    onChange={(e) => {
                      setFormStagedImageUrl(e.target.value);
                      setStagedImagePreview(e.target.value);
                    }}
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze bg-white"
                  />
                  {stagedImagePreview && (
                    <div className="relative aspect-video max-h-28 rounded-lg overflow-hidden border border-emerald-300 bg-white shadow-xs">
                      <img src={stagedImagePreview} alt="Staged Scene Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 border border-stone-200 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Item'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
          ======================================================== */}
      {showDeleteModal && currentItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 max-w-sm w-full rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-stone-900">Delete Catalog Item?</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete <strong>"{currentItem.name}"</strong>? This item will be removed from the catalog.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 border border-stone-200 text-xs font-semibold rounded-lg hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageCatalog;
