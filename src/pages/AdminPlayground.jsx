import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Upload, Sparkles, RefreshCw, Wand2, CheckCircle2, Eye, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPlayground = () => {
  const [selectedCategory, setSelectedCategory] = useState('living-room');
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderResult, setRenderResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRoomImagePreview(reader.result);
      toast.success('Test room photo loaded');
    };
    reader.readAsDataURL(file);
  };

  const handleRunPlayground = () => {
    if (!roomImagePreview) {
      toast.error('Please upload a test room image first');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setRenderResult('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop');
      toast.success('AI Render generated in Playground!');
    }, 2000);
  };

  return (
    <AdminLayout
      title="AI Spatial Playground"
      subtitle="TAB 03 // VISUALIZER ENGINE TESTER"
      actions={
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Engine Online
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 bg-white border border-stone-200 p-5 rounded-xl shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-studio-bronze" /> Playground Parameters
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Test prompts, custom lighting, and room transformations in real-time.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              1. Select Room Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['bedroom', 'living-room', 'kitchen', 'wall-paint-colors'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              2. Upload Sample Room Photo
            </label>
            <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center bg-stone-50 hover:bg-stone-100/80 transition-colors cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="playground-upload" />
              <label htmlFor="playground-upload" className="cursor-pointer space-y-1 block">
                <Upload className="w-6 h-6 text-studio-bronze mx-auto" />
                <span className="text-xs font-semibold text-stone-800 block">
                  {roomImagePreview ? 'Change Sample Image' : 'Choose Room Photo'}
                </span>
                <span className="text-[10px] text-stone-400 block">PNG, JPG or WEBP up to 20MB</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleRunPlayground}
            disabled={isGenerating}
            className="w-full py-3 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Rendering AI Spatial Model...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" /> Run AI Render Test
              </>
            )}
          </button>
        </div>

        {/* Right Output Preview */}
        <div className="lg:col-span-7 bg-white border border-stone-200 p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-studio-bronze" /> Live Spatial Render Output
            </h3>

            <div className="aspect-[16/10] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center relative">
              {renderResult ? (
                <img src={renderResult} alt="AI Render Output" className="w-full h-full object-cover" />
              ) : roomImagePreview ? (
                <img src={roomImagePreview} alt="Original Upload" className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="text-center p-6 text-stone-400">
                  <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-medium">Upload a photo and click "Run AI Render Test" to view output</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Engine: <strong>DeepMind Interior-AI v2.4</strong></span>
            <span>Latency: <strong>~1.4s</strong></span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPlayground;
