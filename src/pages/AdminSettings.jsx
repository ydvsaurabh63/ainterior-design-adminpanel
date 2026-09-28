import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Settings, Sliders, Database, Key, Shield, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [siteName, setSiteName] = useState('AURA AI Spatial Interior Studio');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('System settings saved successfully!');
  };

  return (
    <AdminLayout
      title="System Settings & API Configurations"
      subtitle="TAB 10 // PLATFORM CONFIGURATION"
    >
      <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-6">
        {/* Core Settings */}
        <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-studio-bronze" /> General Platform Settings
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Platform / Application Title</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div>
              <span className="font-bold text-xs text-stone-900 block">Maintenance Mode</span>
              <span className="text-[11px] text-stone-500 block">Temporarily restrict client access for upgrades</span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-4 h-4 text-studio-bronze focus:ring-studio-bronze rounded cursor-pointer"
            />
          </div>
        </div>

        {/* API Status Cards */}
        <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-studio-bronze" /> API & Cloud Connection Status
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-stone-700" />
                <div>
                  <span className="font-bold text-xs text-stone-900 block">MongoDB Database</span>
                  <span className="text-[10px] text-stone-500">Connected to Cluster Atlas</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Online
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-stone-700" />
                <div>
                  <span className="font-bold text-xs text-stone-900 block">Cloudinary Media Storage</span>
                  <span className="text-[10px] text-stone-500">Cloud ID: dpa4crgv5</span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Configured
              </span>
            </div>
          </div>
        </div>

        <button type="submit" className="px-5 py-2.5 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors">
          Save System Configuration
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
