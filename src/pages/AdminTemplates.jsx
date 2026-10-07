import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutTemplate,
  Plus,
  CheckCircle2,
  Copy,
  Sparkles,
  ArrowUpRight,
  Search,
  X,
  Palette,
  Check,
  Layers,
  Eye,
  Sliders,
  Filter
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const STORAGE_TEMPLATES_KEY = 'aiterior_studio_templates';

const initialTemplates = [
  {
    id: 'tpl-1',
    name: 'Nordic Japandi Sanctuary',
    category: 'living-room',
    badge: 'Bestseller Preset',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    desc:
      'Minimalist low-profile platform seating, light ash acoustic timber slats, and tactile bouclé upholstery with warm diffuse lighting.',
    palette: ['#EAE5D9', '#C2B8A3', '#5F5B52', '#2C2A29'],
    materials: ['Light Ash Wood', 'Bouclé Fabric', 'Japanese Washi Paper', 'Limewash'],
    prompt:
      'Nordic Japandi interior, low platform sofa, acoustic white oak slat wall, soft diffused paper lantern lighting, wabi-sabi aesthetics, architectural digest 8k'
  },
  {
    id: 'tpl-2',
    name: 'Modern Parisian Haussmann',
    category: 'living-room',
    badge: 'Classic Luxe',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    desc:
      'Ornate crown wall mouldings, French chevron oak parquet, Nero Marquina marble accents, and contemporary sculptural jewel-tone seating.',
    palette: ['#F7F5F0', '#D4AF37', '#333333', '#8B0000'],
    materials: ['Chevron Parquet', 'Calacatta Marble', 'Brushed Brass', 'Velvet'],
    prompt:
      'Modern Parisian apartment living room, Haussmann wall mouldings, marble fireplace, chevron oak flooring, modern brass chandelier, high ceiling luxury photography'
  },
  {
    id: 'tpl-3',
    name: 'Wabi-Sabi Organic Microcement',
    category: 'bedroom',
    badge: 'Trending Aesthetic',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    desc:
      'Seamless microcement textured surfaces, unrefined travertine pedestal blocks, raw organic linen bedding, and earthen pottery.',
    palette: ['#D6D1C7', '#A89F91', '#4A463D', '#1A1A1A'],
    materials: ['Microcement', 'Raw Travertine', 'Linen Textiles', 'Weathered Bronze'],
    prompt:
      'Wabi-Sabi master bedroom, seamless bone microcement walls and ceiling, floating low wooden bed, raw unpolished travertine nightstands, natural sunlight and shadows'
  },
  {
    id: 'tpl-4',
    name: 'Minimalist Penthouse Panorama',
    category: 'living-room',
    badge: 'Ultra Premium',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    desc:
      'Floor-to-ceiling panoramic glass vistas, floating monolithic marble fireplace, charcoal slate accents, and linear ambient cove lighting.',
    palette: ['#FFFFFF', '#C5C6C7', '#46484A', '#0B0C10'],
    materials: ['Floor Glass', 'Black Granite', 'Architectural Steel', 'Italian Leather'],
    prompt:
      'Ultra luxury penthouse interior, floor-to-ceiling glass wall overlooking city skyline, floating dark marble fireplace, Italian designer modular sofa, cinematic lighting'
  },
  {
    id: 'tpl-5',
    name: 'Warm Contemporary Biophilic',
    category: 'bedroom',
    badge: 'Eco Luxury',
    image:
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    desc:
      'Integrated indoor botanical planters, warm fluted walnut panelling, terracotta accessories, and earthy natural linen drapes.',
    palette: ['#F4F1EA', '#D2B48C', '#556B2F', '#3E2723'],
    materials: ['Fluted Walnut', 'Terracotta Clay', 'Indoor Foliage', 'Natural Rattan'],
    prompt:
      'Warm contemporary interior, integrated indoor garden planter, fluted walnut wooden wall panel, warm atmospheric lighting, serene luxury oasis'
  },
  {
    id: 'tpl-6',
    name: 'Bespoke Architectural Millwork',
    category: 'kitchen',
    badge: 'Masterwork System',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    desc:
      'Handleless fluted cabinetry, waterfall marble island counter, integrated ambient profile lighting, and concealed appliance pockets.',
    palette: ['#ECEBE9', '#9E9D89', '#383E38', '#1F2421'],
    materials: ['Matte Polyurethane', 'Quartz Waterfall', 'Integrated LED', 'Smoked Glass'],
    prompt:
      'Bespoke luxury modular kitchen, waterfall Calacatta gold marble island, dark sage matte handleless cabinetry, integrated warm LED cove lighting, architectural digest'
  }
];

const AdminTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'living-room',
    badge: 'Custom Studio Preset',
    image: '',
    desc: '',
    palette: ['#EAE5D9', '#C2B8A3', '#5F5B52', '#2C2A29'],
    materials: '',
    prompt: ''
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEMPLATES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTemplates(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load custom templates:', e);
    }
  }, []);

  const saveTemplatesToStorage = (updated) => {
    setTemplates(updated);
    try {
      localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist templates:', e);
    }
  };

  const handleCopyPrompt = (promptText, tplId) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(tplId);
    toast.success('AI Prompt copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied color ${color}`);
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.name.trim() || !newTemplate.desc.trim()) {
      toast.error('Template Name and Description are required');
      return;
    }

    const created = {
      id: `tpl-${Date.now()}`,
      name: newTemplate.name.trim(),
      category: newTemplate.category,
      badge: newTemplate.badge.trim() || 'Custom Studio Preset',
      image:
        newTemplate.image.trim() ||
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      desc: newTemplate.desc.trim(),
      palette: newTemplate.palette,
      materials: newTemplate.materials
        ? newTemplate.materials.split(',').map((m) => m.trim()).filter(Boolean)
        : ['Natural Wood', 'Stone', 'Linen'],
      prompt:
        newTemplate.prompt.trim() ||
        `${newTemplate.name} luxury interior design, architectural digest 8k photorealistic`
    };

    const updatedList = [created, ...templates];
    saveTemplatesToStorage(updatedList);
    toast.success(`Preset "${created.name}" created!`);
    setIsAddModalOpen(false);
    setNewTemplate({
      name: '',
      category: 'living-room',
      badge: 'Custom Studio Preset',
      image: '',
      desc: '',
      palette: ['#EAE5D9', '#C2B8A3', '#5F5B52', '#2C2A29'],
      materials: '',
      prompt: ''
    });
  };

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.materials && tpl.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="Design Style Presets & Templates"
      subtitle="ARCHITECTURAL MOODBOARDS • CURATED PALETTES • AI SPATIAL PRESETS"
      actions={
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/playground"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg hover:border-amber-400 hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Open AI Playground</span>
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Create Preset Template</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Header Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
              Active Presets
            </span>
            <div className="text-2xl font-extrabold text-stone-900">{templates.length}</div>
          </div>
          <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold block mb-1">
              Color Harmonies
            </span>
            <div className="text-2xl font-extrabold text-amber-900">{templates.length * 4}</div>
          </div>
          <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-blue-700 font-bold block mb-1">
              Active Filter
            </span>
            <div className="text-base font-bold text-blue-900 capitalize truncate mt-1">
              {selectedCategory.replace('-', ' ')}
            </div>
          </div>
          <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold block mb-1">
              AI Sync Status
            </span>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Spatial Engine Ready</span>
            </div>
          </div>
        </div>

        {/* 2. Filter & Search Bar */}
        <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'All Aesthetics' },
              { id: 'living-room', label: 'Living Rooms' },
              { id: 'bedroom', label: 'Bedrooms' },
              { id: 'kitchen', label: 'Kitchen & Millwork' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search style, wood, marble..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
            />
          </div>
        </div>

        {/* 3. Preset Templates Showcase Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="py-20 text-center bg-white border border-stone-200 rounded-xl shadow-xs">
            <LayoutTemplate className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-800">No matching templates found</h4>
            <p className="text-xs text-stone-500 mt-1">Try adjusting your category or search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => {
              const isCopied = copiedId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Cover */}
                    <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                      <img
                        src={tpl.image}
                        alt={tpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                          {tpl.badge}
                        </span>
                        <span className="bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs capitalize">
                          {tpl.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-stone-900 text-base group-hover:text-amber-800 transition-colors">
                          {tpl.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                          {tpl.desc}
                        </p>
                      </div>

                      {/* Signature Materials */}
                      {tpl.materials && tpl.materials.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {tpl.materials.map((mat, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium"
                            >
                              {mat}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Color Palette Swatches */}
                      <div className="pt-2 border-t border-stone-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Harmonious Palette
                          </span>
                          <span className="text-[10px] text-stone-400">Click swatch to copy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {tpl.palette.map((color, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleCopyColor(color)}
                              className="w-7 h-7 rounded-lg border border-stone-200 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                              style={{ backgroundColor: color }}
                              title={`Copy ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(tpl.prompt, tpl.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 hover:border-amber-400 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-500" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewingTemplate(tpl)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
                    >
                      <span>Full Spec</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. MODAL: CREATE PRESET TEMPLATE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full border border-stone-200 rounded-2xl shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Create New Style Preset
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Add a signature architectural aesthetic with color schemes and AI prompt triggers.
            </p>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Preset Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Bauhaus Glasshouse"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Room Category
                  </label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 cursor-pointer"
                  >
                    <option value="living-room">Living Room</option>
                    <option value="bedroom">Master Bedroom</option>
                    <option value="kitchen">Kitchen & Millwork</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Trending 2026"
                    value={newTemplate.badge}
                    onChange={(e) => setNewTemplate({ ...newTemplate, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newTemplate.image}
                  onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Atmospheric Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe the light, spatial feeling, and textures..."
                  value={newTemplate.desc}
                  onChange={(e) => setNewTemplate({ ...newTemplate, desc: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Key Materials (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smoked Oak, Roman Travertine, Bouclé"
                  value={newTemplate.materials}
                  onChange={(e) => setNewTemplate({ ...newTemplate, materials: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  AI Spatial Prompt (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Custom prompt instructions for the AI engine..."
                  value={newTemplate.prompt}
                  onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Save Preset Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: VIEW FULL TEMPLATE SPECIFICATION */}
      {viewingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full border border-stone-200 rounded-2xl shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setViewingTemplate(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/9] relative bg-stone-100">
              <img
                src={viewingTemplate.image}
                alt={viewingTemplate.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3">
                <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {viewingTemplate.badge}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  {viewingTemplate.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {viewingTemplate.desc}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Material Palette
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingTemplate.materials?.map((m, i) => (
                    <span key={i} className="text-xs bg-stone-100 px-2.5 py-1 rounded-md text-stone-800 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Color Harmony Hex Codes
                </span>
                <div className="flex items-center gap-2">
                  {viewingTemplate.palette?.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => handleCopyColor(c)}
                      className="px-2.5 py-1.5 rounded-lg border border-stone-200 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:border-stone-400 transition-colors"
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c }} />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-stone-700 block">
                  AI Synthesis Prompt:
                </span>
                <p className="text-xs text-stone-600 font-mono leading-relaxed">
                  "{viewingTemplate.prompt}"
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(viewingTemplate.prompt, viewingTemplate.id)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Copy AI Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTemplates;
