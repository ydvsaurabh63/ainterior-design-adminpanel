import React from 'react';
import AdminLayout from './AdminLayout';
import { Sparkles, Plus, CheckCircle2, ArrowUpRight } from 'lucide-react';

const AdminUseCases = () => {
  const useCases = [
    {
      id: 1,
      title: 'Compact Urban Apartment Living Room',
      category: 'Living Room',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
      desc: 'Maximizing natural light and spatial flow using low-slung modular bouclé seating and travertine surfaces.',
      views: '1.4k'
    },
    {
      id: 2,
      title: 'Nordic Japandi Master Bedroom Suite',
      category: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
      desc: 'Fluted timber acoustic wall cladding paired with soft linen textures and warm cove sconce lighting.',
      views: '2.8k'
    },
    {
      id: 3,
      title: 'Calacatta Waterfall Culinary Monolith',
      category: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
      desc: 'Bookmatched Calacatta marble island paired with concealed pocket door storage and fluted oak joinery.',
      views: '3.1k'
    }
  ];

  return (
    <AdminLayout
      title="Use Cases & Transformation Scenarios"
      subtitle="TAB 04 // SHOWCASE SCENARIOS"
      actions={
        <button className="px-4 py-2 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-xs transition-colors">
          <Plus className="w-4 h-4" /> Add New Use Case
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {useCases.map((uc) => (
          <div key={uc.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img src={uc.image} alt={uc.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {uc.category}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-stone-900 text-sm leading-snug">{uc.title}</h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{uc.desc}</p>
              </div>
            </div>
            <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 mt-2">
              <span>{uc.views} Client Views</span>
              <button className="text-studio-bronze hover:underline font-semibold flex items-center gap-1">
                Edit Scenario <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminUseCases;
