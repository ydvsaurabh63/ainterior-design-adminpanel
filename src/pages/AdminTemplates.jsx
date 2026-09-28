import React from 'react';
import AdminLayout from './AdminLayout';
import { LayoutTemplate, Plus, CheckCircle2 } from 'lucide-react';

const AdminTemplates = () => {
  const templates = [
    {
      id: 'tpl-1',
      name: 'Nordic Japandi Sanctuary',
      palette: ['#EAE5D9', '#C2B8A3', '#5F5B52', '#2C2A29'],
      badge: 'Bestseller Preset',
      desc: 'Minimalist low-profile platform bedding, light ash acoustic timber slats, and tactile bouclé upholstery.'
    },
    {
      id: 'tpl-2',
      name: 'Modern Parisian Haussmann',
      palette: ['#F7F5F0', '#D4AF37', '#333333', '#8B0000'],
      badge: 'Classic Luxe',
      desc: 'Ornate ceiling moldings, herringbone oak parquet, marble mantels, and contemporary jewel-tone seating.'
    },
    {
      id: 'tpl-3',
      name: 'Wabi-Sabi Organic Microcement',
      palette: ['#D6D1C7', '#A89F91', '#4A463D', '#1A1A1A'],
      badge: 'Trending Scandi',
      desc: 'Tactile lime-wash mineral walls, unrefined travertine pedestal blocks, and raw linen acoustics.'
    }
  ];

  return (
    <AdminLayout
      title="Design Style Presets & Templates"
      subtitle="TAB 05 // AESTHETIC TEMPLATES"
      actions={
        <button className="px-4 py-2 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-xs transition-colors">
          <Plus className="w-4 h-4" /> Create Preset Template
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2.5 py-1 rounded">
                  {tpl.badge}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">{tpl.name}</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">{tpl.desc}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Color Swatches</span>
              <div className="flex gap-2">
                {tpl.palette.map((color) => (
                  <div key={color} className="w-7 h-7 rounded-md border border-stone-200 shadow-xs" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminTemplates;
