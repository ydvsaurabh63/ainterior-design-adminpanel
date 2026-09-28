import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  ArrowLeft,
  Sparkles,
  Eye,
  Tag,
  DollarSign,
  Maximize,
  Clock,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { popularItemApi } from '../services/api';
import toast from 'react-hot-toast';

const roomPresets = [
  { label: 'Living Room (Sofa View)', value: '/sample-rooms/room-furnished-sofa.jpg' },
  { label: 'Modern Sectional Lounge', value: '/sample-rooms/room-furnished-sectional.jpg' },
  { label: 'Cozy Reading Nook (Armchair)', value: '/sample-rooms/room-furnished-armchair.jpg' }
];

const brandPresets = ['Wayfair', 'IKEA', 'Birch Lane', 'Joss & Main', 'West Elm', 'Pottery Barn', 'Studio Custom'];
const timePresets = ['Just now', 'Today', '2 d ago', '8 d ago', '14 d ago', '38 d ago'];

const AddPopularItem = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Wayfair',
    category: 'Loveseat',
    price: '$670',
    dimensions: '160 × 85 cm',
    time: '2 d ago',
    productUrl: '',
    roomImage: '/sample-rooms/room-furnished-sofa.jpg',
    isPopular: true,
    order: 0,
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, WebP)');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.brand.trim()) {
      toast.error('Brand name is required');
      return;
    }

    if (!imageFile && !formData.imageUrl.trim()) {
      toast.error('Please provide a product image (upload a file or paste an image URL)');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('brand', formData.brand.trim());
      data.append('category', formData.category.trim());
      data.append('price', formData.price.trim());
      data.append('dimensions', formData.dimensions.trim());
      data.append('time', formData.time.trim() || 'Recently');
      data.append('productUrl', formData.productUrl.trim());
      data.append('roomImage', formData.roomImage);
      data.append('isPopular', formData.isPopular);
      data.append('order', formData.order);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl.trim()) {
        data.append('imageUrl', formData.imageUrl.trim());
      }

      await popularItemApi.create(data);
      toast.success('Product added successfully! It is now live in "Popular items tried by customers".');
      navigate('/admin/popular-items');
    } catch (err) {
      console.error('Failed to create popular item:', err);
      toast.error(err.message || 'Failed to create popular product');
    } finally {
      setSubmitting(false);
    }
  };

  // Live image source for preview
  const previewImageSrc =
    imagePreview ||
    formData.imageUrl ||
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';

  return (
    <AdminLayout
      title="Add New Popular Try-On Product"
      subtitle="Customer Try-On Catalog"
      actions={
        <Link
          to="/admin/popular-items"
          className="inline-flex items-center gap-2 px-4 py-2 border border-studio-border bg-white text-studio-charcoal text-xs uppercase tracking-wider font-semibold hover:border-studio-bronze transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Fields (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-studio-border space-y-6 shadow-xs">
            <h2 className="font-serif text-lg text-studio-charcoal font-medium border-b border-studio-border/60 pb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-studio-bronze" />
              <span>Product Specifications</span>
            </h2>

            {/* Product Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Carmencita linen loveseat"
                required
                className="w-full px-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
              />
            </div>

            {/* Brand / Vendor */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                Brand / Store Name *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Wayfair, IKEA, Birch Lane..."
                  required
                  className="flex-1 px-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                />
              </div>
              {/* Quick Brand presets */}
              <div className="flex flex-wrap gap-1.5">
                {brandPresets.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, brand: b }))}
                    className={`text-[10px] px-2 py-0.5 border transition-colors ${
                      formData.brand === b
                        ? 'bg-studio-charcoal text-white border-studio-charcoal font-bold'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Sectional Sofa, Accent Chair"
                  className="w-full px-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                  Display Price
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted" />
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. $670 or ₹45,000"
                    className="w-full pl-8 pr-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions & Time Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                  Dimensions
                </label>
                <div className="relative">
                  <Maximize className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted" />
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="e.g. 160 × 85 cm"
                    className="w-full pl-8 pr-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                  Age / Time Label
                </label>
                <div className="relative mb-2">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted" />
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="e.g. 2 d ago"
                    className="w-full pl-8 pr-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                  />
                </div>
                {/* Time presets */}
                <div className="flex flex-wrap gap-1.5">
                  {timePresets.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, time: t }))}
                      className={`text-[10px] px-2 py-0.5 border transition-colors ${
                        formData.time === t
                          ? 'bg-studio-charcoal text-white border-studio-charcoal font-bold'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Store URL */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                External Product Link (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted" />
                <input
                  type="url"
                  name="productUrl"
                  value={formData.productUrl}
                  onChange={handleChange}
                  placeholder="https://www.wayfair.com/..."
                  className="w-full pl-8 pr-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
                />
              </div>
            </div>

            {/* Virtual Room Preset */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-studio-charcoal font-bold mb-2">
                Default Try-On Room Scene
              </label>
              <select
                name="roomImage"
                value={formData.roomImage}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
              >
                {roomPresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-studio-muted mt-1 font-light">
                When a customer clicks this item on the homepage, it will render inside this virtual room setup.
              </p>
            </div>

            {/* Active Toggle & Order */}
            <div className="pt-4 border-t border-studio-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  className="w-4 h-4 text-studio-bronze border-studio-border rounded focus:ring-studio-bronze"
                />
                <span className="text-xs uppercase tracking-wider text-studio-charcoal font-bold">
                  Visible in Homepage Carousel
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-studio-muted font-medium">Display Priority Order:</span>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-20 px-2 py-1 border border-studio-border text-xs text-center focus:outline-none focus:border-studio-bronze"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Image Upload & Live Card Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Image Upload Box */}
            <div className="bg-white p-6 sm:p-8 border border-studio-border space-y-5 shadow-xs">
              <h2 className="font-serif text-lg text-studio-charcoal font-medium border-b border-studio-border/60 pb-3 flex items-center gap-2">
                <Upload className="w-4 h-4 text-studio-bronze" />
                <span>Product Image *</span>
              </h2>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-studio-border hover:border-studio-bronze p-6 text-center transition-colors">
                <input
                  type="file"
                  id="product-image-upload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="product-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 bg-studio-sand/40 border border-studio-border flex items-center justify-center text-studio-bronze">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-studio-charcoal uppercase tracking-wider">
                    {imageFile ? imageFile.name : 'Click to upload image'}
                  </span>
                  <span className="text-[10px] text-studio-muted">
                    Supports JPG, PNG, WebP (Transparent or clean white background recommended)
                  </span>
                </label>
              </div>

              {/* OR Image URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-studio-border" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-studio-muted">
                  <span className="bg-white px-2">OR USE IMAGE URL</span>
                </div>
              </div>

              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 border border-studio-border text-xs focus:outline-none focus:border-studio-bronze bg-white"
              />
            </div>

            {/* LIVE EXACT REPLICA OF HOMEPAGE CARD */}
            <div className="bg-white p-6 sm:p-8 border border-studio-border space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-studio-border/60 pb-3">
                <h3 className="text-xs uppercase tracking-widest text-studio-charcoal font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Live Homepage Card Preview</span>
                </h3>
                <span className="text-[10px] text-studio-muted font-mono">Exact 1:1 Rendering</span>
              </div>

              <p className="text-[11px] text-studio-muted font-light">
                Here is exactly how your product will look inside the "Popular items tried by customers" horizontal slider on the homepage:
              </p>

              {/* The Carousel Card Preview */}
              <div className="flex justify-center p-4 bg-stone-100/60 rounded-xl border border-stone-200">
                <div className="w-40 sm:w-44 bg-white rounded-2xl p-2.5 border-2 border-[#84cc16] ring-2 ring-[#84cc16]/20 bg-lime-50/15 shadow-md flex flex-col justify-between">
                  {/* Thumbnail Image */}
                  <div className="w-full h-28 bg-[#F7F7F6] rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2 relative">
                    <img
                      src={previewImageSrc}
                      alt={formData.name || 'Product'}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#84cc16]" />
                  </div>

                  {/* Brand and Time metadata line */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-medium mb-1">
                    <span className="font-bold text-neutral-700 truncate max-w-[65px]">
                      {formData.brand || 'Wayfair'}
                    </span>
                    <span className="flex-shrink-0">{formData.time || '2 d ago'}</span>
                  </div>

                  {/* Product Title */}
                  <h4 className="text-xs font-semibold text-neutral-800 line-clamp-2 leading-tight">
                    {formData.name || 'Carmencita linen loveseat'}
                  </h4>
                </div>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="bg-white p-6 border border-studio-border flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 px-6 bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze transition-colors shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Publishing Product...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Publish To Homepage</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/popular-items')}
                className="py-3 px-5 border border-studio-border text-xs uppercase tracking-wider font-semibold text-studio-muted hover:text-studio-charcoal transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddPopularItem;
